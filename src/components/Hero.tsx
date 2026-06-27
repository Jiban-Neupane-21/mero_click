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

              {/* Social Connect Infinite Marquee */}
              <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', position: 'relative' }}>
                <Typography variant="overline" sx={{ display: 'block', mb: 3, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.1em' }}>
                  CONNECT WITH OUR COMMUNITY
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    '&:hover .marquee-content': {
                      animationPlayState: 'paused'
                    }
                  }}
                >
                  <Box
                    className="marquee-content"
                    sx={{
                      display: 'flex',
                      gap: { xs: 2, md: 3 },
                      animation: 'scroll-marquee 25s linear infinite',
                      '@keyframes scroll-marquee': {
                        '0%': { transform: 'translateX(0)' },
                        '100%': { transform: 'translateX(-50%)' }
                      },
                      width: 'max-content',
                      py: 1,
                      pl: 2
                    }}
                  >
                    {(() => {
                      const items = [
                        { name: 'WhatsApp', desc: 'Chat with us', icon: <MessageCircle size={22} className="text-[#25D366] shrink-0" />, url: 'https://wa.me/+9779823367428', color: '#25D366' },
                        { name: 'Instagram', desc: 'Follow our work', icon: <Instagram size={22} className="text-[#E1306C] shrink-0" />, url: 'https://instagram.com/studiomeroclick', color: '#E1306C' },
                        { name: 'Facebook', desc: 'Join our community', icon: <Facebook size={22} className="text-[#1877F2] shrink-0" />, url: 'https://facebook.com/studiomeroclick', color: '#1877F2' },
                        {
                          name: 'TikTok', desc: 'Follow our trends', icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white shrink-0">
                              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
                            </svg>
                          ), url: 'https://tiktok.com/@studiomeroclick', color: isDark ? '#ffffff' : '#000000'
                        },
                        { name: 'YouTube', desc: 'Watch our videos', icon: <Youtube size={22} className="text-[#FF0000] shrink-0" />, url: 'https://youtube.com/@studiomeroclick', color: '#FF0000' }
                      ];
                      return [...items, ...items];
                    })().map((social, index) => (
                      <Box
                        key={`${social.name}-${index}`}
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: { xs: 2.5, md: 3 },
                          py: { xs: 1.25, md: 1.5 },
                          textDecoration: 'none',
                          borderRadius: '100px',
                          border: '1px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          minWidth: 'max-content',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            borderColor: social.color,
                            boxShadow: `0 4px 20px ${social.color}25`
                          }
                        }}
                      >
                        {social.icon}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle2" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, color: 'text.primary', fontSize: '0.9rem', lineHeight: 1.2 }}>
                            {social.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
                            {social.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
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
                    minHeight: { xs: '480px', sm: '540px' },
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                    boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                  id="hero-active-ads-container"
                >
                  {/* Full Cover Image */}
                  <img
                    src={offers[activeAdIndex].image}
                    alt={offers[activeAdIndex].title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: isDark
                        ? 'linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.8) 45%, rgba(5, 5, 5, 0) 100%)'
                        : 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0) 100%)',
                      zIndex: 1,
                    }}
                  />

                  {/* Top Elements (Badge & Valid Until) */}
                  <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
                    {/* Hot Promo badge */}
                    <Box
                      sx={{
                        backgroundColor: '#E50914',
                        color: '#ffffff',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        letterSpacing: '0.1em',
                        boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                      }}
                    >
                      {offers[activeAdIndex].badge}
                    </Box>
                  </Box>

                  {/* Content Details Portion (Bottom) */}
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, zIndex: 2, position: 'relative' }}>
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
                        fontSize: '1.4rem',
                        lineHeight: 1.2,
                        color: '#ffffff',
                      }}
                    >
                      {offers[activeAdIndex].title}
                    </Typography>

                    {/* Navigation dots & buttons Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {/* Arrow controls */}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() => setActiveAdIndex((prev) => (prev - 1 + offers.length) % offers.length)}
                          sx={{
                            minWidth: '32px',
                            width: '32px',
                            height: '32px',
                            p: 0,
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            }
                          }}
                        >
                          <ChevronLeft size={16} />
                        </Button>

                        {/* Mini Pagination Dots */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5 }}>
                          {offers.map((_, idx) => (
                            <Box
                              key={idx}
                              onClick={() => setActiveAdIndex(idx)}
                              sx={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: idx === activeAdIndex ? offers[idx].accentColor : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                transform: idx === activeAdIndex ? 'scale(1.3)' : 'scale(1)',
                              }}
                            />
                          ))}
                        </Box>

                        <Button
                          size="small"
                          onClick={() => setActiveAdIndex((prev) => (prev + 1) % offers.length)}
                          sx={{
                            minWidth: '32px',
                            width: '32px',
                            height: '32px',
                            p: 0,
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
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
                          fontWeight: 650,
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          px: 2.5,
                          py: 1,
                          borderRadius: '8px',
                          boxShadow: `0 4px 15px ${offers[activeAdIndex].accentColor}40`,
                          '&:hover': {
                            backgroundColor: offers[activeAdIndex].accentColor,
                            filter: 'brightness(1.15)',
                            transform: 'translateY(-1px)'
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
