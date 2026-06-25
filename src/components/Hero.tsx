/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,

} from "@mui/material";
import {
  Image as ImageIcon,
  Calendar,
  ShieldCheck,
  Sparkles,
  MapPin,
  BadgePercent,
  Instagram, Facebook, Youtube, MessageCircle,
  Percent,
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion } from "motion/react";
import { apiService } from "../utils/supabase";
import { OfferAd } from "../types";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const navigate = useNavigate();
  const [activeAdIndex, setActiveAdIndex] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  // Smooth redirects to the targeted portfolio filters
  const handleCategoryRedirect = (category: string) => {
    navigate(`/portfolio?category=${category}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [offers, setOffers] = React.useState<OfferAd[]>([]);

  React.useEffect(() => {
    const fetchOffers = async () => {
      try {
        const fetchedOffers = await apiService.getOffers();
        setOffers(fetchedOffers);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, []);

  React.useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveAdIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 6000); // Rotates every 6 seconds
    return () => clearInterval(interval);
  }, [offers.length]);
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.default",
        backgroundImage: isDark
          ? "linear-gradient(180deg, #050505 0%, #0c0c0c 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        color: "text.primary",
        pt: { xs: 4, md: 4 },
        pb: { xs: 6, md: 8 },
        overflow: "hidden",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="hero-root"
    >
      
      {/* Slogan */}
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 300,
          fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
          lineHeight: { xs: 1.15, md: 1.1 },
          letterSpacing: "-0.02em",
          mb: 3,
          color: "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        Transforming{" "}
        <span
          style={{
            background:
              "linear-gradient(90deg, #E50914 0%, #ff4d4d 50%, #B71C1C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Moments
        </span>{" "}
        into Masterpieces
      </Typography>
      {/* Decorative ambient crimson red light blur */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.1) 0%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.05) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "-15%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.05) 0%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.02) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1 }}
        id="hero-container"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="md:col-span-7 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: "520px",
                  mb: 5,
                  mx: { xs: "auto", md: "0" },
                }}
              >
                Capture stunning cinematic wedding films, premium custom photo
                frames, and executive portrait shots. Use our{" "}
                <strong className="text-[#E50914] font-medium">
                  Free Biometric Resizer Tool
                </strong>{" "}
                inside the Visa Guides page to instantly process ERAS, Korea
                EPS, and other global visa photos in strict size limits.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 6,
                }}
                id="hero-call-to-actions"
              >
                <Button
                  variant="contained"
                  onClick={() => onNavigate("book-session")}
                  id="hero-btn-book"
                  sx={{
                    background:
                      "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    justifyContent: "center",
                    width: "320px",
                    px: 4,
                    py: 1.5,
                    borderRadius: "4px",
                    borderColor: "rgba(255,255,255,0.05)",
                    boxShadow: "0 4px 20px rgba(229, 9, 20, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
                      boxShadow: "0 6px 24px rgba(229, 9, 20, 0.4)",
                    },
                  }}
                  startIcon={<Calendar size={18} />}
                >
                  Book Studio Session
                </Button>

              </Box>

              {/* Social Connect Row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 border-t border-slate-200 dark:border-white/10 pt-8 text-left">
                <Box
                  component="a"
                  href="https://wa.me/9779801000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <MessageCircle
                      size={24}
                      className="text-[#25D366] shrink-0"
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        WhatsApp
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, textDecoration: "none" }}
                      >
                        Chat with us
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  component="a"
                  href="https://instagram.com/studiomeroclick"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Instagram size={24} className="text-[#E1306C] shrink-0" />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Instagram
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, textDecoration: "none" }}
                      >
                        Follow our work
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  component="a"
                  href="https://facebook.com/studiomeroclick"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Facebook
                      size={24}
                      className="text-[#1877F2] shrink-0"
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Facebook
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, textDecoration: "none" }}
                      >
                        Join our community
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  component="a"
                  href="https://tiktok.com/@studiomeroclick"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black dark:text-white shrink-0"
                    >
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
                    </svg>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        TikTok
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, textDecoration: "none" }}
                      >
                        Follow our trends
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  component="a"
                  href="https://youtube.com/@studiomeroclick"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Youtube
                      size={24}
                      className="text-[#FF0000] shrink-0"
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        YouTube
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, textDecoration: "none" }}
                      >
                        Watch our videos
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Collage */}
          {/* Right Column: Dynamic Ads / Special Offers Showcase */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            {offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full flex justify-center"
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                  }}
                  id="hero-active-ads-container"
                >
                  {/* Image & Overlay portion */}
                  <Box sx={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={offers[activeAdIndex].image}
                      alt={offers[activeAdIndex].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.3) 70%, rgba(15, 23, 42, 0.0) 100%)',
                      }}
                    />

                    {/* Hot Promo badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: '#E50914',
                        color: '#ffffff',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        letterSpacing: '0.1em',
                        boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                      }}
                    >
                      {offers[activeAdIndex].badge}
                    </Box>

                    {/* Valid until tag */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        px: 1,
                        py: 0.3,
                        borderRadius: '4px',
                      }}
                    >
                      <Clock size={12} className="text-[#E50914]" />
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {offers[activeAdIndex].validUntil}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content Details Portion */}
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Percent size={16} style={{ color: offers[activeAdIndex].accentColor }} />
                      <Typography
                        variant="overline"
                        sx={{
                          color: offers[activeAdIndex].accentColor,
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          fontSize: '0.8rem',
                          fontFamily: '"Space Grotesk", sans-serif',
                        }}
                      >
                        {offers[activeAdIndex].discount}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        lineHeight: 1.3,
                        color: isDark ? '#ffffff' : '#0f172a',
                      }}
                    >
                      {offers[activeAdIndex].title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#cbd5e1' : '#475569',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        fontWeight: 300,
                        minHeight: '4.5rem',
                      }}
                    >
                      {offers[activeAdIndex].description}
                    </Typography>

                    {/* Navigation dots & buttons Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justify: 'space-between', mt: 1, pt: 1.5, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                      {/* Arrow controls */}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() => setActiveAdIndex((prev) => (prev - 1 + offers.length) % offers.length)}
                          sx={{
                            minWidth: '28px',
                            width: '28px',
                            height: '28px',
                            p: 0,
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                            color: isDark ? '#94a3b8' : '#64748b',
                            '&:hover': {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            }
                          }}
                        >
                          <ChevronLeft size={16} />
                        </Button>

                        {/* Mini Pagination Dots */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1 }}>
                          {offers.map((_, idx) => (
                            <Box
                              key={idx}
                              onClick={() => setActiveAdIndex(idx)}
                              sx={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: idx === activeAdIndex ? offers[idx].accentColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                transform: idx === activeAdIndex ? 'scale(1.2)' : 'scale(1)',
                              }}
                            />
                          ))}
                        </Box>

                        <Button
                          size="small"
                          onClick={() => setActiveAdIndex((prev) => (prev + 1) % offers.length)}
                          sx={{
                            minWidth: '28px',
                            width: '28px',
                            height: '28px',
                            p: 0,
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                            color: isDark ? '#94a3b8' : '#64748b',
                            '&:hover': {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            }
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCategoryRedirect(offers[activeAdIndex].targetCategory)}
                        sx={{
                          backgroundColor: offers[activeAdIndex].accentColor,
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          px: 2,
                          py: 0.75,
                          borderRadius: '4px',
                          boxShadow: `0 4px 12px ${offers[activeAdIndex].accentColor}33`,
                          '&:hover': {
                            backgroundColor: offers[activeAdIndex].accentColor,
                            filter: 'brightness(1.15)',
                          }
                        }}
                      >
                        {offers[activeAdIndex].actionText}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Sub Caption & Show Portfolio Page navigation */}
            {offers.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 2.5, width: '100%', maxWidth: '440px' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 300, px: 2 }}>
                  Click any active offer to instantly view its category portfolio work or customize details!
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </Container>
    </Box>
  );
}
