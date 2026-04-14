(function () {
  if (window.__yasContentInjected) return;
  window.__yasContentInjected = true;

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
