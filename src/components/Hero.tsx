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
} from "lucide-react";
import { motion } from "motion/react";

import HeroImg from "../assets/Gallery/Modeling 4.jpg";
interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

 

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.default",
        backgroundImage: isDark
          ? "linear-gradient(180deg, #050505 0%, #0c0c0c 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        color: "text.primary",
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        overflow: "hidden",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="hero-root"
    >
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
          bottom: "-10%",
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
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: "100px",
                  backgroundColor: "rgba(229, 9, 20, 0.08)",
                  border: "1px solid rgba(229, 9, 20, 0.25)",
                  mb: 3,
                }}
              >
                <Sparkles size={14} className="text-[#E50914]" />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: "#ff4d4d",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  Premier Photo & Biometric Suite in Kathmandu
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
                  lineHeight: { xs: 1.15, md: 1.1 },
                  letterSpacing: "-0.02em",
                  mb: 3,
                  color: "text.primary",
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
                into Lifetime Memories
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: "620px",
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

                <Button
                  variant="outlined"
                  onClick={() => onNavigate("visa-guides")}
                  id="hero-btn-resizer"
                  sx={{
                    border: "1.5px solid rgba(255, 255, 255, 0.15)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 4,
                    py: 1.5,
                    borderRadius: "4px",
                    "&:hover": {
                      border: "1.5px solid #E50918",
                      backgroundColor: "rgba(229, 9, 20, 0.05)",
                    },
                  }}
                  startIcon={<ImageIcon size={18} className="text-[#E50914]" />}
                >
                  Photo Guides & Resizer
                </Button>
              </Box>

              {/* Badges / Accolades Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-slate-200 dark:border-white/10 pt-8 text-left">
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <ShieldCheck
                      size={20}
                      className="text-[#E50914] shrink-0"
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        100% Embassy Approved
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block" }}
                      >
                        Compliance Guaranteed
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <MapPin size={20} className="text-[#E50914] shrink-0" />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        Central Kathmandu
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block" }}
                      >
                        Rudramati Pul
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="hidden sm:block">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <BadgePercent
                      size={20}
                      className="text-[#E50914] shrink-0"
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        Free Online Diagnostics
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block" }}
                      >
                        Fast Digital Exports
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Collage */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full flex justify-center"
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "420px",
                  aspectRatio: "1",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(255, 255, 255, 0.08)",
                  p: 1.5,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                }}
                id="hero-camera-view-container"
              >
                {/* Simulated Camera Focus Marks overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "25px",
                    left: "25px",
                    width: "20px",
                    height: "20px",
                    borderLeft: "2px solid #E50914",
                    borderTop: "2px solid #E50914",
                    pointerEvents: "none",
                    zIndex: 4,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "25px",
                    right: "25px",
                    width: "20px",
                    height: "20px",
                    borderRight: "2px solid #E50914",
                    borderTop: "2px solid #E50914",
                    pointerEvents: "none",
                    zIndex: 4,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "25px",
                    left: "25px",
                    width: "20px",
                    height: "20px",
                    borderLeft: "2px solid #E50914",
                    borderBottom: "2px solid #E50914",
                    pointerEvents: "none",
                    zIndex: 4,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "25px",
                    right: "25px",
                    width: "20px",
                    height: "20px",
                    borderRight: "2px solid #E50914",
                    borderBottom: "2px solid #E50914",
                    pointerEvents: "none",
                    zIndex: 4,
                  }}
                />

                {/* Main image representing the studio work */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={HeroImg}
                    alt="Master Studio Portrait Kathmandu"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // This ensures the image covers the container
                      objectPosition: "top", // This aligns the image to the top
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Absolute subtle banner info inside mockup */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      right: "20px",
                      backgroundColor: "rgba(0, 0, 0, 0.85)",
                      backdropFilter: "blur(4px)",
                      p: 2,
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#E50914",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      STUDIO PARAMETERS
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#ffffff", fontWeight: 500, mb: 0.5 }}
                    >
                      Master Octabank strobe lighting
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#cbd5e1",
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      ISO 100 • f/8.0 • 1/160s • 85mm
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>

            {/* Sub Caption & Show Portfolio Page navigation */}
            <Box
              sx={{
                textAlign: "center",
                mt: 3,
                width: "100%",
                maxWidth: "420px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 300,
                  mb: 2,
                  fontStyle: "italic",
                  px: 2,
                }}
              >
                High-end lighting, expert composition, and compliant standards
                for our premium Kathmandu captures.
              </Typography>
            </Box>
          </div>
        </div>


      </Container>
    </Box>
  );
}
