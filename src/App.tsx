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
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import FaqsPage from "./pages/FaqsPage";
import ContactPage from "./pages/ContactPage";
import VisaGuidesPage from "./pages/VisaGuidesPage";
import ResizerPage from "./pages/ResizerPage";
import PricingPage from "./pages/PricingPage";
import BookingPage from "./pages/BookingPage";
import VideoSection from "./pages/VideoPage";
import AdminRoutes from "./routes/AdminRoutes";
import LearnFromUs from './pages/LearnFromUsPage';

import { Camera, MapPin, ExternalLink, Mail, PhoneCall } from "lucide-react";

import logo from "./assets/Mero Click.png";

export const ColorModeContext = createContext({
  mode: "dark" as "dark" | "light",
  toggleColorMode: () => { },
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
      case "video":
        return "/video";
      case "visa-guides":
        return "/visa-guides";
      case 'learn-from-us':
        return '/learn';

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
      case "/video":
        return "video";
      case '/learn':
        return 'learn-from-us';
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
          <Route
            path="/"
            element={<HomePage onNavigate={handleScrollToSection} />}
          />
          <Route
            path="/services"
            element={
              <ServicesPage onSelectServiceForBooking={handleBookingRedirect} />
            }
          />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/video" element={<VideoSection />} />
          <Route path='/learn' element={<LearnFromUs />} />
          <Route
            path="/visa-guides"
            element={
              <VisaGuidesPage
                onScrollToResizer={() => handleScrollToSection("resizer")}
              />
            }
          />
          <Route path="/resizer" element={<ResizerPage />} />
          <Route
            path="/pricing"
            element={
              <PricingPage onBookPricingPackage={handleBookingRedirect} />
            }
          />
          <Route
            path="/book"
            element={<BookingPage initialServiceId={bookingServiceId} />}
          />
          {/* Admin Dashboard Route */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* Catch-all Routing Redirect back to Home */}
          <Route
            path="*"
            element={<HomePage onNavigate={handleScrollToSection} />}
          />
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
                  <img src={logo} alt="Studio Mero Click" />
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
