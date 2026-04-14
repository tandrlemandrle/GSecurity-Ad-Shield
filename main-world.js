(function () {
  if (window.__yasMainInjected) return;
  window.__yasMainInjected = true;

  const whitelist = [
    "twitter.com",
    "x.com",
    "perplexity.ai",
    "mediafire.com",
    "apple.com",
    "citibank.com",
    "ebay.com",
    "yahoo.com",
    "discord.com",
    "discordapp.com",
    "cdn.discordapp.com",
    "aliexpress.com",
    "tenor.com",
    "media.tenor.com",
    "wolt.com",
    "woltapp.com"
  ];

  const isWhitelistedHost = (host) => {
    const h = String(host || "").toLowerCase();
    return whitelist.some((domain) => h === domain || h.endsWith(`.${domain}`));
  };

  if (isWhitelistedHost(location.hostname)) return;
  const isYouTube = location.hostname.includes("youtube.com");

  const blockedDomainFragments = [
    "doubleclick.net",
    "googleadservices.com",
    "googlesyndication.com",
    "adservice.google.com",
    "adnxs.com",
    "taboola.com",
    "outbrain.com",
    "criteo.com",
    "scorecardresearch.com",
    "pubmatic.com",
    "rubiconproject.com",
    "google-analytics.com",
    "googletagmanager.com",
    "youtubeads.googleapis.com",
    "pubads.g.doubleclick.net",
    "ads.youtube.com",
    "analytics.youtube.com",
    "video-stats.video.google.com"
  ];

  const blockedUrlPattern = /(\/ads?\/|\/ad[sx]?\b|[?&](ad|ads|adunit|adformat|adtag)=|doubleclick|googlesyndication|googleadservices|taboola|outbrain|tracking|beacon|pixel)/i;

  const shouldBlockUrl = (rawUrl) => {
    if (typeof rawUrl !== "string" || !rawUrl) return false;
    const url = rawUrl.toLowerCase();
    try {
      const parsed = new URL(rawUrl, location.origin);
      if (isWhitelistedHost(parsed.hostname)) return false;
    } catch (_err) {
      // Non-URL strings still evaluated by pattern checks.
    }
    return blockedDomainFragments.some((d) => url.includes(d)) || blockedUrlPattern.test(url);
  };

  const stripAdKeys = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const adKeys = [
      "adPlacements",
      "adSlots",
      "playerAds",
      "adBreakHeartbeatParams",
      "ad3Module",
      "adSafetyReason",
      "adLoggingData",
      "showAdSlots"
    ];
    for (const key of adKeys) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        delete obj[key];
      }
    }
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === "object") {
        stripAdKeys(obj[key]);
      }
    }
    return obj;
  };

  const nativeParse = JSON.parse;
  JSON.parse = function (...args) {
    const parsed = nativeParse.apply(this, args);
    try {
      return stripAdKeys(parsed);
    } catch (_err) {
      return parsed;
    }
  };

  if (!isYouTube) {
    const nativeFetch = window.fetch;
    window.fetch = function (...args) {
      const target = typeof args[0] === "string" ? args[0] : args[0]?.url || "";
      if (shouldBlockUrl(target)) {
        return Promise.reject(new Error("Blocked by GSecurity Ad Shield"));
      }
      return nativeFetch.apply(this, args);
    };

    const nativeXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (shouldBlockUrl(typeof url === "string" ? url : "")) {
        return;
      }
      return nativeXhrOpen.call(this, method, url, ...rest);
    };
  }

  const defineGuardedGlobal = (prop) => {
    let value = window[prop];
    try {
      Object.defineProperty(window, prop, {
        configurable: true,
        get() {
          return value;
        },
        set(v) {
          value = stripAdKeys(v);
        }
      });
      window[prop] = value;
    } catch (_err) {
      // Ignore if page already defined as non-configurable.
    }
  };

  if (isYouTube) {
    defineGuardedGlobal("ytInitialPlayerResponse");
    defineGuardedGlobal("ytInitialData");
  }
})();
