/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  ButtonProps,
  Divider,
  useTheme,
} from '@mui/material';
import { Eye, BadgeAlert, Scale, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { PHOTO_PRESETS } from '../data';

interface VisaGuidesProps {
  onScrollToResizer: () => void;
}

export default function VisaGuides({ onScrollToResizer }: VisaGuidesProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab ] = useState<string>(PHOTO_PRESETS[0].id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const selectedPreset = PHOTO_PRESETS.find(p => p.id === activeTab) || PHOTO_PRESETS[0];

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: 'background.default',
        color: 'text.primary',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.3s, color 0.3s',
      }}
      id="visa-guides-root"
    >
      <Container maxWidth="xl" id="visa-guides-container">
        {/* Section Heading info block */}
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
              mb: 2,
            }}
          >
            <Eye size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#ff4d4d',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Visa Guidelines handbook
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Biometric Standards & Embassy Guide
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', maxWidth: '650px', mx: 'auto', fontSize: '0.95rem', fontWeight: 300 }}
          >
            Biometric photos are governed by rigid international standards (ICAO criteria). See our specifications below for global passport, visa, and university regulations.
          </Typography>
        </Box>

        {/* Tab Selection Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 6,
            borderBottom: '1px solid',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
          id="visa-guides-tab-wrapper"
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
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                minWidth: 'auto',
                px: { xs: 2, md: 3 },
                py: 2,
                '&.Mui-selected': { color: '#E50914' },
              },
            }}
          >
            {PHOTO_PRESETS.map((p) => (
              <Tab key={p.id} label={p.name} value={p.id} id={`visa-tab-${p.id}`} />
            ))}
          </Tabs>
        </Box>

        {/* Dynamic Spec content matching active tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Specifications Left Panel */}
          <div className="lg:col-span-7">
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                boxShadow: 'none',
                p: { xs: 3, md: 4 },
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              id="visa-detail-card"
            >
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    color: '#E50914',
                    mb: 1.5,
                  }}
                >
                  {selectedPreset.name} Detail Codes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, mb: 4 }}>
                  {selectedPreset.description}
                </Typography>

                <Divider sx={{ mb: 4, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

                {/* Grid attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Standard Paper Dimensions:</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedPreset.outputSizeText}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Aspect Ratio:</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                      {selectedPreset.ratioWidth} : {selectedPreset.ratioHeight}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Calibrated Digital Resolution:</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
                      {selectedPreset.standardWidthPx} x {selectedPreset.standardHeightPx} PX
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Allowed background colors:</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#E50914' }}>
                      Pure White or Light Grey
                    </Typography>
                  </Box>
                </div>

                <Divider sx={{ mb: 4, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

                {/* Recommendations checklist block */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Biometric Checklist Criteria (Embassy Check validated):
                </Typography>

                <div className="grid grid-cols-1 gap-3">
                  {selectedPreset.recommendations.map((rec, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300, fontSize: '0.875rem' }}>
                        {rec}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Recommendation / Guide illustration card */}
          <div className="lg:col-span-5">
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                boxShadow: 'none',
                p: { xs: 3, md: 4 },
                height: '100%',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              id="visa-illustrate-card"
            >
              <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Scale size={18} className="text-[#E50914]" />
                  <Typography variant="subtitle2" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#E50914' }}>
                    Pose & Clothing Regulations
                  </Typography>
                </Box>

                {/* Clothing & pose advice */}
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.6, mb: 3, fontWeight: 300 }}>
                  Embassies automatically reject biometric photos with excessive shadows, tilted shoulders, smiling teeth, or items covering face landmarks (e.g., thick spectacle frames or hair fringes).
                </Typography>

                <Box sx={{ p: 2, backgroundColor: 'rgba(219,68,68,0.05)', border: '1px solid rgba(219,68,68,0.15)', borderRadius: '4px', mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Avoid These Clothing Colors:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: 300 }}>
                    Do not wear white, light gray, or cream shirts. They blend directly into neutral backdrops, causing automated rejections. Use dark colors like black, blue, or dark gray instead.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '4px', mb: 4 }}>
                  <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 600, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Special Religious Garb Exception:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bbf7d0', fontSize: '0.8rem', fontWeight: 300 }}>
                    Hijabs and turbans are fully approved for passports under the condition that full frontal features (cheeks, chin, forehead, eyebrows) remain entirely visible.
                  </Typography>
                </Box>

                {/* Call-to-action button to jump back up to cropping workplace */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onScrollToResizer}
                  id="visa-to-resizer-btn"
                  sx={{
                    mt: 'auto',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '0.9rem',
                    '&:hover': {
                      borderColor: '#E50914',
                      backgroundColor: 'rgba(229, 9, 20, 0.05)',
                      color: '#E50914',
                    },
                  }}
                  endIcon={<ChevronRight size={16} />}
                >
                  Adjust My Portrait Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Box>
  );
}
