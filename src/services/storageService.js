// Import Firebase service
import firebaseService from './firebaseService';

// Cache for domain categories to reduce API calls
const domainCache = {};

// Extract domain from URL
export const getDomainFromURL = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Get category from API with caching
export const fetchCategoryFromAPI = async (domain) => {
  // Check cache first
  if (domainCache[domain]) {
    console.log(`📊 Category for ${domain} found in cache: ${domainCache[domain]}`);
    return domainCache[domain];
  }

  // API key should be stored in a config file or environment variable in production
  const apiKey = 'at_YCmq89KYxTR0JxtM1aU5WLHv0oYlQ';
  const apiUrl = `https://website-categorization.whoisxmlapi.com/api/v2?apiKey=${apiKey}&domainName=${domain}`;

  try {
    console.log(`📡 Fetching category for ${domain}`);
    const response = await fetch(apiUrl);
    const data = await response.json();
    const category = (data.categories && data.categories.length > 0) ? data.categories[0].name : 'Unknown';
    
    // Update cache
    domainCache[domain] = category;
    console.log(`✅ Category for ${domain} is ${category}`);
    
    // Store cache in local storage for persistence
    chrome.storage.local.set({ domainCategories: domainCache });
    
    return category;
  } catch (error) {
    console.error(`❌ API Error for ${domain}:`, error);
    return 'Unknown';
  }
};

// Load cached categories from storage on initialization
export const initializeDomainCache = async () => {
  chrome.storage.local.get({ domainCategories: {} }, (result) => {
    Object.assign(domainCache, result.domainCategories);
    console.log(`📊 Loaded ${Object.keys(domainCache).length} domain categories from cache`);
  });
};

// Initialize the cache when this module is imported
initializeDomainCache();

// Get all sessions from local storage and merge with Firestore data
export const getSessions = async () => {
  try {
    // Get local sessions
    const localSessions = await new Promise((resolve) => {
      chrome.storage.local.get({ sessions: [] }, (result) => {
        resolve(result.sessions);
      });
    });
    
    // Try to fetch Firestore sessions
    let firestoreSessions = [];
    try {
      firestoreSessions = await firebaseService.getSessionsFromFirestore();
    } catch (error) {
      console.error("Failed to get Firestore sessions:", error);
    }
    
    // Merge sessions, removing duplicates (by timestamp)
    const allSessions = [...localSessions];
    
    // Add Firestore sessions that aren't in local storage
    for (const fsSession of firestoreSessions) {
      if (!allSessions.some(ls => ls.timestamp === fsSession.timestamp)) {
        allSessions.push(fsSession);
      }
    }
    
    // Sort sessions by timestamp in descending order (newest first)
    const sortedSessions = allSessions.sort((a, b) => 
      parseInt(b.timestamp) - parseInt(a.timestamp)
    );
    
    // Limit to most recent 20 sessions for performance
    return sortedSessions.slice(0, 20);
  } catch (error) {
    console.error("Error getting sessions:", error);
    return [];
  }
};

// Save a session to local storage and Firestore
export const saveSession = async (sessionData) => {
  try {
    // Save to local storage
    await new Promise((resolve) => {
      chrome.storage.local.get({ sessions: [] }, (result) => {
        const updatedSessions = [...result.sessions, sessionData];
        
        // Keep only most recent 100 sessions to prevent storage issues
        const trimmedSessions = updatedSessions.slice(-100);
        
        chrome.storage.local.set({ sessions: trimmedSessions }, () => {
          console.log("✅ Session saved locally.");
          resolve(true);
        });
      });
    });
    
    // Save to Firestore in parallel
    firebaseService.saveSessionToFirestore(sessionData)
      .then(success => {
        if (success) {
          console.log("✅ Session saved to Firestore.");
        }
      })
      .catch(error => {
        console.error("❌ Failed to save to Firestore:", error);
      });
    
    return true;
  } catch (error) {
    console.error("Error saving session:", error);
    return false;
  }
};

// Clear all sessions from local storage
export const clearSessions = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ sessions: [] }, () => {
      console.log("Session data cleared from local storage.");
      resolve(true);
    });
  });
};

// Set tracking status
export const setTrackingStatus = async (isTracking) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ isTracking }, () => {
      resolve(true);
    });
  });
};

// Get tracking status
export const getTrackingStatus = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({ isTracking: false }, (result) => {
      resolve(result.isTracking);
    });
  });
};