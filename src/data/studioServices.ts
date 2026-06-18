/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudioService } from "../types";

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: "service-wedding-shoot",
    title: "Wedding Photo & Video Shoot",
    category: "Wedding",
    basePrice: "Rs. 45,000",
    duration: "Full Day Event Coverage",
    description:
      "Bespoke high-end wedding imagery and cinematic film captures. Combining grand traditional portraits with candid documentation, high-speed lenses, dynamic strobes, and multi-angle 4K video storytelling.",
    features: [
      "Two professional lead photographers + drone aerial coverage",
      "Full-day cinema crew with heavy stabilize rigs (Ronin-S)",
      "150+ masterfully retouched wedding photos",
      "3-5 minutes cinematic wedding teaser + full event archive vlog",
      "Complementary premium custom-crafted family photo frame",
    ],
    rating: 5.0,
    imageUrl: new URL("../assets/Gallery/Bride.jpg", import.meta.url).href,
  },
  {
    id: "service-videography",
    title: "Cinematic Videography & Video Shoots",
    category: "Videography",
    basePrice: "Rs. 25,000",
    duration: "4-Hour Dedicated Session",
    description:
      "High-production value video shoots for corporate commercials, music videos, social media reels, and YouTube documentations. We deliver professional color grading, crisp lavalier/shotgun audio records, and smooth tracking angles.",
    features: [
      "Shoot on high-resolution mirrorless cameras (Sony FX3/A7SIII)",
      "Professional interview lighting setup (Aputure dome lights)",
      "Crystal clear wireless lapel audio and specialized sound design",
      "Advanced post-production color grading matching film aesthetic",
    ],
    rating: 4.9,
    imageUrl: new URL("../assets/Gallery/Grand.jpg", import.meta.url).href,
  },
  {
    id: "service-photo-frame",
    title: "Custom Photo Framing & Premium Prints",
    category: "Photo Frame",
    basePrice: "Rs. 1,200",
    duration: "Same-Day Fabrication",
    description:
      "Transform your precious digital memories into physical works of art. We fabricate high-quality wooden, composite, and synthetic frames in various classic or modern specs with high-glass or anti-reflective glare finishes.",
    features: [
      "Choose from Premium Teak Wood, Minimal Matte Black, and Luxury Gold/Silver trim",
      'Pre-cut mounts available for sizes (A4, A3, 12x18", 16x24", 24x36" & custom sizes)',
      "Water-proof and UV-resistant premium micro-pigment paper printing",
      "Immediate delivery & mounting gear included with every order",
    ],
    rating: 4.8,
    imageUrl: new URL("../assets/Gallery/Couple.jpg", import.meta.url).href,
  },
  {
    id: "service-visa-id",
    title: "Biometric Passport & Official Multi-Size Photography",
    category: "Visa",
    basePrice: "Rs. 500",
    duration: "10 mins session",
    description:
      'Guaranteed compliance for global visa applications and official government forms. Sized perfectly to meet exact standards of AAMC ERAS, US Visa (2x2"), EPS Korea, Schengen Biometrics, IOE entrance exam, and Nepal Citizenship.',
    features: [
      "Instant conversion to any official size with guaranteed embassy checks",
      "Includes 8 printed physical copies with crisp digital delivery via Care email",
      "Professional softbox studio setup to secure soft natural facial details",
      "Instant AI-assisted crop verification according to biometric margins",
    ],
    rating: 4.9,
    imageUrl: new URL("../assets/Gallery/Portait.jpg", import.meta.url).href,
  },
  {
    id: "service-portrait",
    title: "Professional Corporate & Executive Portraits",
    category: "Portrait",
    basePrice: "Rs. 2,500",
    duration: "30 mins session",
    description:
      "Enhance your personal or corporate brand. Capture premium executive team headshots for LinkedIn, business documents, magazines, and pitch decks. Directional strobe configurations and posture guidance.",
    features: [
      "Bespoke studio backdrop choices (Classic Charcoal, Minimalist White, Cream, Warm Gray)",
      "15+ takes, 3 high-end retouched digital master files included",
      "Posing and facial expression coaching for natural authority look",
      "Fast same-day high-resolution exports",
    ],
    rating: 4.9,
    imageUrl: new URL("../assets/Gallery/Pprtait 2.jpg", import.meta.url).href,
  },
];
