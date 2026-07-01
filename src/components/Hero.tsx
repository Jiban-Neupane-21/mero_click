/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Percent,
  ChevronRight,
  ChevronLeft,
  Aperture,
} from "lucide-react";
import { motion } from "motion/react";
import { apiService } from "../utils/supabase";
import { OfferAd, HeroImg } from "../types";
import grand from "../assets/Gallery/Grand.jpg";

interface HeroProps {
  onNavigate: (section: string) => void;
}

// Shared height for both hero cards — single source of truth so they can never drift apart
const CARD_HEIGHT = { xs: "300px", sm: "380px", md: "360px", lg: "400px" };

export default function Hero({ onNavigate }: HeroProps) {
  const navigate = useNavigate();
  const [activeAdIndex, setActiveAdIndex] = React.useState(0);
  const [heroImage, setHeroImage] = React.useState<string>(grand);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleCategoryRedirect = (category: string) => {
    navigate(`/portfolio?category=${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [offers, setOffers] = React.useState<OfferAd[]>([]);
  const [heroImages, setHeroImages] = React.useState<HeroImg[]>([]);

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

    const fetchHeroImage = async () => {
      try {
        const fetchedImages = await apiService.getHeroImages();
        if (fetchedImages.length > 0 && fetchedImages[0].imageUrl) {
          setHeroImage(fetchedImages[0].imageUrl);
        }
      } catch (err) {
        console.error("Error fetching hero image:", err);
      }
    };
    fetchHeroImage();
  }, []);

  React.useEffect(() => {
    if (offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveAdIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 6000);
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
        pt: { xs: 4, md: 3, lg: 3 },
        pb: { xs: 6, md: 3, lg: 3 },
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
          fontSize: { xs: "2.5rem", sm: "3.2rem", md: "3rem", lg: "3.6rem" },
          lineHeight: { xs: 1.15, md: 1.1 },
          letterSpacing: "-0.02em",
          textAlign: "center",
          mb: { xs: 3, md: 2 },
          color: "text.primary",
          whiteSpace: { xs: "normal", md: "nowrap" },
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Image Column */}
          {/* Hero Image Section */}
          <div className="md:col-span-7 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: CARD_HEIGHT, // fixed height, matches right card exactly
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
                  boxShadow: isDark
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                }}
                id="hero-left-image-container"
              >
                <img
                  src={heroImage}
                  alt="Family Gathering"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                  }}
                  referrerPolicy="no-referrer"
                />
              </Box>
            </motion.div>
          </div>

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
                    position: "relative",
                    width: "100%",
                    maxWidth: "440px",
                    height: CARD_HEIGHT, // same fixed height as left card
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.08)",
                    boxShadow: isDark
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                  }}
                  id="hero-active-ads-container"
                >
                  <img
                    src={offers[activeAdIndex].image}
                    alt={offers[activeAdIndex].title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: isDark
                        ? "linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.7) 35%, rgba(5, 5, 5, 0) 100%)"
                        : "linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 35%, rgba(0, 0, 0, 0) 100%)",
                      zIndex: 1,
                    }}
                  />

                  {/* Top badge — absolute, doesn't affect card height */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      right: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#E50914",
                        color: "#ffffff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        letterSpacing: "0.1em",
                        boxShadow: "0 4px 12px rgba(229, 9, 20, 0.4)",
                      }}
                    >
                      {offers[activeAdIndex].badge}
                    </Box>
                  </Box>

                  {/* Bottom content — now absolute overlay, no longer pushes card height */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      zIndex: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          lineHeight: 1.2,
                          color: "#ffffff",
                        }}
                      >
                        {offers[activeAdIndex].title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() =>
                            setActiveAdIndex(
                              (prev) =>
                                (prev - 1 + offers.length) % offers.length,
                            )
                          }
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          <ChevronLeft size={16} />
                        </Button>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                          }}
                        >
                          {offers.map((_, idx) => (
                            <Box
                              key={idx}
                              onClick={() => setActiveAdIndex(idx)}
                              sx={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor:
                                  idx === activeAdIndex
                                    ? offers[idx].accentColor
                                    : "rgba(255,255,255,0.3)",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                                transform:
                                  idx === activeAdIndex
                                    ? "scale(1.3)"
                                    : "scale(1)",
                              }}
                            />
                          ))}
                        </Box>

                        <Button
                          size="small"
                          onClick={() =>
                            setActiveAdIndex(
                              (prev) => (prev + 1) % offers.length,
                            )
                          }
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleCategoryRedirect(
                            offers[activeAdIndex].targetCategory,
                          )
                        }
                        sx={{
                          backgroundColor: offers[activeAdIndex].accentColor,
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 650,
                          textTransform: "none",
                          fontSize: "0.8rem",
                          px: 2.5,
                          py: 1,
                          borderRadius: "8px",
                          boxShadow: `0 4px 15px ${offers[activeAdIndex].accentColor}40`,
                          "&:hover": {
                            backgroundColor: offers[activeAdIndex].accentColor,
                            filter: "brightness(1.15)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        {offers[activeAdIndex].actionText}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}

            {offers.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  textAlign: "center",
                  mt: 1.5,
                  maxWidth: "440px",
                  display: { xs: "block", lg: "none" }, // hide on large screens to save vertical space
                }}
              >
                Click any active offer to instantly view and claim offers.
              </Typography>
            )}
          </div>
        </div>

        {/* ---------- BOOKING + SOCIAL, SIDE BY SIDE ON DESKTOP ---------- */}
        <Box
          className="social-media"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: { md: "space-evenly" },
            gap: { xs: 4, md: 4 },
            width: "100%",
            maxHeight: "auto",
            mt: { xs: 5, md: 4 },
          }}
          id="hero-call-to-actions"
        >
          {/* ---------- SOCIAL ROW (SIMPLE) ---------- */}
          <Box
            sx={{
              // width: { xs: "100%", md: "auto" },
              width: "100%",
              flexGrow: { md: 1 },
              maxWidth: { md: "560px" },
              display: { md: "flex" },
              alignItems: { md: "flex-end" },
              gap: { md: 3 },
            }}
          >
            <Typography
              sx={{
                display: "block",
                mb: { xs: 1.5, sm: 2 },
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                letterSpacing: "0.02em",
                color: "text.secondary",
                textAlign: { xs: "center", md: "right" },
              }}
            >
              Connect with us
            </Typography>

            <Box
              sx={{
                display: "flex",
                overflow: "hidden",
                position: "relative",
                width: "100%",
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                "&:hover .marquee-content": {
                  animationPlayState: "paused",
                },
              }}
            >
              <Box
                className="marquee-content"
                sx={{
                  display: "flex",
                  gap: { xs: 3, sm: 4 },
                  animation: "scroll-marquee 30s linear infinite",
                  "@keyframes scroll-marquee": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                  },
                  width: "max-content",
                  py: 1,
                  pl: 2,
                }}
              >
                {(() => {
                  const items = [
                    {
                      name: "WhatsApp",
                      icon: <MessageCircle size={18} />,
                      url: "https://wa.me/+9779823367428",
                      color: "#25D366",
                    },
                    {
                      name: "Instagram",
                      icon: <Instagram size={18} />,
                      url: "https://instagram.com/studiomeroclick",
                      color: "#E1306C",
                    },
                    {
                      name: "Facebook",
                      icon: <Facebook size={18} />,
                      url: "https://facebook.com/studiomeroclick",
                      color: "#1877F2",
                    },
                    {
                      name: "TikTok",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
                        </svg>
                      ),
                      url: "https://tiktok.com/@studiomeroclick",
                      color: "#000000",
                    },
                    {
                      name: "YouTube",
                      icon: <Youtube size={18} />,
                      url: "https://youtube.com/@studiomeroclick",
                      color: "#FF0000",
                    },
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
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.75,
                      width: 60,
                      textDecoration: "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 42, sm: 46 },
                        height: { xs: 42, sm: 46 },
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.primary",
                        border: "1px solid",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: social.color,
                          color: social.color,
                          backgroundColor: `${social.color}14`,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {social.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: "0.65rem",
                        fontWeight: 500,
                        color: "text.secondary",
                        text: "hidden",
                        ":hover": "text: display",
                      }}
                    >
                      {social.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          {/* ---------- SHUTTER CTA ---------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Button
              onClick={() => onNavigate("book-session")}
              id="hero-btn-book"
              disableRipple
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
                justifyContent: "flex-start",
                textAlign: "left",
                textTransform: "none",
                bgcolor: "#111113",
                border: "1px solid rgba(201,162,39,0.35)",
                borderRadius: "10px",
                px: { xs: 1.25, sm: 1.5 },
                py: { xs: 1, sm: 1.1 },
                pr: { xs: 2.5, sm: 3 },
                width: { xs: "100%", md: "auto" },
                maxWidth: "100%",
                boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: "rgba(201,162,39,0.7)",
                  boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
                  "& .shutter-capsule": {
                    animation: "shutterClick 0.5s ease",
                  },
                },
                "&:active": { transform: "translateY(0px) scale(0.98)" },
                "@keyframes shutterClick": {
                  "0%": { transform: "scale(1)" },
                  "40%": { transform: "scale(0.82)" },
                  "70%": { transform: "scale(1.06)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            >
              <Box
                className="shutter-capsule"
                sx={{
                  flexShrink: 0,
                  width: { xs: 34, sm: 40 },
                  height: { xs: 34, sm: 40 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "radial-gradient(circle at 35% 30%, #ff5145, #B71C1C 70%)",
                  boxShadow:
                    "inset 0 0 0 3px rgba(0,0,0,0.25), 0 0 14px rgba(229,52,42,0.55)",
                }}
              >
                <Aperture size={18} color="#fff" strokeWidth={2} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    lineHeight: 1.15,
                  }}
                >
                  Book Studio Session
                </Typography>
                <Typography
                  sx={{
                    fontFamily:
                      'ui-monospace, "SFMono-Regular", Menlo, monospace',
                    fontSize: { xs: "0.62rem", sm: "0.68rem" },
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  Kathmandu Studio · 45–90 min
                </Typography>
              </Box>
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                pl: { xs: 0, sm: 0.5 },
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#E5342A",
                  animation: "pulseDot 1.8s ease-in-out infinite",
                  "@keyframes pulseDot": {
                    "0%, 100%": {
                      opacity: 1,
                      boxShadow: "0 0 0 0 rgba(229,52,42,0.5)",
                    },
                    "50%": {
                      opacity: 0.5,
                      boxShadow: "0 0 0 5px rgba(229,52,42,0)",
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily:
                    'ui-monospace, "SFMono-Regular", Menlo, monospace',
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                Bookings open this week
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
