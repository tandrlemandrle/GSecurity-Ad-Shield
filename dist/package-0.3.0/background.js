// PAC file rules converted to declarativeNetRequest format
const blacklist = [
  "ad.doubleclick.net",
  "static.doubleclick.net",
  "r4---sn-a5meknlz.googlevideo.com",
  "youtubeads.googleapis.com",
  "r3---sn-a5meknlz.googlevideo.com",
  "pubads.g.doubleclick.net",
  "googleadservices.com",
  "r9---sn-a5meknlz.googlevideo.com",
  "r8---sn-a5meknlz.googlevideo.com",
  "r7---sn-a5meknlz.googlevideo.com",
  "r6---sn-a5meknlz.googlevideo.com",
  "pagead2.googlesyndication.com",
  "r5---sn-a5meknlz.googlevideo.com",
  "r1---sn-a5meknlz.googlevideo.com",
  "googleads.g.doubleclick.net",
  "www.googletagservices.com",
  "analytics.youtube.com",
  "adservice.google.co.in",
  "ads.youtube.com",
  "partner.googleadservices.com",
  "adservice.google.com",
  "r2---sn-a5meknlz.googlevideo.com",
  "video-stats.video.google.com",
  "www.googleadservices.com"
];

// Generate declarativeNetRequest rules for specific hosts only
const generateRules = () => {
  const rules = [];

  // Blacklist rules (only for domains we have permission to access)
  blacklist.forEach((domain, index) => {
    rules.push({
      id: index + 1,
      priority: 1000,
      action: { type: "block" },
      condition: {
        urlFilter: `*://${domain}/*`,
        resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"]
      }
    });
  });

  // YouTube-specific ad blocking rules
  const youtubePatterns = [
    "*://*.youtube.com/*/ad*",
    "*://*.youtube.com/*ads*",
    "*://*.youtube.com/*doubleclick*",
    "*://*.googlevideo.com/*/ad*",
    "*://*.googlevideo.com/*ads*"
  ];

  youtubePatterns.forEach((pattern, index) => {
    rules.push({
      id: blacklist.length + index + 1,
      priority: 800,
      action: { type: "block" },
      condition: {
        urlFilter: pattern,
        resourceTypes: ["script", "image", "object", "xmlhttprequest", "sub_frame"]
      }
    });
  });

  // Google ad server blocking
  const googleAdPatterns = [
    "*://*.googlesyndication.com/*",
    "*://*.doubleclick.net/*",
    "*://*.googleadservices.com/*",
    "*://*.googletagmanager.com/*"
  ];

  googleAdPatterns.forEach((pattern, index) => {
    rules.push({
      id: blacklist.length + youtubePatterns.length + index + 1,
      priority: 900,
      action: { type: "block" },
      condition: {
        urlFilter: pattern,
        resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"]
      }
    });
  });

  return rules;
};

// Install rules on extension startup
chrome.runtime.onInstalled.addListener(() => {
  const rules = generateRules();

  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const ruleIds = existingRules.map(rule => rule.id);
    
    // Remove existing rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    }, () => {
      // Add new rules
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      }, () => {
        console.log(`Installed ${rules.length} blocking rules`);
        if (chrome.runtime.lastError) {
          console.error("Error installing rules:", chrome.runtime.lastError);
        }
      });
    });
  });
});
