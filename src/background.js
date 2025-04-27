// Import Firebase service as ES module
import firebaseService from './services/firebaseService.js';
import pollSleepStatus from './services/sleepDetectionService.js';

let activeTabId = null;
let sessionStart = null;
let currentDomain = null;
let sessionData = {};
let domainCache = {}; // For category caching

// Firebase project details
const firebaseConfig = {
  projectId: "focus-ai-1ab01",
  apiKey: "AIzaSyA6P_oLG0CNgv5nQyBaIuQivESagWGSF7Y"
};

// Function to calculate session duration
function calculateDuration() {
  if (!sessionStart) return 0;
  return (Date.now() - sessionStart) / 1000; // Convert ms to seconds
}
function playBeep() {
  // Use Chrome TTS to emit a brief tone
  chrome.tts.speak('you are being distracted please refocus sir ', {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    enqueue: false
  });
}

function playBeepSleep() {
  // Use Chrome TTS to emit a brief tone
  chrome.tts.speak('you are sleeping please wake up sir', {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    enqueue: false
  });
}

// Import category utilities
import { fetchCategoryFromAPI, getDomainFromURL } from './services/categoryService.js';
import { score } from './mlModel.js';

// Category encoding for ML input
const CATEGORY_ENCODING = {
  'Social Media': 0,
  'Streaming': 1,
  'Forum': 2,
  'Messaging': 3,
  'Video': 4,
  'Education': 5,
  'Productivity': 6,
  'Email': 7,
  'Professional Networking': 8,
  'Shopping': 9,
  'News': 10,
  'Unknown': 11
};

// Rule-based thresholds for each category (in seconds)
const CATEGORY_THRESHOLDS = {
  'Social Media': 30,
  'Streaming': 30,
  'Forum': 30,
  'Messaging': 30,
  'Video': 30,
  'Shopping': 30,
  'Education': 15,
  'Productivity': 15,
  'Email': 10,
  'Professional Networking': 15,
  'News': 10,
  'Unknown': 20
};

// Which categories are 'distracting' vs 'productive'
const DISTRACTING_CATEGORIES = [
  'Social Media', 'Streaming', 'Forum', 'Messaging', 'Video', 'Shopping'
];

// --- Sleep Detection Integration ---
// Initialize sleep detection with custom callbacks
pollSleepStatus({
  onInitial: () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Sleep Detected',
      message: 'You appear to be sleeping. Please wake up!'
    });
  },
  on10Sec: () => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Sleep Detected (10s)',
      message: 'You have been sleeping for 10 seconds. Please wake up!'
    });
    playBeepSleep();
  }
});
// --- End Sleep Detection Integration ---

const PRODUCTIVE_CATEGORIES = [
  'Education', 'Productivity', 'Email', 'Professional Networking', 'News'
];

// Global timeout ID to avoid overlapping notifications
let distractionTimeoutId = null;

// Helper: Rule-based notification logic
function checkSessionRuleBased(session) {
  const category = session.category || 'Unknown';
  const threshold = CATEGORY_THRESHOLDS[category] ?? CATEGORY_THRESHOLDS['Unknown'];
  const duration = session.duration;
  console.log('[RULE CHECK]', { category, duration, threshold, session });
  if (duration < threshold) return; // No notification if below threshold
  if (DISTRACTING_CATEGORIES.includes(category)) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Focus Shield Alert',
      message: 'You are being distracted! Please refocus.'
    });
    playBeep();
  } 
  else if (PRODUCTIVE_CATEGORIES.includes(category)) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Focus Shield Alert',
      message: 'Congratulations, you are focused in this session.'
    });
  }
}

// Helper: Schedule distracting notification after 10s from session start
function scheduleDistractingCheck(tabId, domain, category) {
  console.log('[SCHEDULE CHECK]', { tabId, domain, category, activeTabId, currentDomain });
  // Clear any previous pending notification
  if (distractionTimeoutId) {
    clearTimeout(distractionTimeoutId);
    distractionTimeoutId = null;
  }
  distractionTimeoutId = setTimeout(() => {
    console.log('[CHECK NOTIFY]', { tabId, domain, category, activeTabId, currentDomain });
    // Only notify if still on the same tab and domain
    if (activeTabId === tabId && currentDomain === domain && DISTRACTING_CATEGORIES.includes(category)) {
      console.log('[NOTIFY] Distracting site detected:', domain, category);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Focus Shield Alert',
        message: 'You are being distracted! Please refocus.'
      });
      playBeep();
    } else {
      console.log('[NO NOTIFY] Not on distracting site or tab/domain changed.');
    }
    // ML-based check
    const catCode = CATEGORY_ENCODING[category] ?? CATEGORY_ENCODING['Unknown'];
    const duration = calculateDuration();
    const inputVector = [catCode, duration, 0, 0, 0, 0];
    const [pNotDistracted, pDistracted] = score(inputVector);
    console.log('[ML CHECK]', { pNotDistracted, pDistracted, inputVector });
    if (activeTabId === tabId && currentDomain === domain && pDistracted > pNotDistracted) {
      console.log('[ML NOTIFY] ML detected distraction:', domain, category);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Focus Shield (ML)',
        message: 'You are being distracted. Please refocus.'
      });
    }
    distractionTimeoutId = null;
  }, 10000); // 10 seconds
}

// Safe message sending to avoid "receiver not exists" errors
function safeSendMessage(message) {
  try {
    chrome.runtime.sendMessage(message, response => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.log('Message sending failed:', lastError.message);
        // This is expected if popup is closed
      }
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

// Save a session to local storage and Firestore
async function saveSession(sessionData) {
  const { url, domain, category, duration, timestamp } = sessionData;
  const sessionEntry = { url: url || '', domain, category, duration, timestamp };

  try {
    // Save to local storage
    await new Promise((resolve) => {
      chrome.storage.local.get({ sessions: [] }, (result) => {
        const updatedSessions = [...result.sessions, sessionEntry];
        // Keep only most recent 100 sessions to prevent storage issues
        const trimmedSessions = updatedSessions.slice(-100);
        chrome.storage.local.set({ sessions: trimmedSessions }, () => {
          console.log("✅ Session saved locally.");
          resolve(true);
        });
      });
    });
    // Try to save to Firestore
    try {
      const saved = await firebaseService.saveSessionToFirestore(sessionEntry);
      if (saved) {
        console.log("📦 Session saved to Firestore.");
      }
    } catch (error) {
      console.error("❌ Failed to save to Firestore:", error);
    }
    // No delayed rule-based check on session end
    return true;
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
}

// Function to process tabs and update tracking state
async function processActiveTab(tabId, url) {
  if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
    // Cancel any pending notification if navigating to a non-trackable page
    if (distractionTimeoutId) {
      clearTimeout(distractionTimeoutId);
      distractionTimeoutId = null;
    }
    return; // Ignore Chrome internal pages
  }
  try {
    // Extract domain from URL
    const domain = getDomainFromURL(url);

    // Cancel any pending notification if tab or domain changes
    if (currentDomain !== domain || activeTabId !== tabId) {
      if (distractionTimeoutId) {
        clearTimeout(distractionTimeoutId);
        distractionTimeoutId = null;
      }
    }

    // If this is a new domain or tab, save the previous session
    if (currentDomain && currentDomain !== domain && sessionStart) {
      const duration = calculateDuration();
      if (duration > 1) { // Only record sessions longer than 1 second
        const timestamp = Date.now().toString();
        const sessionEntry = {
          url: url,
          domain: currentDomain,
          category: sessionData.category || 'Unknown',
          duration: duration,
          timestamp: timestamp
        };
        await saveSession(sessionEntry);
      }
      sessionStart = null;
      sessionData = {};
    }
    // Always schedule a distracting notification on tab/domain switch
    sessionStart = sessionStart || Date.now();
    currentDomain = domain;
    activeTabId = tabId;
    fetchCategoryFromAPI(domain).then(category => {
      sessionData.category = category;
      console.log('[PROCESS TAB] Scheduling distracting check for', { tabId, domain, category });
      scheduleDistractingCheck(tabId, domain, category);
    });
    // Update storage with active domain
    chrome.storage.local.set({ 
      activeDomain: domain,
      lastActivity: Date.now()
    });
  } catch (error) {
    console.error("Error processing tab:", error);
  }
}

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.local.get('isTracking', (data) => {
    if (!data.isTracking) return;
    activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeTabId, (tab) => {
      if (tab && tab.url) {
        processActiveTab(activeTabId, tab.url);
      }
    });
  });
});

// Listen for tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    chrome.storage.local.get('isTracking', (data) => {
      if (data.isTracking) {
        processActiveTab(tabId, changeInfo.url);
      }
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "start-session":
      // Reset and start tracking
      sessionStart = Date.now();
      chrome.storage.local.set({ isTracking: true }, () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]) {
            activeTabId = tabs[0].id;
            processActiveTab(activeTabId, tabs[0].url);
          }
        });
      });
      sendResponse({ success: true });
      break;
    case "stop-session":
      // Stop tracking and record final session
      if (sessionStart && currentDomain) {
        const duration = calculateDuration();
        if (duration > 1) {
          const timestamp = Date.now().toString();
          const sessionEntry = {
            url: sessionData.url,
            domain: currentDomain,
            category: sessionData.category || 'Unknown',
            duration: duration,
            timestamp: timestamp
          };
          // Save final session
          saveSession(sessionEntry);
        }
      }
      // Reset tracking state
      sessionStart = null;
      currentDomain = null;
      sessionData = {};
      chrome.storage.local.set({ isTracking: false });
      sendResponse({ success: true });
      break;
    case "refresh-sessions":
      // No-op, just a placeholder for popup to trigger refresh
      sendResponse({ success: true });
      break;
    case "get-category":
      // Handle category requests
      fetchCategoryFromAPI(request.domain).then(category => {
        sendResponse({ category: category });
      }).catch(err => {
        console.error("Error getting category:", err);
        sendResponse({ category: 'Unknown', error: err.message });
      });
      return true; // For async response
      
    case "get-tracking-status":
      // Return the current tracking status
      chrome.storage.local.get(['isTracking', 'activeDomain'], (data) => {
        sendResponse({
          isTracking: !!data.isTracking,
          activeDomain: data.activeDomain || null,
          sessionStart: sessionStart,
          currentDuration: sessionStart ? calculateDuration() : 0
        });
      });
      return true; // For async response
    default:
      sendResponse({ success: false, error: "Unknown action" });
  }
  return true;
});

// Restore domain cache and tracking state on startup
chrome.storage.local.get({
  domainCategories: {},
  isTracking: false 
}, (result) => {
  domainCache = result.domainCategories;
  console.log(`📊 Loaded ${Object.keys(domainCache).length} domain categories from cache`);
  // If was tracking before restart, restart tracking
  if (result.isTracking) {
    console.log("Resuming tracking after extension restart");
    sessionStart = Date.now();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        activeTabId = tabs[0].id;
        processActiveTab(activeTabId, tabs[0].url);
      }
    });
  }
});

// Test Firebase connection on startup
firebaseService.testFirebaseConnection().then(connected => {
  if (connected) {
    console.log("✅ Firebase connected");
  } else {
    console.log("❌ Firebase not connected");
  }
});

// // --- Chrome Idle API: Idle Notification ---
// let lastIdleState = 'active';
// let idleStartTime = null;
// const IDLE_THRESHOLD_SECONDS = 10; // 10 seconds

// chrome.idle.onStateChanged.addListener(function(newState) {
//   if (newState === 'idle') {
//     idleStartTime = Date.now();
//     lastIdleState = 'idle';
//     // Show notification immediately when idle
//     chrome.notifications.create({
//       type: 'basic',
//       iconUrl: 'icons/icon128.png',
//       title: 'Focus Shield',
//       message: 'You are now idle.'
//     });
//   } else if (newState === 'active' && lastIdleState === 'idle' && idleStartTime) {
//     // On return to active, show how long user was idle
//     const idleDuration = Math.round((Date.now() - idleStartTime) / 1000);
//     chrome.notifications.create({
//       type: 'basic',
//       iconUrl: 'icons/icon128.png',
//       title: 'Focus Shield',
//       message: `You were idle for ${idleDuration} seconds.`
//     });
//     idleStartTime = null;
//     lastIdleState = 'active';
//   } else {
//     lastIdleState = newState;
//   }
// });

// // Set the idle detection interval
// chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);
