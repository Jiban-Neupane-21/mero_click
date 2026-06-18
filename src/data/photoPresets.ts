/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhotoPreset } from "../types";

export const PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: "eras-headshot",
    name: "ERAS Residency Headshot (US Match)",
    ratioWidth: 5,
    ratioHeight: 7,
    standardWidthPx: 375,
    standardHeightPx: 525,
    outputSizeText: '2.5" x 3.5" (375x525 px)',
    description:
      "Complies with Association of American Medical Colleges (AAMC) headshot requirements for ERAS 2025/2026.",
    maxFileSizeKb: 150,
    category: "Residency",
    recommendations: [
      "Plain white or light gray background only (no dark colors or patterns).",
      "Look directly at the camera with a warm, professional expression.",
      "Wear professional attire (jacket/suit for men, blazer or structured top for women).",
      "The photo must show your full head and shoulders, with your face centered and taking up 70% of the frame.",
      "No eyeglasses unless medically necessary, no hats, and no headphones.",
    ],
  },
  {
    id: "eps-korea",
    name: "EPS Korea Size (35x45mm)",
    ratioWidth: 35,
    ratioHeight: 45,
    standardWidthPx: 138,
    standardHeightPx: 177,
    outputSizeText: "35mm x 45mm (Max 13KB)",
    description:
      "Prepares the exact sized image for EPS Korea registration forms with optimized 13KB payload.",
    maxFileSizeKb: 13,
    category: "Visa",
    recommendations: [
      "Plain white background with standard neutral lightning.",
      "Do not wear white clothing (it blends into the background).",
      "Ears must be fully visible and jawline clear.",
      "Save image size exactly below 13 KB. (Our tool auto-compresses for you).",
      "Neutral facial expression (strictly no smiling or showing teeth).",
    ],
  },
  {
    id: "ioe-entrance",
    name: "IOE Entrance Exam Photo",
    ratioWidth: 7,
    ratioHeight: 6,
    standardWidthPx: 350,
    standardHeightPx: 300,
    outputSizeText: "350px x 300px",
    description:
      "Sized specifically for Tribhuvan University, Institute of Engineering (IOE) Kathmandu, Entrance Form.",
    maxFileSizeKb: 50,
    category: "Entrance",
    recommendations: [
      "Plain, solid white background.",
      "Head must be centered and looking directly forward.",
      "High-quality crisp facial details, no glasses shadows, no glare.",
      "Casual clothing is fine, but avoid loud graphics or logos.",
    ],
  },
  {
    id: "uae-visa",
    name: "GCC / UAE / Dubai Visa Photo",
    ratioWidth: 4,
    ratioHeight: 6,
    standardWidthPx: 472,
    standardHeightPx: 708,
    outputSizeText: "4.0 cm x 6.0 cm (or 4.3x5.5cm)",
    description:
      "Official specifications for Dubai, Saudi Arabia, Qatar, Oman & Gulf countries visas.",
    maxFileSizeKb: 100,
    category: "Visa",
    recommendations: [
      "White background with even lighting.",
      "Face coverage should make up 70% to 80% of the entire picture height.",
      "No spectacles, no hats, and shoulders must be straight.",
      "Traditional headwear / Hijabs are allowed for religious reasons but must not obscure any facial features.",
    ],
  },
  {
    id: "us-passport",
    name: 'US Passport / Visa (2" x 2")',
    ratioWidth: 1,
    ratioHeight: 1,
    standardWidthPx: 600,
    standardHeightPx: 600,
    outputSizeText: '2" x 2" (600x600 px)',
    description:
      "Official US State Department specification for passport, diversity visa (DV) lottery and visa forms.",
    maxFileSizeKb: 240,
    category: "Visa",
    recommendations: [
      "Plain off-white or white background.",
      'Face height (chin to top of hair) must be between 1\" and 1 3/8\" (50% - 69%).',
      'Eye level should be between 1 1/8\" and 1 3/8\" from the bottom of the photo.',
      "No eyeglasses are allowed. Standard professional lighting is recommended.",
    ],
  },
];
