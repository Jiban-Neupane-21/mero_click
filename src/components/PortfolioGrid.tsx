/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
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
} from "@mui/material";
import { Camera, X, ZoomIn, Award, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { PortfolioItem } from "../types";

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState(() => {
    return categoryParam || 'all';
  });
  
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const theme = useTheme();

  // Reset zoom scale when item changes or modal closes
  useEffect(() => {
    if (!selectedItem) {
      setZoomScale(1);
    }
  }, [selectedItem]);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.5, 1));

  // Watch for external query updates and update active filters
  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
    } else {
      setActiveTab('all');
    }
  }, [categoryParam]);
  const isDark = theme.palette.mode === "dark";

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Wedding', label: 'Cinematic Weddings' },
    { id: 'Portrait', label: 'Executive Portraits' },
    { id: 'Visa', label: 'Visa & Biometrics' },
    { id: 'Videography', label: 'Studio & Commercial Films' },
    { id: 'Photo Frame', label: 'Custom Framing' },
    { id: 'Product', label: 'Product & Catalog' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newValue });
    }
  };

  const shuffledItems = React.useMemo(() => {
    return [...items].sort(() => Math.random() - 0.5);
  }, [items]);

  const filteredItems =
    activeTab === "all"
      ? shuffledItems
      : items.filter((item) => item.category === activeTab);

  const currentIndex = selectedItem ? filteredItems.findIndex(i => i.id === selectedItem.id) : -1;

  const handleNext = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  }, [currentIndex, filteredItems]);

  const handlePrev = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  }, [currentIndex, filteredItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, handleNext, handlePrev]);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="portfolio-root"
    >
      <Container maxWidth="xl" id="portfolio-container">
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: "100px",
              backgroundColor: "rgba(229, 9, 20, 0.08)",
              border: "1px solid rgba(229, 9, 20, 0.25)",
              mb: 2.5,
            }}
          >
            <Camera size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: "#ff4d4d",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
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
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 2,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Studio Portfolio Showcase
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              maxWidth: "650px",
              mx: "auto",
              fontWeight: 300,
            }}
          >
            A curated grid of our actual client captures taken directly in our
            Kathmandu branch. Witness our light balance, accurate neutral
            backdrops, and flawless details.
          </Typography>
        </Box>

        {/* Categories Tabs Filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 6,
            borderBottom: "1px solid",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
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
              "& .MuiTabs-indicator": {
                backgroundColor: "#E50914",
                height: "3px",
              },
              "& .MuiTab-root": {
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                minWidth: "auto",
                px: { xs: 2.5, md: 4 },
                py: 2,
                "&.Mui-selected": { color: "#ff4d4d" },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                label={cat.label}
                value={cat.id}
                id={`portfolio-tab-${cat.id}`}
              />
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
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
                  boxShadow: "none",
                  borderRadius: "6px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
                id={`portfolio-item-${item.id}`}
              >
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "4/5",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      ".group:hover &": {
                        transform: "scale(1.05)",
                      },
                    }}
                    referrerPolicy="no-referrer"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1622344028682-1bc6ba6b7f36?q=80&w=400&auto=format&fit=crop";
                }}
                  />
                  {/* Subtle hover icon zoom overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(5,5,5,0.4)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ".group:hover &": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000000",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                      }}
                    >
                      <ZoomIn size={18} />
                    </Box>
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#ff4d4d", display: "block", fontWeight: 600 }}
                  >
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
          "& .MuiPaper-root": {
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
          },
        }}
        id="portfolio-lightbox"
      >
        {selectedItem && (
          <Box sx={{ position: "relative" }}>
            {/* Prev/Next Controls */}
            {currentIndex > 0 && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 12,
                  transform: "translateY(-50%)",
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  zIndex: 10,
                }}
              >
                <ChevronLeft size={28} />
              </IconButton>
            )}

            {currentIndex >= 0 && currentIndex < filteredItems.length - 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 12,
                  transform: "translateY(-50%)",
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  zIndex: 10,
                }}
              >
                <ChevronRight size={28} />
              </IconButton>
            )}

            {/* Close trigger button */}
            <IconButton
              onClick={() => setSelectedItem(null)}
              id="close-lightbox-btn"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                zIndex: 10,
              }}
            >
              <X size={18} />
            </IconButton>

            {/* Zoom Controls */}
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                display: "flex",
                gap: 1,
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                }}
              >
                <ZoomOut size={18} />
              </IconButton>
              <IconButton
                onClick={handleZoomIn}
                disabled={zoomScale >= 3}
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                }}
              >
                <ZoomIn size={18} />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              <Box
                sx={{
                  width: "100%",
                  maxHeight: "70vh",
                  overflow: "auto",
                  display: "flex",
                  justifyContent: zoomScale > 1 ? "flex-start" : "center",
                  alignItems: zoomScale > 1 ? "flex-start" : "center",
                  backgroundColor: "#000000",
                }}
              >
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  onClick={() => setZoomScale(prev => prev === 1 ? 2 : 1)}
                  style={{
                    width: zoomScale > 1 ? `${100 * zoomScale}%` : "auto",
                    height: zoomScale > 1 ? "auto" : "auto",
                    maxWidth: zoomScale === 1 ? "100%" : "none",
                    maxHeight: zoomScale === 1 ? "70vh" : "none",
                    objectFit: "contain",
                    transition: "width 0.3s ease, max-width 0.3s ease",
                    cursor: zoomScale > 1 ? "zoom-out" : "zoom-in",
                    margin: "auto",
                  }}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1622344028682-1bc6ba6b7f36?q=80&w=800&auto=format&fit=crop";
                  }}
                  referrerPolicy="no-referrer"
                />
              </Box>
              <Box sx={{ p: 4 }}>
                <Box
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <Award size={16} className="text-[#E50914]" />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ff4d4d",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                    }}
                  >
                    PSS PORTFOLIO SPECS
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                    color: "text.primary",
                  }}
                >
                  {selectedItem.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 300,
                    mb: 2,
                    lineHeight: 1.5,
                  }}
                >
                  Successfully verified and approved biometric capture
                  conforming strictly to the requested{" "}
                  {selectedItem.specLabel || selectedItem.category} parameters.
                  Delivered same-day in physical prints + premium high-res email
                  copies.
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 2,
                    py: 0.5,
                    borderRadius: "4px",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: "text.secondary",
                    }}
                  >
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
