/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
} from '@mui/material';
import { Camera, X, ZoomIn, Award } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../data';
import { PortfolioItem } from '../types';

export default function PortfolioGrid() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Portrait', label: 'Executive Portraits' },
    { id: 'Visa', label: 'Visa & Biometrics' },
    { id: 'Product', label: 'Product & Catalog' },
    { id: 'Event', label: 'Celebration Events' },
    { id: 'Studio', label: 'Studio & Gear' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const filteredItems = activeTab === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeTab);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s, color 0.3s',
      }}
      id="portfolio-root"
    >
      <Container maxWidth="xl" id="portfolio-container">
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            <Camera size={14} className="text-[#E50914]" />
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
              Our Masterworks
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
              letterSpacing: '-0.01em',
            }}
          >
            Studio Portfolio Showcase
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
            A curated grid of our actual client captures taken directly in our Kathmandu branch. Witness our light balance, accurate neutral backdrops, and flawless details.
          </Typography>
        </Box>

        {/* Categories Tabs Filter */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 6,
            borderBottom: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
          id="portfolio-filters"
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#E50914', height: '3px' },
              '& .MuiTab-root': {
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                minWidth: 'auto',
                px: { xs: 2.5, md: 4 },
                py: 2,
                '&.Mui-selected': { color: '#ff4d4d' },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.id} label={cat.label} value={cat.id} id={`portfolio-tab-${cat.id}`} />
            ))}
          </Tabs>
        </Box>

        {/* Portfolio Masonry/Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="w-full">
              <Card
                onClick={() => setSelectedItem(item)}
                className="hover-gold-glow cursor-pointer group"
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  boxShadow: 'none',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                id={`portfolio-item-${item.id}`}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '.group:hover &': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle hover icon zoom overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(5,5,5,0.4)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '.group:hover &': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                      }}
                    >
                      <ZoomIn size={18} />
                    </Box>
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ff4d4d', display: 'block', fontWeight: 600 }}>
                    {item.specLabel || item.category}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>

      {/* Lightbox Modal Dialog */}
      <Dialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
        }}
        id="portfolio-lightbox"
      >
        {selectedItem && (
          <Box sx={{ position: 'relative' }}>
            {/* Close trigger button */}
            <IconButton
              onClick={() => setSelectedItem(null)}
              id="close-lightbox-btn"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                zIndex: 10,
              }}
            >
              <X size={18} />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ width: '100%', maxHeight: '70vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', backgroundColor: '#000000' }}>
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
                  referrerPolicy="no-referrer"
                />
              </Box>
              <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <Award size={16} className="text-[#E50914]" />
                  <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 600, letterSpacing: '0.1em' }}>
                    PSS PORTFOLIO SPECS
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, mb: 1, color: 'text.primary' }}>
                  {selectedItem.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, mb: 2, lineHeight: 1.5 }}>
                  Successfully verified and approved biometric capture conforming strictly to the requested {selectedItem.specLabel || selectedItem.category} parameters. Delivered same-day in physical prints + premium high-res email copies.
                </Typography>
                <Box sx={{ display: 'inline-flex', px: 2, py: 0.5, borderRadius: '4px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                  <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary' }}>
                    Category: {selectedItem.category}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
