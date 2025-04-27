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

// Manual mapping of known domains to categories
const MANUAL_CATEGORY_MAP = {
  // Social Media
  'instagram.com': 'Social Media',
  'facebook.com': 'Social Media',
  'twitter.com': 'Social Media',
  'tiktok.com': 'Social Media',
  'snapchat.com': 'Social Media',
  'linkedin.com': 'Professional Networking',
  'reddit.com': 'Forum',
  'pinterest.com': 'Social Media',
  // Messaging
  'whatsapp.com': 'Messaging',
  'telegram.org': 'Messaging',
  'discord.com': 'Messaging',
  'slack.com': 'Messaging',
  // Video & Streaming
  'youtube.com': 'Video',
  'netflix.com': 'Streaming',
  'primevideo.com': 'Streaming',
  'hotstar.com': 'Streaming',
  'twitch.tv': 'Streaming',
  // Education & Coding
  'leetcode.com': 'Education',
  'codechef.com': 'Education',
  'hackerrank.com': 'Education',
  'geeksforgeeks.org': 'Education',
  'coursera.org': 'Education',
  'udemy.com': 'Education',
  'edx.org': 'Education',
  'chatgpt.com':'Education',
  'khanacademy.org': 'Education',
  'brilliant.org': 'Education',
  'console.firebase.google.com':'Education',
  // Productivity/Tools
  'gmail.com': 'Email',
  'mail.google.com': 'Email',
  'outlook.com': 'Email',
  'drive.google.com': 'Productivity',
  'docs.google.com': 'Productivity',
  'sheets.google.com': 'Productivity',
  'calendar.google.com': 'Productivity',

  // Shopping
  'amazon.com': 'Shopping',
  'flipkart.com': 'Shopping',
  'myntra.com': 'Shopping',
  'ebay.com': 'Shopping',
  // News
  'nytimes.com': 'News',
  'bbc.com': 'News',
  'cnn.com': 'News',
  'theguardian.com': 'News',
  // Add more as needed
};

// Get category from API with caching
export const fetchCategoryFromAPI = async (domain) => {
  // Manual override for known sites
  if (MANUAL_CATEGORY_MAP[domain]) {
    console.log(`📝 Manual category for ${domain}: ${MANUAL_CATEGORY_MAP[domain]}`);
    domainCache[domain] = MANUAL_CATEGORY_MAP[domain];
    chrome.storage.local.set({ domainCategories: domainCache });
    return MANUAL_CATEGORY_MAP[domain];
  }

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
(async () => {
  chrome.storage.local.get({ domainCategories: {} }, (result) => {
    Object.assign(domainCache, result.domainCategories);
    console.log(`📊 Loaded ${Object.keys(domainCache).length} domain categories from cache`);
  });
})();