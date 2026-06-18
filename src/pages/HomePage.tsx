/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Hero from "../components/Hero";

interface HomePageProps {
  onNavigate: (sectionId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box id="page-home">
      <Hero onNavigate={onNavigate} />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
          }}
        >
          Our Modern Portrait & Media Specialties
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            maxWidth: "700px",
            mx: "auto",
            mb: 5,
            fontWeight: 300,
          }}
        >
          We are Kathmandu’s leading studio for biometric validations, majestic
          wedding videography, custom-crafted photo framing, and corporate brand
          headshots.
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Weddings",
              copy: "Full day high-end cinematic wedding vlogs & photography.",
              target: "services",
            },
            {
              title: "Videography",
              copy: "Sony FX3 4K cinema commercials, reels & interviews.",
              target: "services",
            },
            {
              title: "Photo Frames",
              copy: "Premium teak wood hand carved custom fabrication.",
              target: "services",
            },
            {
              title: "Visa Photos",
              copy: "Different official specifications mapped to biometric rules.",
              target: "visa-guides",
            },
          ].map((item) => (
            <Box
              key={item.title}
              onClick={() => onNavigate(item.target)}
              sx={{
                p: 3,
                border: "1px solid rgba(229,9,20,0.15)",
                borderRadius: "6px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "#E50914",
                  backgroundColor: "rgba(229,9,20,0.02)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#E50914", mb: 1, fontWeight: 600 }}
              >
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                {item.copy}
              </Typography>
            </Box>
          ))}
        </div>
      </Container>

      <Box
        sx={{
          py: 8,
          backgroundColor: mode === "dark" ? "#070707" : "#f8fafc",
          borderTop: "1px solid",
          borderColor:
            mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="overline"
            sx={{
              color: "#E50914",
              fontWeight: 600,
              letterSpacing: "0.15em",
              display: "block",
              mb: 1,
              textAlign: "center",
            }}
          >
            STUDIO SAMPLES
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
            }}
          >
            Featured Kathmandu Portrait Gallery
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: mode === "dark" ? "#94a3b8" : "#475569",
              textAlign: "center",
              maxWidth: "700px",
              mx: "auto",
              mb: 6,
              fontWeight: 300,
            }}
          >
            Take a look at the crisp clarity of our professional captures.
            Balanced strobe highlights, perfect contrast, and strict biometric
            framing tolerances.
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                src: "../assets/Gallery/Modeing 5.jpg",
                overline: "Modeling",
                title: "Prerna Shrestha",
                caption:
                  "Executive image captured with continuous ring lights.",
              },
              {
                src: "../assets/Gallery/Black.jpg",
                overline: "Creative Photoshoot",
                title: "Rohan Adhikari",
                caption: "Black and White Photoshoot.",
              },
              {
                src: "../assets/Gallery/Birthday.jpg",
                overline: "Birthday",
                title: "Ananya Gautam",
                caption: "Happy Birthday Cutie.",
              },
              {
                src: "../assets/Gallery/bride 2.jpg",
                overline: "Creative Lighting",
                title: "Tenzing Lama",
                caption: "Bride makeup photoshoot in wedding.",
              },
            ].map((item) => (
              <Box
                key={item.title}
                sx={{
                  position: "relative",
                  aspectRatio: "3/4",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  boxShadow:
                    mode === "dark"
                      ? "0 10px 30px rgba(0,0,0,0.5)"
                      : "0 10px 20px rgba(0,0,0,0.05)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#E50914",
                    boxShadow: "0 15px 30px rgba(229, 9, 20, 0.15)",
                  },
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  referrerPolicy="no-referrer"
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    p: 3,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#E50914",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  >
                    {item.overline}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#cbd5e1", fontWeight: 300, mt: 0.5 }}
                  >
                    {item.caption}
                  </Typography>
                </Box>
              </Box>
            ))}
          </div>

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="outlined"
              onClick={() => onNavigate("portfolio")}
              sx={{
                color: mode === "dark" ? "#ffffff" : "#0f172a",
                borderColor:
                  mode === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.15)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                py: 1.25,
                borderRadius: "4px",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#E50914",
                  backgroundColor: "rgba(229, 9, 20, 0.05)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Show More Portraits
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
