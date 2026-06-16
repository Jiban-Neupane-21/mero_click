/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import { Camera, ExternalLink, Mail, MapPin, PhoneCall } from "lucide-react";

const NAV_LEFT = [
  { label: "Home (Main)", section: "home" },
  { label: "Online Resizer", section: "visa-guides" },
  { label: "Studio Services", section: "services" },
];

const NAV_RIGHT = [
  { label: "Our Portfolio", section: "portfolio" },
  { label: "Pricing Sheets", section: "pricing" },
  { label: "Contact details", section: "contact" },
];

interface FooterProps {
  mode: "dark" | "light";
  onNavigate: (section: string) => void;
}

export default function Footer({ mode, onNavigate }: FooterProps) {
  return (
    <Box
      id="app-footer"
      sx={{
        py: 8,
        backgroundColor: mode === "dark" ? "#111111" : "#f1f5f9",
        color: mode === "dark" ? "#cbd5e1" : "#475569",
        borderTop: "1px solid rgba(229, 9, 20, 0.25)",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <Container maxWidth="xl" id="footer-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Studio branding & address */}
          <div className="md:col-span-4">
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "rgba(229, 9, 20, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                }}
              >
                <Camera size={14} className="text-[#E50914]" />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  color: mode === "dark" ? "#ffffff" : "#0f172a",
                  letterSpacing: "0.05em",
                }}
              >
                PHOTOSTUDIO<span className="text-[#E50914]">SERVICE</span>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ fontWeight: 300, mb: 3, pr: { md: 4 }, lineHeight: 1.6 }}
            >
              Our Kathmandu-based photo studio provides passport validation,
              professional wedding videos, framing solutions, and portrait work
              matching strict criteria.
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: mode === "dark" ? "#94a3b8" : "#64748b",
                display: "flex",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <MapPin size={12} className="text-[#E50914]" /> Opposite Eyeplex
              Mall Baneshwor, Kathmandu
            </Typography>
          </div>

          {/* Quick navigation links */}
          <div className="sm:col-span-6 md:col-span-4">
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: mode === "dark" ? "#ffffff" : "#0f172a",
                fontWeight: 600,
                mb: 2,
                letterSpacing: "0.05em",
              }}
            >
              Quick Navigation Links
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {NAV_LEFT.map(({ label, section }) => (
                  <Typography
                    key={section}
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => onNavigate(section)}
                  >
                    {label}
                  </Typography>
                ))}
              </div>
              <div>
                {NAV_RIGHT.map(({ label, section }) => (
                  <Typography
                    key={section}
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => onNavigate(section)}
                  >
                    {label}
                  </Typography>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & hours */}
          <div className="sm:col-span-6 md:col-span-4">
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: mode === "dark" ? "#ffffff" : "#0f172a",
                fontWeight: 600,
                mb: 2,
                letterSpacing: "0.05em",
              }}
            >
              Branch Service Channels
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}
            >
              <PhoneCall size={14} className="text-[#E50914]" /> +977-1-4489372
              (New Baneshwor)
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, display: "flex", gap: 1, alignItems: "center" }}
            >
              <Mail size={14} className="text-[#E50914]" />{" "}
              studiomeroclick@gmail.com
            </Typography>

            <Box
              sx={{
                mt: 3,
                pt: 1,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: mode === "dark" ? "#94a3b8" : "#64748b",
                  display: "block",
                }}
              >
                * Studio hours are Sun - Fri, 10:00 AM to 6:30 PM.
              </Typography>
            </Box>
          </div>
        </div>

        <Divider
          sx={{
            my: 5,
            borderColor:
              mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: mode === "dark" ? "#7c8ba1" : "#64748b" }}
          >
            © {new Date().getFullYear()} PhotoStudioService Kathmandu. All
            rights reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: mode === "dark" ? "#7c8ba1" : "#64748b",
              display: "flex",
              gap: 0.5,
              alignItems: "center",
            }}
          >
            Bespoke design for academic, corporate & biometric compliance.{" "}
            <ExternalLink size={10} />
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
