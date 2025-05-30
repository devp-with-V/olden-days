export const AD_CONFIG = {
  // Replace with your actual Google AdSense Publisher ID
  publisherId: "ca-pub-YOUR_ACTUAL_PUBLISHER_ID", // e.g., "ca-pub-1234567890123456"

  // Ad slot IDs - replace with your actual ad slot IDs from AdSense dashboard
  adSlots: {
    interstitial: "YOUR_INTERSTITIAL_SLOT_ID", // e.g., "1234567890"
    leaderboard: "YOUR_LEADERBOARD_SLOT_ID", // e.g., "1234567891"
    banner: "YOUR_BANNER_SLOT_ID", // e.g., "1234567892"
    largeBanner: "YOUR_LARGE_BANNER_SLOT_ID", // e.g., "1234567893"
    sidebar: "YOUR_SIDEBAR_SLOT_ID", // e.g., "1234567894"
    square: "YOUR_SQUARE_SLOT_ID", // e.g., "1234567895"
    mobile: "YOUR_MOBILE_SLOT_ID", // e.g., "1234567896"
  },

  // Ad sizes
  sizes: {
    leaderboard: { width: 728, height: 90 },
    banner: { width: 468, height: 60 },
    largeBanner: { width: 320, height: 100 },
    sidebar: { width: 160, height: 600 },
    square: { width: 300, height: 250 },
    mobile: { width: 320, height: 50 },
  },
}
