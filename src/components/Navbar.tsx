/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Typography,
  Container,
  Drawer,
  List,
  useMediaQuery,
  useTheme,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Camera,
  Menu,
  X,
  Calendar,
  PhoneCall,
  HelpCircle,
  DollarSign,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Video,
  Frame,
  Gift,
  FileText,
  Wand2,
  ShoppingBag,
  User,
  Users,
  Printer,
  Film,
  Award,
  ChevronRight,
  Compass,
  Heart,
  Image as ImageIcon,
  VideoIcon,
} from "lucide-react";
import { ColorModeContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Mero Click.png";

export interface StudioService {
  id: string;
  title: string;
  category:
    | "Portrait"
    | "Product"
    | "Event"
    | "Visa"
    | "Wedding"
    | "Videography"
    | "Photo Frame"
    | "Photography"
    | "Customized Gift"
    | "Photo Enhancement"
    | "Document Service";
  basePrice: string;
  duration: string;
  description: string;
  features: string[];
  rating: number;
  imageUrl: string;
}

export type ServiceMenuItem = {
  label: string;
  value: string;
  section: string;
  icon: React.ElementType;
};

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [otherAnchorEl, setOtherAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isDark = theme.palette.mode === "dark";

  // Customized Kathmandu services menu category list
  const serviceCategories: ServiceMenuItem[] = [
    {
      label: "Passport & Visa",
      value: "Visa",
      section: "services",
      icon: FileText,
    },
    {
      label: "Executive Portraits",
      value: "Portrait",
      section: "services",
      icon: User,
    },
    {
      label: "Wedding Shoots",
      value: "Wedding",
      section: "services",
      icon: Heart,
    },
    {
      label: "Cinematic Video",
      value: "Videography",
      section: "services",
      icon: Video,
    },
    {
      label: "Premium Photo Framing",
      value: "Photo Frame",
      section: "services",
      icon: Frame,
    },
    {
      label: "Photography Sessions",
      value: "Photography",
      section: "services",
      icon: Camera,
    },
    {
      label: "Product & E-Commerce",
      value: "Product",
      section: "services",
      icon: ShoppingBag,
    },
    {
      label: "Restoration & Editing",
      value: "Photo Enhancement",
      section: "services",
      icon: Wand2,
    },
    {
      label: "Customized Gifts",
      value: "Customized Gift",
      section: "services",
      icon: Gift,
    },
    {
      label: "Document Printing",
      value: "Document Service",
      section: "services",
      icon: Printer,
    },
  ];

  const primaryMenuItems = [
    { label: "Portfolio", section: "portfolio", icon: Film },
    { label: "Video", section: "video", icon: VideoIcon },
    { label: "FAQs", section: "faqs", icon: HelpCircle },
    { label: "Contact", section: "contact", icon: PhoneCall },
  ];

  const otherMenuItems = [
    { label: "Visa Guides & Resizer", section: "visa-guides", icon: ImageIcon },
    { label: "Pricing Sheets", section: "pricing", icon: DollarSign },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
    handleDropdownClose();
  };

  const handleCategoryNavClick = (categoryVal: string) => {
    navigate(`/services?category=${encodeURIComponent(categoryVal)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
    handleDropdownClose();
  };

  const handleServicesDropdownOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleOtherDropdownOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setOtherAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setServicesAnchorEl(null);
    setOtherAnchorEl(null);
  };

  const isOtherActive = otherMenuItems.some(
    (item) => activeSection === item.section,
  );
  const isServicesActive = activeSection === "services";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isDark
            ? "rgba(5, 5, 5, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)"}`,
          backdropFilter: "blur(10px)",
          color: theme.palette.text.primary,
          py: 0.5,
          transition: "background-color 0.3s, border-color 0.3s",
        }}
        id="navbar-appbar"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Elegant Kathmandu Branding Logo */}
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => handleNavClick("home")}
              id="navbar-logo-container"
            >
              <Box
                sx={{
                  mr: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "20px",
                  background: "linear-gradient(10deg, white 0%, #black 100%)",
                  boxShadow: "0 4px 14px rgba(229, 9, 20, 0.35)",
                }}
              >
                <img src={logo} alt="Studio Mero Click" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    letterSpacing: ".05rem",
                    color: "text.primary",
                    lineHeight: 1.1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  STUDIO MERO
                  <span className="text-[#E50914] ml-1">CLICK</span>
                </Typography>
                <span className="text-[0.62rem] tracking-[0.2em] text-red-500 font-bold block uppercase -mt-0.5">
                  RATOPUL KATHMANDU
                </span>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
                id="navbar-desktop-menu"
              >
                {/* Home Link */}
                <Button
                  onClick={() => handleNavClick("home")}
                  sx={{
                    color:
                      activeSection === "home" ? "#E50914" : "text.secondary",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: activeSection === "home" ? 600 : 400,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 1.5,
                    py: 0.75,
                    "&:hover": {
                      color: "#E50914",
                      backgroundColor: "rgba(229, 9, 20, 0.04)",
                    },
                  }}
                >
                  Home
                </Button>

                {/* Dropdown for Services (Mega-Menu Style) */}
                <Button
                  id="nav-btn-services"
                  onClick={handleServicesDropdownOpen}
                  endIcon={
                    <ChevronDown
                      size={14}
                      className={
                        servicesAnchorEl
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    />
                  }
                  sx={{
                    color: isServicesActive ? "#E50914" : "text.secondary",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: isServicesActive ? 600 : 400,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 1.5,
                    py: 0.75,
                    position: "relative",
                    "&:hover": {
                      color: "#E50914",
                      backgroundColor: "rgba(229, 9, 20, 0.04)",
                    },
                  }}
                >
                  Services
                </Button>

                <MuiMenu
                  anchorEl={servicesAnchorEl}
                  open={Boolean(servicesAnchorEl)}
                  onClose={handleDropdownClose}
                  disableScrollLock={true}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "background.paper",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                      borderRadius: "8px",
                      color: "text.primary",
                      boxShadow: isDark
                        ? "0 12px 42px rgba(0,0,0,0.65)"
                        : "0 12px 30px rgba(0,0,0,0.08)",
                      minWidth: 540,
                      p: 2,
                      mt: 1,
                    },
                  }}
                >
                  <Box sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "#E50914",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                      }}
                    >
                      Studio Specialties
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontWeight: 300 }}
                    >
                      Choose an option to see details, pricing, and book online.
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 1, opacity: 0.5 }} />
                  <div className="grid grid-cols-2 gap-2">
                    {serviceCategories.map((item) => {
                      const Icon = item.icon;
                      return (
                        <MuiMenuItem
                          key={item.label}
                          onClick={() => handleCategoryNavClick(item.value)}
                          sx={{
                            borderRadius: "6px",
                            py: 1.5,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            "&:hover": {
                              backgroundColor: "rgba(229, 9, 20, 0.05)",
                              "& svg": {
                                color: "#E50914",
                                transform: "scale(1.1)",
                              },
                              "& .menu-title": {
                                color: "#E50914",
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.2,
                              borderRadius: "6px",
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.02)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon
                              size={18}
                              className="text-slate-400 transition-all duration-200"
                            />
                          </Box>
                          <Box>
                            <span className="font-semibold block text-sm text-[text.primary] menu-title transition-colors">
                              {item.label}
                            </span>
                            <span className="text-xs text-slate-400 block font-light">
                              Professional {item.value} setups
                            </span>
                          </Box>
                        </MuiMenuItem>
                      );
                    })}
                  </div>
                </MuiMenu>

                {/* Primary navigation menus */}
                {primaryMenuItems.map((item) => {
                  const isActive = activeSection === item.section;
                  return (
                    <Button
                      key={item.label}
                      onClick={() => handleNavClick(item.section)}
                      id={`nav-btn-${item.section}`}
                      sx={{
                        color: isActive ? "#E50914" : "text.secondary",
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 1.5,
                        py: 0.75,
                        "&:hover": {
                          color: "#E50914",
                          backgroundColor: "rgba(229, 9, 20, 0.04)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}

                {/* Dropdown for "Other Sections" */}
                <Button
                  id="nav-btn-other"
                  onClick={handleOtherDropdownOpen}
                  endIcon={
                    <ChevronDown
                      size={14}
                      className={
                        otherAnchorEl
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    />
                  }
                  sx={{
                    color: isOtherActive ? "#E50914" : "text.secondary",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: isOtherActive ? 600 : 400,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 1.5,
                    py: 0.75,
                    "&:hover": {
                      color: "#E50914",
                      backgroundColor: "rgba(229, 9, 20, 0.04)",
                    },
                  }}
                >
                  View More Pages
                </Button>

                <MuiMenu
                  anchorEl={otherAnchorEl}
                  open={Boolean(otherAnchorEl)}
                  onClose={handleDropdownClose}
                  disableScrollLock={true}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "background.paper",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                      borderRadius: "8px",
                      color: "text.primary",
                      boxShadow: isDark
                        ? "0 10px 30px rgba(0,0,0,0.5)"
                        : "0 10px 20px rgba(0,0,0,0.06)",
                      minWidth: 220,
                      p: 0.5,
                    },
                  }}
                  id="nav-other-dropdown"
                >
                  {otherMenuItems.map((item) => {
                    const isActive = activeSection === item.section;
                    const Icon = item.icon;
                    return (
                      <MuiMenuItem
                        key={item.label}
                        onClick={() => handleNavClick(item.section)}
                        sx={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: "0.875rem",
                          py: 1.5,
                          px: 2.25,
                          borderRadius: "6px",
                          color: isActive ? "#E50914" : "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          "&:hover": {
                            backgroundColor: "rgba(229, 9, 20, 0.06)",
                            color: "#E50914",
                          },
                        }}
                      >
                        <Icon size={16} />
                        {item.label}
                      </MuiMenuItem>
                    );
                  })}
                </MuiMenu>

                {/* Elegant Theme Mode Toggle */}
                <IconButton
                  onClick={toggleColorMode}
                  id="nav-theme-toggle"
                  sx={{
                    ml: 1,
                    color: isDark ? "#ffeb3b" : "#334155",
                    backgroundColor: isDark
                      ? "rgba(255, 235, 59, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255, 235, 59, 0.15)"
                        : "rgba(0, 0, 0, 0.08)",
                    },
                    borderRadius: "50%",
                    p: 1,
                  }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </IconButton>

                {/* Call-to-action Book Button */}
                <Button
                  variant="contained"
                  onClick={() => handleNavClick("book-session")}
                  id="nav-btn-book-session"
                  sx={{
                    ml: 2,
                    background:
                      "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    px: 3,
                    py: 1.1,
                    borderRadius: "4px",
                    boxShadow: "0 4px 14px rgba(229, 9, 20, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
                      boxShadow: "0 6px 20px rgba(229, 9, 20, 0.5)",
                      transform: "translateY(-1px)",
                    },
                  }}
                  startIcon={<Calendar size={15} />}
                >
                  Book Session
                </Button>
              </Box>
            )}

            {/* Mobile Navigation Header toggles */}
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={toggleColorMode}
                  id="nav-theme-toggle-mobile"
                  sx={{
                    color: isDark ? "#ffeb3b" : "#334155",
                    backgroundColor: isDark
                      ? "rgba(255, 235, 59, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255, 235, 59, 0.15)"
                        : "rgba(0, 0, 0, 0.08)",
                    },
                    borderRadius: "50%",
                    p: 0.75,
                  }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  id="navbar-mobile-toggle"
                  sx={{
                    color: "inherit",
                    border: `1px solid ${isDark ? "rgba(229, 9, 20, 0.25)" : "rgba(229, 9, 20, 0.15)"}`,
                    borderRadius: "4px",
                    p: 0.75,
                  }}
                >
                  <Menu size={20} />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Navigation Panel */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            maxWidth: 320,
            backgroundColor: "background.paper",
            borderLeft: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
            color: "text.primary",
            p: 2.5,
            transition: "background-color 0.3s, color 0.3s",
          },
        }}
        id="navbar-mobile-drawer"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                backgroundColor: "rgba(229, 9, 20, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
              }}
            >
              <Camera size={16} color="#E50914" />
            </Box>
            <span
              className={`font-bold text-base leading-tight tracking-wider font-display ${isDark ? "text-white" : "text-slate-900"}`}
            >
              STUDIO<span className="text-[#E50914]">SERVICE</span>
            </span>
          </Box>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "text.primary" }}
            id="close-drawer-btn"
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Mobile menu listings with collapsibles */}
        <List sx={{ mb: 1, p: 0 }}>
          {/* Home Link */}
          <Box
            onClick={() => handleNavClick("home")}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1.5,
              px: 2,
              mb: 0.5,
              borderRadius: "6px",
              backgroundColor:
                activeSection === "home"
                  ? "rgba(229, 9, 20, 0.08)"
                  : "transparent",
              color: activeSection === "home" ? "#E50914" : "text.secondary",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(229, 9, 20, 0.04)",
              },
            }}
          >
            <Compass
              size={18}
              className="mr-3"
              style={{
                color: activeSection === "home" ? "#E50914" : "inherit",
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: activeSection === "home" ? 600 : 400,
                fontSize: "0.95rem",
              }}
            >
              Home
            </Typography>
          </Box>

          {/* Interactive Collapsible / Accordion for Services */}
          <Box
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              px: 2,
              mb: 0.5,
              borderRadius: "6px",
              color: isServicesActive ? "#E50914" : "text.secondary",
              cursor: "pointer",
              backgroundColor: isServicesActive
                ? "rgba(229, 9, 20, 0.04)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(229, 9, 20, 0.04)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Award
                size={18}
                className="mr-3"
                style={{ color: isServicesActive ? "#E50914" : "inherit" }}
              />
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: isServicesActive ? 600 : 400,
                  fontSize: "0.95rem",
                }}
              >
                Our Services
              </Typography>
            </Box>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180 text-[#E50914]" : ""}`}
            />
          </Box>

          <Collapse in={mobileServicesOpen} timeout="auto" unmountOnExit>
            <Box
              sx={{
                pl: 2,
                pr: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                borderLeft: "1px solid rgba(229,9,20,0.15)",
                ml: 3,
                mb: 1,
              }}
            >
              {serviceCategories.map((item) => {
                const CategoryIcon = item.icon;
                return (
                  <Box
                    key={item.label}
                    onClick={() => handleCategoryNavClick(item.value)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.25,
                      px: 2,
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "text.secondary",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(229, 9, 20, 0.05)",
                        color: "#E50914",
                      },
                    }}
                  >
                    <CategoryIcon size={15} className="mr-3 text-slate-400" />
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>

          {/* Portfolio & Rest of menus */}
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <Box
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                id={`drawer-btn-${item.section}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  px: 2,
                  mb: 0.5,
                  borderRadius: "6px",
                  backgroundColor: isActive
                    ? "rgba(229, 9, 20, 0.08)"
                    : "transparent",
                  color: isActive ? "#E50914" : "text.secondary",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(229, 9, 20, 0.04)",
                  },
                }}
              >
                <Icon
                  size={18}
                  className="mr-3"
                  style={{ color: isActive ? "#E50914" : "inherit" }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </List>

        <Divider
          sx={{
            my: 2,
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        />

        <Box sx={{ px: 2, mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#ff4d4d",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "block",
            }}
          >
            Extra Tools & Information
          </Typography>
        </Box>

        <List sx={{ mb: 2, p: 0 }}>
          {otherMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <Box
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                id={`drawer-btn-${item.section}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  px: 2,
                  mb: 0.5,
                  borderRadius: "6px",
                  backgroundColor: isActive
                    ? "rgba(229, 9, 20, 0.08)"
                    : "transparent",
                  color: isActive ? "#E50914" : "text.secondary",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(229, 9, 20, 0.04)",
                  },
                }}
              >
                <Icon
                  size={18}
                  className="mr-3"
                  style={{ color: isActive ? "#E50914" : "inherit" }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </List>

        <Box sx={{ px: 2, mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavClick("book-session")}
            id="drawer-btn-book-session"
            sx={{
              background: "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 4px 14px rgba(229, 9, 20, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
              },
            }}
            startIcon={<Calendar size={16} />}
          >
            Book Session
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
