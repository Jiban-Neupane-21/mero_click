import { OfferAd } from "../types";

export const DEFAULT_OFFERS: OfferAd[] = [
    {
        id: 'wedding-offer',
        badge: 'LIMITED SEASON OFFER',
        title: 'Monsoon Wedding Film Premium Package',
        discount: '15% FLAT DISCOUNT',
        description: 'Get standard cinematic video highlights & professional candid framing on booking full-day wedding packages before this weekend.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
        validUntil: 'Ends June 30, 2026',
        actionText: 'Claim 15% Discount',
        targetCategory: 'Wedding',
        accentColor: '#E50914'
    },
    {
        id: 'biometric-offer',
        badge: 'IMMEDIATE DISPATCH',
        title: 'Embassy Biometrics & Resizing',
        discount: 'PRINT & DIGITAL BUNDLE',
        description: 'Premium biometric shots compliant with US, Korea, and EU requirements. Get high-res print-ready hardcopies & customized resize emails.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
        validUntil: 'Walk-ins Welcome Daily',
        actionText: 'Get Biometric Assist',
        targetCategory: 'Visa',
        accentColor: '#10B981'
    },
    {
        id: 'portrait-offer',
        badge: 'PROFESSIONAL PORTFOLIOS',
        title: 'Corporate Executive Headshots',
        discount: 'BUY 4 GET 1 FREE BUNDLE',
        description: 'Elevate your LinkedIn profile and corporate website directory with precision studio portraits including custom background choices.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
        validUntil: 'Valid on Team Bookings',
        actionText: 'Schedule Team Shoot',
        targetCategory: 'Portrait',
        accentColor: '#3B82F6'
    }
];