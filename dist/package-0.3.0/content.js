(function () {
  if (window.__yasContentInjected) return;
  window.__yasContentInjected = true;

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

  const injectMainWorldScript = () => {
    const src = chrome.runtime.getURL("main-world.js");
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  };

  const injectYouTubeCollapseCss = () => {
    if (!location.hostname.includes("youtube.com")) return;
    if (document.getElementById("yas-youtube-collapse-css")) return;
    const style = document.createElement("style");
    style.id = "yas-youtube-collapse-css";
    style.textContent = `
      /* Hide known ad/sponsor renderers only (safe scope). */
      ytd-display-ad-renderer,
      ytd-ad-slot-renderer,
      ytd-promoted-video-renderer,
      ytd-promoted-sparkles-web-renderer {
        display: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  };

  const scrubYouTubeAds = () => {
    const selectors = [
      ".video-ads",
      ".ytp-ad-module",
      ".ytp-ad-overlay-container",
      ".ytp-ad-player-overlay",
      "#player-ads",
      "ytd-display-ad-renderer",
      "ytd-ad-slot-renderer",
      "ytd-promoted-video-renderer",
      "ytd-promoted-sparkles-web-renderer",
      "ytd-rich-item-renderer:has(ytd-display-ad-renderer)",
      "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)",
      "ytd-rich-item-renderer:has(ytd-promoted-video-renderer)",
      "ytd-rich-item-renderer:has(ytd-promoted-sparkles-web-renderer)",
      "ytd-rich-section-renderer:has(ytd-ad-slot-renderer)"
    ];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    }

    document
      .querySelectorAll(".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern")
      .forEach((btn) => btn.click && btn.click());

    const player = document.querySelector(".html5-video-player");
    const video = document.querySelector("video");
    if (player && player.classList.contains("ad-showing") && video) {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.1);
      }
      video.muted = true;
      video.playbackRate = 16;
      video.play().catch(() => {});
      player.classList.remove("ad-showing");
    }

    // Narrow fallback: remove only shell cards with no title and no thumbnail image.
    document.querySelectorAll("ytd-rich-item-renderer").forEach((el) => {
      const hasAdMarker = !!el.querySelector(
        "ytd-ad-slot-renderer, ytd-display-ad-renderer, ytd-promoted-video-renderer, ytd-promoted-sparkles-web-renderer"
      );
      if (hasAdMarker) {
        el.remove();
        return;
      }

      const hasTitle = !!el.querySelector("a#video-title-link, a#video-title[href], #video-title.ytd-rich-grid-media");
      const hasThumbImage = !!el.querySelector("ytd-thumbnail img[src], ytd-thumbnail yt-image img[src], img.yt-core-image[src]");
      if (!hasTitle && !hasThumbImage) {
        const compactText = (el.textContent || "").replace(/\s+/g, "");
        if (compactText.length === 0) {
          el.remove();
        }
      }

      // Remove residual shells: thumbnail wrapper exists but no real image is present.
      const hasThumbnailShell = !!el.querySelector("ytd-thumbnail, a#thumbnail");
      if (hasThumbnailShell && !hasThumbImage) {
        const hasDuration = !!el.querySelector("#text.ytd-thumbnail-overlay-time-status-renderer");
        const hasMenu = !!el.querySelector("ytd-menu-renderer");
        // Keep only cards that look like real videos still loading metadata.
        if (!hasDuration && !hasTitle && !hasMenu) {
          el.remove();
        }
      }
    });

  };

  const scrubGenericAds = () => {
    const selectors = [
      "ins.adsbygoogle",
      "iframe[src*='doubleclick']",
      "iframe[src*='googlesyndication']",
      "iframe[src*='googletagmanager']",
      "[id*='google_ads']",
      "[class*='ad-slot']",
      "[class*='advert']",
      "[class*='sponsor']",
      "[data-ad]",
      "[data-adunit]",
      ".sponsored-content",
      ".promoted",
      ".ad-banner",
      ".ad-container",
      ".ad-wrapper"
    ];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        if (el && el.parentElement) {
          el.remove();
        }
      });
    }

    // Block iframes with ad-related URLs using PAC patterns
    document.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.src || "";
      if (src) {
        try {
          const url = new URL(src);
          if (blacklist.includes(url.hostname) ||
              adDomainRegex.test(url.hostname) ||
              adSubdomainRegex.test(url.hostname) ||
              adUrlRegex.test(src) ||
              adWebBugRegex.test(src)) {
            iframe.remove();
          }
        } catch (e) {
          if (adUrlRegex.test(src) || adWebBugRegex.test(src)) {
            iframe.remove();
          }
        }
      }
    });

    // Block scripts with ad-related URLs
    document.querySelectorAll("script").forEach((script) => {
      const src = script.src || "";
      if (src) {
        try {
          const url = new URL(src);
          if (blacklist.includes(url.hostname) ||
              adDomainRegex.test(url.hostname) ||
              adSubdomainRegex.test(url.hostname) ||
              adUrlRegex.test(src)) {
            script.remove();
          }
        } catch (e) {
          if (adUrlRegex.test(src)) {
            script.remove();
          }
        }
      }
    });
  };

  const scrubAllAds = () => {
    if (location.hostname.includes("youtube.com")) {
      scrubYouTubeAds();
      return;
    }
    scrubGenericAds();
  };

  injectMainWorldScript();
  injectYouTubeCollapseCss();
  scrubAllAds();
  setInterval(scrubAllAds, location.hostname.includes("youtube.com") ? 250 : 1000);

  const observer = new MutationObserver(scrubAllAds);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
