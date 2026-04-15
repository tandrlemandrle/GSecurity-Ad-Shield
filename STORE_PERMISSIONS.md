# Chrome Web Store Permission Explanations

## declarativeNetRequest

**Purpose:** Block network requests to ad servers and tracking domains at the browser level before they load.

**Explanation:** This extension uses the declarativeNetRequest API to intercept and block HTTP requests to known ad servers, tracking domains, and malicious content. This is essential for the ad-blocking functionality as it prevents ads from loading in the first place, rather than just hiding them after they load. The blocking rules are based on comprehensive blacklists and pattern matching rules that identify ad-related domains and URLs.

**Specific Use Cases:**
- Blocking requests to known ad servers (e.g., doubleclick.net, googlesyndication.com)
- Preventing tracking pixels and beacons from loading
- Stopping malicious or unwanted content from reaching the browser
- Reducing bandwidth usage and improving page load times by blocking unnecessary requests

**Data Handling:** No user data is collected or transmitted. All blocking rules are defined locally within the extension and do not rely on external servers.

## declarativeNetRequestWithHostAccess

**Purpose:** Enable the extension to apply ad-blocking rules to specific domains where ads are commonly served.

**Explanation:** The declarativeNetRequestWithHostAccess permission is required to apply the extension's ad-blocking rules to specific domains (YouTube, Google ad servers, and related services). This targeted approach ensures effective ad blocking on the platforms where it's most needed while respecting user privacy and following Chrome Web Store best practices for permission usage.

**Specific Use Cases:**
- Blocking ads on YouTube and YouTube video servers
- Blocking requests to Google ad servers (googlesyndication.com, doubleclick.net, googleadservices.com)
- Blocking tracking and analytics requests from Google Tag Manager
- Ensuring ad-free experience on video platforms without requiring user interaction

**Privacy Commitment:** The extension does not access, collect, or transmit any user browsing data. The host access is limited to specific ad-related domains and is used solely to apply blocking rules, not to inspect or record user activity.

## Additional Information

**Rule Source:** The blocking rules are derived from the BlockAds.pac file, which contains comprehensive patterns for identifying ad-related domains and URLs. These rules are converted to declarativeNetRequest format for Manifest V3 compatibility.

**Whitelist:** The extension includes a whitelist of domains (e.g., twitter.com, discord.com, banking sites) that are exempt from blocking to ensure essential services continue to function properly.

**Performance:** Blocking requests at the network level using declarativeNetRequest is more efficient than content-script-based blocking, as it prevents unnecessary network traffic and reduces CPU usage.

**User Control:** Users can disable the extension at any time through Chrome's extension management interface if they wish to allow ads on specific sites.
