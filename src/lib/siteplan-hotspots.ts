import { HotspotPosition } from "./types";

// Hotspot positions as percentage coordinates (x%, y%) on the primary siteplan image.
// These are approximate positions that should be calibrated using the /dev/hotspots page.
// The siteplan image is 1729x1207 pixels. Coordinates are percentages of image dimensions.
export const hotspotPositions: HotspotPosition[] = [
  // Stage 3 - Streetside (TH 1-3) - top-right area along northern boundary
  { id: 1, x: 73.5, y: 11.5 },
  { id: 2, x: 76.5, y: 11.5 },
  { id: 3, x: 79.5, y: 11.5 },

  // Stage 1 - Streetside (TH 4-10) - top-left area along northern boundary
  { id: 4, x: 17.0, y: 11.5 },
  { id: 5, x: 20.0, y: 11.5 },
  { id: 6, x: 23.0, y: 11.5 },
  { id: 7, x: 26.0, y: 11.5 },
  { id: 8, x: 29.0, y: 11.5 },
  { id: 9, x: 32.0, y: 11.5 },
  { id: 10, x: 35.0, y: 11.5 },

  // Stage 1 - Shopside (TH 11-21) - western side near shopping centre
  { id: 11, x: 10.0, y: 22.0 },
  { id: 12, x: 10.0, y: 26.0 },
  { id: 13, x: 10.0, y: 30.0 },
  { id: 14, x: 10.0, y: 34.0 },
  { id: 15, x: 10.0, y: 38.0 },
  { id: 16, x: 10.0, y: 42.0 },
  { id: 17, x: 10.0, y: 46.0 },
  { id: 18, x: 10.0, y: 50.0 },
  { id: 19, x: 10.0, y: 54.0 },
  { id: 20, x: 10.0, y: 58.0 },
  { id: 21, x: 10.0, y: 62.0 },

  // Stage 1 - Inner Circle (TH 22-32) - central western rows
  { id: 22, x: 20.0, y: 22.0 },
  { id: 23, x: 20.0, y: 26.0 },
  { id: 24, x: 20.0, y: 30.0 },
  { id: 25, x: 24.0, y: 22.0 },
  { id: 26, x: 24.0, y: 26.0 },
  { id: 27, x: 24.0, y: 30.0 },
  { id: 28, x: 28.0, y: 22.0 },
  { id: 29, x: 28.0, y: 26.0 },
  { id: 30, x: 32.0, y: 22.0 },
  { id: 31, x: 32.0, y: 26.0 },
  { id: 32, x: 36.0, y: 22.0 },

  // Stage 2 - Inner Circle (TH 33-54) - central rows
  { id: 33, x: 36.0, y: 26.0 },
  { id: 34, x: 40.0, y: 22.0 },
  { id: 35, x: 40.0, y: 26.0 },
  { id: 36, x: 44.0, y: 22.0 },
  { id: 37, x: 44.0, y: 26.0 },
  { id: 38, x: 48.0, y: 22.0 },
  { id: 39, x: 48.0, y: 26.0 },
  { id: 40, x: 52.0, y: 22.0 },
  { id: 41, x: 52.0, y: 26.0 },
  { id: 42, x: 56.0, y: 22.0 },
  { id: 43, x: 56.0, y: 26.0 },
  { id: 44, x: 40.0, y: 34.0 },
  { id: 45, x: 44.0, y: 34.0 },
  { id: 46, x: 48.0, y: 34.0 },
  { id: 47, x: 52.0, y: 34.0 },
  { id: 48, x: 56.0, y: 34.0 },
  { id: 49, x: 40.0, y: 38.0 },
  { id: 50, x: 44.0, y: 38.0 },
  { id: 51, x: 48.0, y: 38.0 },
  { id: 52, x: 52.0, y: 38.0 },
  { id: 53, x: 56.0, y: 38.0 },
  { id: 54, x: 36.0, y: 34.0 },

  // Stage 3 - Inner Circle (TH 55-64) - central eastern rows
  { id: 55, x: 60.0, y: 22.0 },
  { id: 56, x: 60.0, y: 26.0 },
  { id: 57, x: 64.0, y: 22.0 },
  { id: 58, x: 64.0, y: 26.0 },
  { id: 59, x: 68.0, y: 22.0 },
  { id: 60, x: 68.0, y: 26.0 },
  { id: 61, x: 60.0, y: 34.0 },
  { id: 62, x: 64.0, y: 34.0 },
  { id: 63, x: 68.0, y: 34.0 },
  { id: 64, x: 72.0, y: 34.0 },

  // Stage 3 - Reserve Outlook (TH 65-78) - eastern premium row backing nature reserve
  { id: 65, x: 76.0, y: 22.0 },
  { id: 66, x: 76.0, y: 26.0 },
  { id: 67, x: 76.0, y: 30.0 },
  { id: 68, x: 76.0, y: 34.0 },
  { id: 69, x: 76.0, y: 38.0 },
  { id: 70, x: 80.0, y: 22.0 },
  { id: 71, x: 80.0, y: 26.0 },
  { id: 72, x: 80.0, y: 30.0 },
  { id: 73, x: 80.0, y: 34.0 },
  { id: 74, x: 80.0, y: 38.0 },
  { id: 75, x: 84.0, y: 22.0 },
  { id: 76, x: 84.0, y: 26.0 },
  { id: 77, x: 84.0, y: 30.0 },
  { id: 78, x: 84.0, y: 34.0 },

  // Stage 3 - Eastern Side (TH 79-88) - Beams Road frontage row along south
  { id: 79, x: 60.0, y: 82.0 },
  { id: 80, x: 63.0, y: 82.0 },
  { id: 81, x: 66.0, y: 82.0 },
  { id: 82, x: 69.0, y: 82.0 },
  { id: 83, x: 72.0, y: 82.0 },
  { id: 84, x: 75.0, y: 82.0 },
  { id: 85, x: 78.0, y: 82.0 },
  { id: 86, x: 81.0, y: 82.0 },
  { id: 87, x: 84.0, y: 82.0 },
  { id: 88, x: 87.0, y: 82.0 },
];
