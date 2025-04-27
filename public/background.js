// Import Firebase service as ES module
import firebaseService from './firebaseService.js';

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

// Extract domain from URL
function getDomainFromURL(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return '';
  }
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
  const sessionEntry = { url, domain, category, duration, timestamp };

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
    
    return true;
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
}

// Fetch category from API
async function fetchCategoryFromAPI(domain) {
  // Check cache first
  if (domainCache[domain]) {
    return domainCache[domain];
  }

  const apiKey = 'at_YCmq89KYxTR0JxtM1aU5WLHv0oYlQ';
  const apiUrl = `https://website-categorization.whoisxmlapi.com/api/v2?apiKey=${apiKey}&domainName=${domain}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const category = (data.categories && data.categories.length > 0) ? data.categories[0].name : 'Unknown';
    
    // Update cache
    domainCache[domain] = category;
    
    // Store cache in local storage
    chrome.storage.local.set({ domainCategories: domainCache });
    
    return category;
  } catch (error) {
    console.error("❌ API Error:", error);
    return 'Unknown';
  }
}

// Function to process tabs and update tracking state
async function processActiveTab(tabId, url) {
  if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
    return; // Ignore Chrome internal pages
  }

  try {
    // Extract domain from URL
    const domain = getDomainFromURL(url);
    
    // If this is a new domain or tab, save the previous session
    if (currentDomain && currentDomain !== domain && sessionStart) {
      const duration = calculateDuration();
      
      if (duration > 1) { // Only record sessions longer than 1 second
        const timestamp = Date.now().toString();
        const sessionEntry = {
          url: sessionData.url,
          domain: currentDomain,
          category: sessionData.category || 'Unknown',
          duration: duration,
          timestamp: timestamp
        };
        
        // Save session data
        await saveSession(sessionEntry);
        
        // Notify popup to refresh if open
        safeSendMessage({ action: "refresh-sessions" });
      }
    }
    
    // Update current session information
    currentDomain = domain;
    sessionData = {
      url: url,
      domain: domain,
      category: 'Unknown', // Will be updated via API
      timestamp: Date.now()
    };
    
    // If we weren't already tracking, start now
    if (!sessionStart) {
      sessionStart = Date.now();
    }
    
    // Get category for domain
    fetchCategoryFromAPI(domain).then(category => {
      if (category) {
        sessionData.category = category;
      }
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
  }
  
  // Always return true for async response
  return true;
});

// Initialize by loading cached categories and check tracking state
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
    console.log("✅ Firebase connection successful!");
  } else {
    console.error("❌ Firebase connection failed!");
  }
}).catch(err => {
  console.error("❌ Firebase connection test failed:", err);
});

console.log("Focus Shield background script initialized!");