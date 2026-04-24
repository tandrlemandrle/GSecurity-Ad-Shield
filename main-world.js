/**
 * GSecurity Ad Shield — Main-world script.
 * Intercepts JSON.parse, fetch, XHR, and YouTube global objects
 * to strip ad payloads before they reach the page.
 */
(function () {
  if (window.__gsecMainInjected) return;
  window.__gsecMainInjected = true;

  const isYouTube =
    location.hostname.includes("youtube.com") ||
    location.hostname.includes("youtube-nocookie.com");

  /* ── Blocked ad/tracking domains ── */
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
    "googletagservices.com",
    "youtubeads.googleapis.com",
    "pubads.g.doubleclick.net",
    "ads.youtube.com",
    "analytics.youtube.com",
    "video-stats.video.google.com",
    "amazon-adsystem.com",
    "ads-twitter.com",
    "static.ads-twitter.com",
    "advertising.com",
    "adsafeprotected.com",
    "moatads.com",
    "advertising.yahoo.com",
    "adtech.de",
    "adform.net",
    "serving-sys.com",
    "facebook.com/tr",
    "connect.facebook.net",
    "pixel.facebook.com",
    "analytics.twitter.com",
    "pixel.reddit.com",
    "ads.linkedin.com",
    "analytics.tiktok.com",
    "hotjar.com",
    "fullstory.com",
    "segment.io",
    "segment.com",
    "mixpanel.com",
    "amplitude.com",
    "quantserve.com",
    "quantcast.com",
    "chartbeat.com",
    "newrelic.com",
    /* ── Additional domains from d3ward test ── */
    "mouseflow.com",
    "luckyorange.com",
    "freshmarketer.com",
    "stats.wp.com",
    "notify.bugsnag.com",
    "browser.sentry-cdn.com",
    "ads.pinterest.com",
    "events.redditmedia.com",
    "samsungads.com",
    "metrics.apple.com",
    "api.ad.xiaomi.com",
    "unityads.unity3d.com",
    "byteoversea.com",
    "yahooinc.com",
    "appmetrica.yandex.com",
    "yandexadexchange.net"
  ];

  const blockedPatterns = [
    "/api/stats/ads",
    "/api/stats/atr",
    "/pagead/",
    "/ptracking",
    "/ad?",
    "/ads?",
    "/advert",
    "/sponsored",
    "/promotion",
    "/tracking",
    "/analytics",
    "/collect?",
    "/beacon",
    "/pixel",
    "/imp?",
    "/impression",
    "/click?",
    "ad_banner",
    "ad_frame",
    "sponsored_content",
    "promo_banner",
    /* ── Additional URL path patterns ── */
    "/ad_banner",
    "/ad_frame",
    "/ads/banner"
  ];

  const blockedUrlRegex =
    /(\/ads?\/|\/ad[sx]?\b|[?&](ad|ads|adunit|adformat|adtag)=|doubleclick|googlesyndication|googleadservices|taboola|outbrain|tracking|beacon|pixel)/i;

  const shouldBlockUrl = (rawUrl) => {
    if (typeof rawUrl !== "string" || !rawUrl) return false;
    const url = rawUrl.toLowerCase();
    return (
      blockedDomainFragments.some((d) => url.includes(d)) ||
      blockedPatterns.some((p) => url.includes(p)) ||
      blockedUrlRegex.test(url)
    );
  };

  /* ── YouTube ad-key stripping ── */
  const adKeys = [
    "adPlacements",
    "adSlots",
    "playerAds",
    "adBreakHeartbeatParams",
    "ad3Module",
    "adSafetyReason",
    "adLoggingData",
    "showAdSlots",
    "adBreakParams",
    "adBreakStatus",
    "adVideoId",
    "adLayoutLoggingData",
    "instreamAdPlayerOverlayRenderer",
    "adPlacementConfig",
    "adVideoStitcherConfig"
  ];

  const stripAdKeys = (obj, depth) => {
    if (!obj || typeof obj !== "object" || depth > 12) return obj;
    for (const key of adKeys) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        delete obj[key];
      }
    }
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === "object") {
        stripAdKeys(obj[key], depth + 1);
      }
    }
    return obj;
  };

  /* ── JSON.parse hook ── */
  const nativeParse = JSON.parse;
  JSON.parse = function (...args) {
    const parsed = nativeParse.apply(this, args);
    try {
      if (parsed && typeof parsed === "object") {
        stripAdKeys(parsed, 0);
      }
    } catch (_) {}
    return parsed;
  };

  /* ── fetch / XHR interception (non-YouTube — YouTube uses JSON stripping) ── */
  if (!isYouTube) {
    const nativeFetch = window.fetch;
    window.fetch = function (...args) {
      const target =
        typeof args[0] === "string" ? args[0] : args[0]?.url || "";
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

  /* ── Guard YouTube global objects ── */
  const defineGuardedGlobal = (prop) => {
    let value = window[prop];
    try {
      Object.defineProperty(window, prop, {
        configurable: true,
        get() {
          return value;
        },
        set(v) {
          if (v && typeof v === "object") stripAdKeys(v, 0);
          value = v;
        }
      });
      if (value) window[prop] = value;
    } catch (_) {}
  };

  if (isYouTube) {
    defineGuardedGlobal("ytInitialPlayerResponse");
    defineGuardedGlobal("ytInitialData");
    defineGuardedGlobal("ytcfg");
  }
})();
