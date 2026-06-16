/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import { ChevronDown, HelpCircle, GraduationCap, Crop, Info } from 'lucide-react';
import { FAQ_ITEMS } from '../data';

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const categories = [
    { id: 'all', label: 'All Queries', icon: HelpCircle },
    { id: 'booking', label: 'Booking & Studio', icon: GraduationCap },
    { id: 'preparation', label: 'Wardrobe & Posing', icon: Info },
    { id: 'resizer', label: 'Online Resizer Tool', icon: Crop },
  ];

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFaqs = activeTab === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((faq) => faq.category === activeTab);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.default',
        color: 'text.primary',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
      }}
      id="faqs-root"
    >
      <Container maxWidth="lg" id="faqs-container">
        {/* Title Heading */}
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
            <HelpCircle size={14} className="text-[#E50914]" />
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
              Learn More
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Frequently Asked Queries
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', fontSize: '0.95rem', fontWeight: 300 }}
          >
            Find quick answers related to background guidelines, wardrobe recommendations, package details, or our online photo resizer tool.
          </Typography>
        </Box>

        {/* Categories Tab selectors row */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
            mb: 5,
          }}
          id="faqs-categories-grid"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isSelected ? 'contained' : 'outlined'}
                onClick={() => {
                  setActiveTab(cat.id);
                  setExpanded(false); // contract active accordion on tab change
                }}
                id={`faq-filter-btn-${cat.id}`}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: 'none',
                  borderRadius: '4px',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.825rem',
                  py: 1,
                  px: 2.5,
                  backgroundColor: isSelected ? '#E50914' : 'transparent',
                  color: isSelected ? '#ffffff' : 'text.secondary',
                  borderColor: isSelected ? 'transparent' : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: isSelected ? '0 4px 10px rgba(229, 9, 20, 0.25)' : 'none',
                  '&:hover': {
                    backgroundColor: isSelected ? '#E50914' : 'rgba(229, 9, 20, 0.05)',
                    borderColor: '#E50914',
                  },
                }}
                startIcon={<Icon size={14} />}
              >
                {cat.label}
              </Button>
            );
          })}
        </Box>

        {/* FAQs Accordion Block */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }} id="faqs-accordion-list">
          {filteredFaqs.map((faq) => {
            const isExpanded = expanded === faq.id;
            return (
              <Accordion
                key={faq.id}
                expanded={isExpanded}
                onChange={handleAccordionChange(faq.id)}
                id={`faq-accordion-item-${faq.id}`}
                sx={{
                  mb: 1.5,
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  borderRadius: '6px !important', // prevent default rounding collapse
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  boxShadow: 'none',
                  '&::before': { display: 'none' }, // delete default separator line
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#E50914',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={18} className="text-[#E50914]" />}
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-header`}
                  sx={{
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': { margin: '8px 0' },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      color: isExpanded ? '#ff4d4d' : 'text.primary',
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '0.85rem',
                      fontWeight: 300,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
