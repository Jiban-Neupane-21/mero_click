/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, createContext } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  CssBaseline,
  Typography,
  Container,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServiceCatalog from "./components/ServiceCatalog";
import InteractiveResizer from "./components/InteractiveResizer";
import PortfolioGrid from "./components/PortfolioGrid";
import VisaGuides from "./components/VisaGuides";
import PricingSection from "./components/PricingSection";
import FaqSection from "./components/FaqSection";
import ContactSection from "./components/ContactSection";
import BookingPortal from "./components/BookingPortal";
import { Camera, MapPin, ExternalLink, Mail, PhoneCall } from "lucide-react";

export const ColorModeContext = createContext({
  mode: "dark" as "dark" | "light",
  toggleColorMode: () => {},
});

function AppContent() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(
    undefined,
  );

  // Switch pages and scroll up smoothly
  const handleScrollToSection = (sectionId: string) => {
    const path = sectionToPath(sectionId);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingRedirect = (serviceId: string) => {
    setBookingServiceId(serviceId);
    navigate("/book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Maps section string identifier to actual client route path
  const sectionToPath = (section: string) => {
    switch (section) {
      case "home":
        return "/";
      case "services":
        return "/services";
      case "portfolio":
        return "/portfolio";
      case "faqs":
        return "/faqs";
      case "contact":
        return "/contact";
      case "visa-guides":
        return "/visa-guides";
      case "resizer":
        return "/resizer";
      case "pricing":
        return "/pricing";
      case "book-session":
        return "/book";
      default:
        return "/";
    }
  };

  // Derive activeSection from pathname
  const pathToSection = (path: string) => {
    switch (path) {
      case "/":
        return "home";
      case "/services":
        return "services";
      case "/portfolio":
        return "portfolio";
      case "/faqs":
        return "faqs";
      case "/contact":
        return "contact";
      case "/visa-guides":
        return "visa-guides";
      case "/resizer":
        return "resizer";
      case "/pricing":
        return "pricing";
      case "/book":
        return "book-session";
      default:
        return "home";
    }
  };

  const activeSection = pathToSection(location.pathname);

  // Standard main home page content layout view
  const renderHomePage = () => (
    <Box id="page-home">
      <Hero onNavigate={handleScrollToSection} />
      {/* Added mini specialties highlight on Home page for quick navigation */}
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
          <div>
            <Box
              onClick={() => handleScrollToSection("services")}
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
                Weddings
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                Full day high-end cinematic wedding vlogs & photography.
              </Typography>
            </Box>
          </div>
          <div>
            <Box
              onClick={() => handleScrollToSection("services")}
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
                Videography
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                Sony FX3 4K cinema commercials, reels & interviews.
              </Typography>
            </Box>
          </div>
          <div>
            <Box
              onClick={() => handleScrollToSection("services")}
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
                Photo Frames
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                Premium teak wood hand carved custom fabrication.
              </Typography>
            </Box>
          </div>
          <div>
            <Box
              onClick={() => handleScrollToSection("visa-guides")}
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
                Visa Photos
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300 }}>
                Different official specifications mapped to biometric rules.
              </Typography>
            </Box>
          </div>
        </div>
      </Container>

      {/* Featured Kathmandu Portrait Gallery */}
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
            <Box
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
                src="../assets/Gallery/Modeing 5.jpg"
                alt="Kathmandu Fine-Art Portrait"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                referrerPolicy="no-referrer"
              />
              <Box
                className="image-overlay"
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
                  sx={{ color: "#E50914", fontWeight: 600, fontSize: "0.7rem" }}
                >
                  Modeling
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  Prerna Shrestha
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#cbd5e1", fontWeight: 300, mt: 0.5 }}
                >
                  Executive image captured with continuous ring lights.
                </Typography>
              </Box>
            </Box>

            <Box
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
                src="../assets/Gallery/Black.jpg"
                alt="Kathmandu Studio Headshot"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                referrerPolicy="no-referrer"
              />
              <Box
                className="image-overlay"
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
                  sx={{ color: "#E50914", fontWeight: 600, fontSize: "0.7rem" }}
                >
                  Creative Photoshoot
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  Rohan Adhikari
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#cbd5e1", fontWeight: 300, mt: 0.5 }}
                >
                  Black and White Photoshoot.
                </Typography>
              </Box>
            </Box>

            <Box
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
                src="../assets/Gallery/Birthday.jpg"
                alt="Kathmandu Fine-Art Portrait"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                referrerPolicy="no-referrer"
              />
              <Box
                className="image-overlay"
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
                  sx={{ color: "#E50914", fontWeight: 600, fontSize: "0.7rem" }}
                >
                  Birthday
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  Ananya Gautam
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#cbd5e1", fontWeight: 300, mt: 0.5 }}
                >
                  Happy Birthday Cutie.
                </Typography>
              </Box>
            </Box>

            <Box
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
                src="../assets/Gallery/bride 2.jpg"
                alt="Kathmandu Editorial Photography"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                referrerPolicy="no-referrer"
              />
              <Box
                className="image-overlay"
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
                  sx={{ color: "#E50914", fontWeight: 600, fontSize: "0.7rem" }}
                >
                  Creative Lighting
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  Tenzing Lama
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#cbd5e1", fontWeight: 300, mt: 0.5 }}
                >
                  Bride makeup photoshoot in wedding.
                </Typography>
              </Box>
            </Box>
          </div>

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="outlined"
              onClick={() => handleScrollToSection("portfolio")}
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

  return (
    <Box
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      id="app-root"
    >
      {/* Navigation Bar */}
      <Navbar
        onNavigate={handleScrollToSection}
        activeSection={activeSection}
      />

      <Box sx={{ flexGrow: 1, pb: 4 }}>
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route
            path="/services"
            element={
              <Box id="page-services">
                <ServiceCatalog
                  onSelectServiceForBooking={handleBookingRedirect}
                />
              </Box>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Box id="page-portfolio">
                <PortfolioGrid />
              </Box>
            }
          />
          <Route
            path="/faqs"
            element={
              <Box id="page-faqs">
                <FaqSection />
              </Box>
            }
          />
          <Route
            path="/contact"
            element={
              <Box id="page-contact">
                <ContactSection />
              </Box>
            }
          />
          <Route
            path="/visa-guides"
            element={
              <Box id="page-visa-guides">
                <VisaGuides
                  onScrollToResizer={() => handleScrollToSection("resizer")}
                />
                <Box sx={{ mt: 4 }}>
                  <InteractiveResizer />
                </Box>
              </Box>
            }
          />
          <Route
            path="/resizer"
            element={
              <Box id="page-resizer">
                <InteractiveResizer />
              </Box>
            }
          />
          <Route
            path="/pricing"
            element={
              <Box id="page-pricing">
                <PricingSection onBookPricingPackage={handleBookingRedirect} />
              </Box>
            }
          />
          <Route
            path="/book"
            element={
              <Box id="page-book-session">
                <BookingPortal initialServiceId={bookingServiceId} />
              </Box>
            }
          />
          {/* Catch-all Routing Redirect back to Home */}
          <Route path="*" element={renderHomePage()} />
        </Routes>
      </Box>

      {/* Elegant Red & White themed Footer block */}
      <Box
        sx={{
          py: 8,
          backgroundColor: mode === "dark" ? "#111111" : "#f1f5f9",
          color: mode === "dark" ? "#cbd5e1" : "#475569",
          borderTop: "1px solid rgba(229, 9, 20, 0.25)",
          transition: "background-color 0.3s, color 0.3s",
        }}
        id="app-footer"
      >
        <Container maxWidth="xl" id="footer-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Branch overview */}
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
                  <img src="/assets/Mero Click.png" alt="Studio Mero Click" />
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
                  STUDIOMERO<span className="text-[#E50914]">CLICK</span>
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 300, mb: 3, pr: { md: 4 }, lineHeight: 1.6 }}
              >
                Our Kathmandu-based photo studio provides passport validation,
                professional wedding videos, framing solutions, and portrait
                work matching strict criteria.
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
                <MapPin size={12} className="text-[#E50914]" />
                Rudramati Anamnagar Kathmandu
              </Typography>
            </div>

            {/* Quick links navigation */}
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
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("home")}
                  >
                    Home (Main)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("visa-guides")}
                  >
                    Online Resizer
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("services")}
                  >
                    Studio Services
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("portfolio")}
                  >
                    Our Portfolio
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("pricing")}
                  >
                    Pricing Sheets
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      mb: 1,
                      "&:hover": { color: "#E50914" },
                    }}
                    onClick={() => handleScrollToSection("contact")}
                  >
                    Contact details
                  </Typography>
                </div>
              </div>
            </div>

            {/* Branch Hours & Direct Help */}
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
                <PhoneCall size={14} className="text-[#E50914]" />{" "}
                +977-9823367428 (Rudramati Anamnagar)
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
                  * Studio hours are Sun - Fri, 08:00 AM to 8:00 PM.
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
              © {new Date().getFullYear()} Studio Mero Click Kathmandu. All
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
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("themeMode");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const activeTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#E50914", // Vivid Red luxury accent
            light: "#ff4d4d",
            dark: "#b30000",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "dark" ? "#050505" : "#f8fafc", // Sophisticated Dark / Slate light
            paper: mode === "dark" ? "#0a0a0a" : "#ffffff", // Dark Elevated / White Card
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#0f172a", // White or Deep Slate
            secondary: mode === "dark" ? "#cbd5e1" : "#475569", // Slate 300 or Slate 600
          },
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          h1: { fontFamily: '"Space Grotesk", sans-serif' },
          h2: { fontFamily: '"Space Grotesk", sans-serif' },
          h3: { fontFamily: '"Space Grotesk", sans-serif' },
          h4: { fontFamily: '"Space Grotesk", sans-serif' },
          h5: { fontFamily: '"Space Grotesk", sans-serif' },
          h6: { fontFamily: '"Space Grotesk", sans-serif' },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                fontFamily: '"Space Grotesk", sans-serif',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
