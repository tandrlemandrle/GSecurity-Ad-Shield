(function () {
  if (window.__yasMainInjected) return;
  window.__yasMainInjected = true;

  const whitelist = [
    "twitter.com",
    "x.com",
    "perplexity.ai",
    "mediafire.com",
    "apple.com",
    "schooner.com",
    "citibank.com",
    "ebay.com",
    "yahoo.com",
    "discord.com",
    "click.discord.com",
    "discordapp.com",
    "cdn.discordapp.com",
    "cdn.discord.app",
    "discord.gg",
    "discord.media",
    "discordapp.net",
    "media.discordapp.net",
    "discordstatus.com",
    "dis.gd",
    "discordcdn.com",
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

  const adDomainRegex = /^(?:.*[-_.])?(ads?|adv(ert(s|ising)?)?|banners?|track(er|ing|s)?|beacons?|doubleclick|adservice|adnxs|adtech|googleads|gads|adwords|partner|sponsor(ed)?|click(s|bank|tale|through)?|pop(up|under)s?|promo(tion)?|market(ing|er)?|affiliates?|metrics?|stat(s|counter|istics)?|analytics?|pixel(s)?|campaign|traff(ic|iq)|monetize|syndicat(e|ion)|revenue|yield|impress(ion)?s?|conver(sion|t)?|audience|target(ing)?|behavior|profil(e|ing)|telemetry|survey|poll|outbrain|taboola|quantcast|scorecard|omniture|comscore|krux|bluekai|exelate|adform|adroll|rubicon|vungle|inmobi|flurry|mixpanel|heap|amplitude|optimizely|bizible|pardot|hubspot|marketo|eloqua|salesforce|media(math|net)|criteo|appnexus|turn|adbrite|admob|adsonar|adscale|zergnet|revcontent|mgid|nativeads|contentad|displayads|bannerflow|adblade|adcolony|chartbeat|newrelic|pingdom|gauges|kissmetrics|webtrends|tradedesk|bidder|auction|rtb|programmatic|splash|interstitial|overlay)\./i;

  const adUrlRegex = /(?:\/(?:adcontent|img\/adv|web\-ad|iframead|contentad|ad\/image|video\-ad|stats\/event|xtclicks|adscript|bannerad|googlead|adhandler|adimages|embed\-log|adconfig|tracking\/track|tracker\/track|adrequest|nativead|adman|advertisement|adframe|adcontrol|adoverlay|adserver|adsense|google\-ads|ad\-banner|banner\-ad|campaign\/advertiser|adplacement|adblockdetect|advertising|admanagement|adprovider|adrotation|adtop|adbottom|adleft|adright|admiddle|adlarge|adsmall|admicro|adunit|adcall|adlog|adcount|adserve|adsrv|adsys|adtrack|adview|adwidget|adzone|banner\/adv|google_tag|image\/ads|sidebar\-ads|footer\-ads|top\-ads|bottom\-ads|new\-ads|search\-ads|lazy\-ads|responsive\-ads|dynamic\/ads|external\/ads|mobile\-ads|house\-ads|blog\/ads|online\/ads|pc\/ads|left\-ads|right\-ads|ads\/square|ads\/text|ads\/html|ads\/js|ads\.php|ad\.js|ad\.css|\?affiliate=|\?advertiser=|\&adspace=|\&adserver=|\&adgroupid=|\&adpageurl=|\.adserve|\.ads\d|\.adspace|\.adsense|\.adserver|\.google\-ads|\.banner\-ad|\.ad\-banner|\.adplacement|\.advertising|\.admanagement|\.adprovider|\.adrotation|\.adtop|\.adbottom|\.adleft|\.adright|\.admiddle|\.adlarge|\.adsmall|\.admicro|\.adunit|\.adcall|\.adlog|\.adcount|\.adserve|\.adsrv|\.adsys|\.adtrack|\.adview|\.adwidget|\.adzone|xss))/i;

  const adSubdomainRegex = /^(?:adcreative(s)?|imageserv|media(mgr)?|stats|switch|track(2|er)?|view|ad(s)?\d{0,3}|banner(s)?\d{0,3}|click(s)?\d{0,3}|count(er)?\d{0,3}|servedby\d{0,3}|toolbar\d{0,3}|pageads\d{0,3}|pops\d{0,3}|promos\d{0,3})\./i;

  const adWebBugRegex = /(?:\/(?:1|blank|b|clear|pixel|transp|spacer)\.gif|\.swf)$/i;

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

  const blockedUrlPattern = /(\/ads?\/|\/ad[sx]?\b|[?&](ad|ads|adunit|adformat|adtag)=|doubleclick|googlesyndication|googleadservices|taboola|outbrain|tracking|beacon|pixel)/i;

  const shouldBlockUrl = (rawUrl) => {
    if (typeof rawUrl !== "string" || !rawUrl) return false;
    const url = rawUrl.toLowerCase();
    try {
      const parsed = new URL(rawUrl, location.origin);
      if (isWhitelistedHost(parsed.hostname)) return false;
      // Check blacklist
      if (blacklist.includes(parsed.hostname)) return true;
      // Check domain regex
      if (adDomainRegex.test(parsed.hostname)) return true;
      // Check subdomain regex
      if (adSubdomainRegex.test(parsed.hostname)) return true;
    } catch (_err) {
      // Non-URL strings still evaluated by pattern checks.
    }
    // Check URL patterns
    return blockedDomainFragments.some((d) => url.includes(d)) || blockedUrlPattern.test(url) || adUrlRegex.test(url) || adWebBugRegex.test(url);
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
