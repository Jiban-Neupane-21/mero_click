/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhotoPreset, StudioService, PortfolioItem, FAQItem } from "./types";

// Photo sizing and requirements presets
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

// Professional studio services Offered in Kathmandu
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

// Photographic portfolios
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "p1",
    title: "Traditional Wedding Heritage Couple",
    category: "Wedding",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    specLabel: "Outdoor Golden Hour Portrait",
    author: "Lead Event Team, Kathmandu",
  },
  {
    id: "p2",
    title: "CEO Corporate Executive Portrait",
    category: "Portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
    specLabel: "Charcoal Studio Backdrop",
    author: "Portrait Specialist, Kathmandu Office",
  },
  {
    id: "p3",
    title: "Nepalese Bride Traditional Cinematic Video",
    category: "Videography",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600",
    specLabel: "Commercial Reels & Cinematic Grade",
    author: "Video Production Team",
  },
  {
    id: "p4",
    title: "Classic Rich Walnut Carved Photo Frame",
    category: "Photo Frame",
    imageUrl:
      "https://images.unsplash.com/photo-1603184017968-902a6285a521?q=80&w=600",
    specLabel: '16" x 24" Custom Fabrication',
    author: "Print Lab, Kathmandu",
  },
  {
    id: "p5",
    title: "ERAS Academic Residency Matching Photo",
    category: "Visa",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    specLabel: "Official ERAS Sized Format",
    author: "Biometric Office",
  },
  {
    id: "p6",
    title: "Authentic Traditional Newari Wedding Vlog",
    category: "Wedding",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600",
    specLabel: "Pre-wedding Storytelling Film",
    author: "Cinematography Director",
  },
  {
    id: "p7",
    title: "Corporate Story Commercial Shoot",
    category: "Videography",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600",
    specLabel: "Sony FX3 4K Production",
    author: "Video Production Team",
  },
  {
    id: "p8",
    title: "Glossy Collage Frame with Family Shots",
    category: "Photo Frame",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
    specLabel: "Multi-opening Board Matte Wood",
    author: "Print Lab, Kathmandu",
  },
  {
    id: "p9",
    title: "Compliant DV Lottery & Passport Face Profile",
    category: "Visa",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
    specLabel: "Guaranteed Biometric Compliant Portrait",
    author: "Passport Specialist",
  },
];

// FAQs about photography services
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "f1",
    question: "What services does PhotoStudioService offer?",
    answer:
      "We offer full-service high-end photography in Kathmandu, including corporate executive portraits, ERAS residency headshots, premium visa / passport photos, e-commerce product shoots, and corporate/family events coverage. We also have this integrated online digital photo resizer that lets users crop and adjust their files to strict embassy and academic formatting limits from their own browsers.",
    category: "booking",
  },
  {
    id: "f2",
    question: "What should I wear to my photo session?",
    answer:
      "For professional corporate headshots and ERAS match sessions, we highly recommend formal smart business attire. Choose dark solid colors (Navy Blue, Charcoal Gray, Black) paired with light solid shirts or blouses. Avoid busy patterns, stripes, or neon colors as they draw attention away from your face. For visa photos, avoid white clothing since most embassies require white backgrounds and white shirts will blend and fade.",
    category: "preparation",
  },
  {
    id: "f3",
    question: "How long does a typical photo session last?",
    answer:
      "It depends on the service. Biometric Visa/DV lottery photo sessions are completed in under 15 minutes. Corporate headshots and residency portraits usually take between 30 to 45 minutes, allowing time for outfit changes, posing coaching, and immediate selection of the images you like best on our studio monitor.",
    category: "booking",
  },
  {
    id: "f4",
    question: "How does the Online Photo Resizer tool work?",
    answer:
      'Our interactive online tool lets you upload your portrait or selfie, choose a standard preset template (e.g. AAMC ERAS, EPS Korea 13KB, IOE Entrance, Dubai/UAE Visa, US 2"x2" Passport), rotate/pan/zoom the image, tweak lighting metrics like brightness & contrast, and immediately export/download a fully compliant web-optimized file ready for submission.',
    category: "resizer",
  },
  {
    id: "f5",
    question: "What forms of payment do you accept for your services?",
    answer:
      "We accept major payment channels in Nepal including eSewa, Khalti, direct Bank Fonepay Transfers, Cash on-premise, and mastercard/visa credit transfers for international clients.",
    category: "pricing",
  },
  {
    id: "f6",
    question: "Can I reschedule or cancel my booked studio session?",
    answer:
      "Yes, absolutely! You can reschedule your booking free of cost up to 12 hours before your session. Just contact us via email, phone, or modify your booking parameters on our website using your registered credentials.",
    category: "booking",
  },
];
