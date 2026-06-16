/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { Check, BadgeCheck } from 'lucide-react';

interface PricingSectionProps {
  onBookPricingPackage: (serviceId: string) => void;
}

export default function PricingSection({ onBookPricingPackage }: PricingSectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tiers = [
    {
      title: 'Biometric Passport & Visa',
      price: 'Rs. 500',
      serviceId: 'service-visa-id',
      subtitle: 'Fast biometric compliance photos',
      duration: '15 mins session',
      features: [
        'Guaranteed embassy check validation',
        '8 printed physical copies (premium matte paper)',
        'Instant digital copy delivered to email',
        'Free 1-time reprint if rejected by embassy',
        'No appointment needed (walk-ins welcome)'
      ],
      isPopular: false,
      badgeText: '',
    },
    {
      title: 'Corporate Executive Portrait',
      price: 'Rs. 2,500',
      serviceId: 'service-portrait',
      subtitle: 'Perfect for LinkedIn & resumes',
      duration: '30 mins session',
      features: [
        '1 choice premium background (Grey, White, Dark)',
        'Professional studio strobe lighting setup',
        '15-20 frames captured for reference',
        '5 edited high-resolution digital files',
        'Same-day digital transfer via direct link'
      ],
      isPopular: true,
      badgeText: 'BEST FOR INDIVIDUALS',
    },
    {
      title: 'ERAS & Residency Suite',
      price: 'Rs. 3,500',
      serviceId: 'service-residency',
      subtitle: 'Exclusive medical match headshots',
      duration: '45 mins session',
      features: [
        'White or light gray academic backdrop setups',
        'Expert posing and jawline coaching parameters',
        '30+ raw frames captured securely',
        '2 hand-polished high-definition master crops',
        'Pre-sized exact ERAS (375x525px) output files'
      ],
      isPopular: false,
      badgeText: 'AAMC COMPLIANT',
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s, color 0.3s',
      }}
      id="pricing-root"
    >
      <Container maxWidth="xl" id="pricing-container">
        {/* Header Title */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: '100px',
              backgroundColor: 'rgba(229, 9, 20, 0.08)',
              border: '1px solid rgba(229, 9, 20, 0.25)',
              mb: 2.5,
            }}
          >
            <BadgeCheck size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#ff4d4d',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Affordable Rates
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.75rem' },
              mb: 2,
              color: 'text.primary',
            }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              maxWidth: '650px',
              mx: 'auto',
              fontWeight: 300,
            }}
          >
            High-end photography does not need an executive budget. Book a guaranteed-outcome pricing package with zero hidden charges.
          </Typography>
        </Box>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" id="pricing-cards-grid">
          {tiers.map((tier) => (
            <div key={tier.title} className="w-full">
              <Card
                className="hover-gold-glow"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: tier.isPopular
                    ? '2px solid #E50914'
                    : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  backgroundColor: 'background.paper',
                  boxShadow: tier.isPopular
                    ? '0 10px 30px rgba(229, 9, 20, 0.1)'
                    : 'none',
                  borderRadius: '8px',
                  overflow: 'visible', // allow popular badge float
                  transition: 'background-color 0.3s, border-color 0.3s',
                }}
                id={`pricing-card-${tier.serviceId}`}
              >
                {/* Popularity Badge floating */}
                {tier.isPopular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#E50914',
                      color: '#ffffff',
                      px: 2.5,
                      py: 0.5,
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: '"Space Grotesk", sans-serif',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(229, 9, 20, 0.3)',
                      zIndex: 3,
                    }}
                  >
                    {tier.badgeText}
                   </Box>
                )}

                <CardContent sx={{ p: { xs: 4, md: 5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, mb: 1, color: 'text.primary', fontSize: '1.25rem' }}>
                    {tier.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
                    {tier.subtitle}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1.5 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#E50914', fontFamily: '"Space Grotesk", sans-serif' }}>
                      {tier.price}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                      / session
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 4, fontWeight: 500 }}>
                    Duration: {tier.duration}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: 'divider' }} />

                  {/* Bullet features list */}
                  <List sx={{ p: 0, mb: 5 }} dense>
                    {tier.features.map((feat, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Check size={14} className="text-[#E50914]" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 300 }}>
                              {feat}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* Booking Trigger CTA Button */}
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      fullWidth
                      variant={tier.isPopular ? 'contained' : 'outlined'}
                      onClick={() => onBookPricingPackage(tier.serviceId)}
                      id={`pricing-book-btn-${tier.serviceId}`}
                      sx={{
                        backgroundColor: tier.isPopular 
                          ? (isDark ? '#ffffff' : '#0f172a') 
                          : 'transparent',
                        borderColor: tier.isPopular 
                          ? 'transparent' 
                          : isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                        color: tier.isPopular 
                          ? (isDark ? '#000000' : '#ffffff') 
                          : 'text.primary',
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#E50914',
                          borderColor: '#E50914',
                          color: '#ffffff',
                        },
                      }}
                    >
                      Book Premium Package
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
}
