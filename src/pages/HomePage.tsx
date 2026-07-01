/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Hero from "../components/Hero";
import { motion } from "motion/react";


import { useNavigate } from 'react-router-dom';
import { apiService } from "../utils/supabase";
import { PortfolioItem } from "../types";


import modeling5 from "../assets/Gallery/Modeling 5.jpg";
import black from "../assets/Gallery/Black.jpg";
import birthday from "../assets/Gallery/Birthday.jpg";
import bride2 from "../assets/Gallery/bride 2.jpg";


import wedding from "../assets/Gallery/Couple 2.jpg"
import portrait from "../assets/Gallery/protrait.png"
import visa from "../assets/Gallery/Pprtait 2.jpg"
import photoFrame from "../assets/Gallery/PhotoFrame.png"
import studio from "../assets/Gallery/Smokey.jpg"
import events from "../assets/Gallery/Modeling 3.jpg"
import Product from "../assets/Gallery/Ads.png"
import PhotoPrinting from "../assets/Gallery/HighQuality.png"
interface HomePageProps {
  onNavigate: (sectionId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps, index = 0) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [randomPortfolios, setRandomPortfolios] = React.useState<PortfolioItem[]>([]);

  React.useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const items = await apiService.getPortfolioItems();
        if (items && items.length > 0) {
          const shuffled = [...items].sort(() => 0.5 - Math.random());
          setRandomPortfolios(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching portfolios:", err);
      }
    };
    fetchPortfolios();
  }, []);

  // Smooth redirects to the targeted portfolio filters
  const handleCategoryRedirect = (category: string) => {
    navigate(`/portfolio?category=${category}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const COLORS = {
    ink: isDark ? "#ffffff" : "#0F0F0E",
    paper: isDark ? "#070707" : "#ffffff",
    paperDim: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(229, 9, 20, 0.03)",
    stamp: "#E50914",
    grey: isDark ? "#94a3b8" : "#64748b",
    line: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };

  const ICONS = {
    passport: (
      <>
        <path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M8 17c.5-2 2-3 4-3s3.5 1 4 3" />
      </>
    ),
    wedding: (
      <>
        <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M5 19c0-2.5 3-4 7-4s7 1.5 7 4" />
        <path d="M9 7l1.5 2M15 7l-1.5 2" />
      </>
    ),
    frame: (
      <>
        <rect x="4" y="4" width="16" height="16" />
        <rect x="7.5" y="7.5" width="9" height="9" />
      </>
    ),
    product: (
      <>
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    ),
    gift: (
      <>
        <rect x="4" y="9" width="16" height="11" />
        <path d="M4 9V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
        <path d="M12 4v16" />
      </>
    ),
    portrait: (
      <>
        <circle cx="12" cy="9" r="3.2" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="6" width="13" height="12" />
        <path d="M16 10l5-3v10l-5-3" />
      </>
    ),
    camera: (
      <>
        <rect x="3" y="7" width="18" height="12" />
        <path d="M8 7l1.5-2.5h5L16 7" />
        <circle cx="12" cy="13" r="3.2" />
      </>
    ),
    edit: (
      <>
        <path d="M4 17.5V20h2.5L14 12.5l-2.5-2.5L4 17.5z" />
        <path d="M13 8l2-2 2.5 2.5-2 2z" />
      </>
    ),
    doc: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h7M9 16h7" />
      </>
    ),
    layout: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </>
    ),
    leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
    archive: (
      <>
        <rect x="3" y="4" width="18" height="4" rx="2" ry="2" />
        <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </>
    ),
    coffee: (
      <>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
  };

  const PRODUCTS = [
    {
      title: "Photoframe",
      icon: "frame",
    },
    {
      title: "Cup Prints",
      icon: "coffee",
    },
    {
      title: "Polaroid Prints",
      icon: "camera",
    },
    {
      title: "Collages",
      icon: "layout",
    },
    {
      title: "Customized Designed Photo",
      icon: "edit",
    },
    {
      title: "Dubo ko Mala",
      icon: "leaf",
    },
    {
      title: "Rose & Mala Preservation",
      icon: "archive",
    },
  ];

  const SERVICES = [
    {
      code: "SVC-01",
      dept: "PASSPORT",
      title: "Passport & visa photos",
      copy: "Biometric passport, visa and ID photos cut and checked against the destination country's exact specification.",
      category: "visa",
      target: "visa-guides",
      tag: "Spec checked",
      icon: "passport",
      spec: true,
    },
    {
      code: "SVC-02",
      dept: "WEDDING",
      title: "Wedding shoot",
      copy: "Full-day photography and cinematic coverage, from getting-ready to the last dance.",
      category: "Wedding",
      target: "services",
      tag: "Full-day coverage",
      icon: "wedding",
      spec: false,
    },
    {
      code: "SVC-03",
      dept: "FRAMING",
      title: "Premium photo framing",
      copy: "Handcrafted frames in solid wood and metal, fitted and finished in-house.",
      category: "Photo Frame",
      target: "services",
      tag: "Made to order",
      icon: "frame",
      spec: false,
    },
    {
      code: "SVC-04",
      dept: "PRODUCT",
      title: "Product & e-commerce",
      copy: "Clean, consistent product photography for listings, catalogues and campaigns.",
      category: "Product",
      target: "services",
      tag: "Batch pricing",
      icon: "product",
      spec: false,
    },
    {
      code: "SVC-05",
      dept: "GIFTING",
      title: "Customised gifts",
      copy: "Photos printed onto mugs, albums, keychains and other keepsakes.",
      category: "Customized Gift",
      target: "services",
      tag: "Same-week",
      icon: "gift",
      spec: false,
    },
    {
      code: "SVC-06",
      dept: "PORTRAIT",
      title: "Exclusive portraits",
      copy: "Studio or outdoor sessions, directed around how you actually want to be seen.",
      category: "Portrait",
      target: "services",
      tag: "Studio or on-site",
      icon: "portrait",
      spec: false,
    },
    {
      code: "SVC-07",
      dept: "FILM",
      title: "Cinematic videos",
      copy: "4K commercials, reels, interviews and event films, shot and edited end to end.",
      category: "Videography",
      target: "services",
      tag: "4K delivery",
      icon: "video",
      spec: false,
    },
    {
      code: "SVC-08",
      dept: "SESSIONS",
      title: "Photography sessions",
      copy: "Sessions for individuals, families, couples and businesses, booked by the hour.",
      category: "Photography",
      target: "services",
      tag: "Hourly booking",
      icon: "camera",
      spec: false,
    },
    {
      code: "SVC-09",
      dept: "RETOUCH",
      title: "Resizing & editing",
      copy: "Retouching, background removal, restoration and colour correction on existing photos.",
      category: "Photo Enhancement",
      target: "services",
      tag: "48hr turnaround",
      icon: "edit",
      spec: false,
    },
    {
      code: "SVC-10",
      dept: "PRINTING",
      title: "Document printing",
      copy: "Fast, accurate printing for certificates, forms and other official paperwork.",
      category: "Document Service",
      target: "services",
      tag: "Spec checked",
      icon: "doc",
      spec: true,
    },
  ];
  function ServiceCard({ item, onClick, index = 0 }) {
    const [hover, setHover] = React.useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ height: "100%" }}
      >
        <Box
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClick();
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            position: "relative",
            bgcolor: COLORS.paper,
            p: { xs: 3, sm: 3.5 },
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: { xs: 260, sm: 280 },
            borderRadius: "16px",
            overflow: "hidden", // Added to contain the background icon
            border: `1px solid ${hover ? COLORS.stamp : COLORS.line}`,
            transition: "transform 0.4s cubic-bezier(.2,.8,.2,1), box-shadow 0.4s ease, border-color 0.4s ease",
            outline: "none",
            transform: hover ? "translateY(-6px)" : "none",
            boxShadow: hover
              ? isDark
                ? "0 16px 36px rgba(0,0,0,0.55)"
                : "0 16px 32px rgba(0,0,0,0.08)"
              : "none",
            "&:focus-visible": {
              boxShadow: `0 0 0 2px ${COLORS.stamp}`,
            },
          }}
        >
          {/* Background Watermark Icon */}
          <Box
            sx={{
              position: "absolute",
              width: "180px",
              height: "180px",
              opacity: hover ? (isDark ? 0.08 : 0.05) : (isDark ? 0.03 : 0.02),
              color: COLORS.ink,
              transform: hover ? "scale(1.1) rotate(-10deg)" : "scale(1) rotate(0deg)",
              transition: "all 0.6s cubic-bezier(.2,.8,.2,1)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[item.icon]}
            </svg>
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 3.5,
              pt: 2.5,
              borderTop: `1px solid ${COLORS.line}`,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: item.spec ? COLORS.ink : COLORS.grey,
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.spec && (
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: COLORS.stamp,
                    display: "inline-block",
                    mr: 1,
                    boxShadow: `0 0 0 3px rgba(229, 9, 20, 0.15)`,
                  }}
                />
              )}
              {item.title}
            </Typography>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: hover ? COLORS.stamp : "transparent",
                transform: hover ? "translateX(2px)" : "translateX(0)",
                transition: "transform 0.4s ease, background-color 0.4s ease",
                color: hover ? "#FFFFFF" : COLORS.grey,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }

  const handleClick = (item) => {
    if (item.category) {
      navigate(`/services?category=${encodeURIComponent(item.category)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onNavigate(item.target);
    }
  };

  return (

    <Box id="page-home">
      <Hero onNavigate={onNavigate} />

      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 } }}>
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
          {(randomPortfolios.length > 0
            ? randomPortfolios.map((item) => ({
              id: item.id,
              src: item.imageUrl,
              overline: item.category,
              title: item.title,
              caption: item.specLabel || "Custom Added Image",
            }))
            : [
              {
                id: "1",
                src: modeling5,
                overline: "Modeling",
                title: "Prerna Shrestha",
                caption: "Executive image captured with continuous ring lights.",
              },
              {
                id: "2",
                src: black,
                overline: "Creative Photoshoot",
                title: "Rohan Adhikari",
                caption: "Black and White Photoshoot.",
              },
              {
                id: "3",
                src: birthday,
                overline: "Birthday",
                title: "Ananya Gautam",
                caption: "Happy Birthday Cutie.",
              },
              {
                id: "4",
                src: bride2,
                overline: "Creative Lighting",
                title: "Tenzing Lama",
                caption: "Bride makeup photoshoot in wedding.",
              },
            ]
          ).map((item) => (
            <Box
              key={item.id}
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
                mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
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



      {/* Explore Portfolios by Category Showcase Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ height: "100%" }}
      >
        <Box sx={{ mt: { xs: 10, md: 10 }, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', pt: { xs: 4, md: 4 } }} id="hero-quick-portfolio-redirects">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#E50914',
                fontWeight: 600,
                letterSpacing: '0.15em',
                display: 'block',
                mb: 1.5,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              QUICK ACCESS GALLERIES
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                mb: 2,
                color: 'text.primary',
              }}
            >
              Explore Portfolios by Specialty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Instantly drill down into our custom-captured galleries. Filter by your targeted style to check our high-fidelity output.
            </Typography>
          </Box>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'wedding',
                category: 'Wedding',
                img: wedding,
                alt: 'Cinematic Weddings Portfolio',
                eyebrow: 'CINEMATIC WEDDINGS',
                title: 'Traditional Couples',
                cta: 'View Wedding Portfolio',
              },
              {
                id: 'portrait',
                category: 'Portrait',
                img: portrait,
                alt: 'Executive Portraits Portfolio',
                eyebrow: 'EXECUTIVE PORTRAITS',
                title: 'Professional Headshots',
                cta: 'View Portrait Portfolio',
              },
              {
                id: 'visa',
                category: 'Visa',
                img: visa,
                alt: 'Visa & Biometrics Portfolio',
                eyebrow: 'VISA & BIOMETRICS',
                title: 'Official Embassy Photos',
                cta: 'View Biometric Portfolio',
              },
              {
                id: 'framing',
                category: 'Photo Frame',
                img: photoFrame,
                alt: 'Custom Framing Portfolio',
                eyebrow: 'CUSTOM FRAMING',
                title: 'Handcrafted Wood Frames',
                cta: 'View Framing Portfolio',
              },
              {
                id: 'studio',
                category: 'Studio',
                img: studio,
                eyebrow: 'STUDIO & COMMERCIAL',
                title: 'Professional Studio Portraits',
                cta: 'View Studio Portfolio',
              },
              {
                id: 'printing',
                category: 'Photo Printing',
                img: PhotoPrinting,
                alt: 'Photo Printing Portfolio',
                eyebrow: 'PHOTO PRINTING',
                title: 'High Quality Photo Prints',
                cta: 'View Printing Portfolio',
              },
              {
                id: 'catalog',
                category: 'Product Catalog',
                img: Product,
                alt: 'Product Catalog Portfolio',
                eyebrow: 'PRODUCT CATALOG',
                title: 'High Quality Product Advertisement',
                cta: 'View Product Catalog',
              },
              {
                id: 'events',
                category: 'Events',
                img: events,
                alt: 'Events Photoshoot Portfolio',
                eyebrow: 'EVENTS',
                title: 'Events Photoshoot',
                cta: 'View Events Portfolio',
              },
            ].map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                id={`category-card-${card.id}`}
              >
                <Box
                  className="portfolio-card"
                  sx={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.04)',
                    '&:hover .portfolio-card-img': {
                      transform: 'scale(1.08)',
                    },
                    '&:hover .portfolio-card-rule': {
                      width: '32px',
                    },
                    '&:hover .portfolio-card-cta-arrow': {
                      transform: 'translateX(4px)',
                    },
                  }}
                  onClick={() => handleCategoryRedirect(card.category)}
                >
                  <Box
                    component="img"
                    className="portfolio-card-img"
                    src={card.img}
                    alt={card.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                      transform: 'scale(1)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 80%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 3,
                    }}
                  >
                    <Box
                      className="portfolio-card-rule"
                      sx={{
                        width: '16px',
                        height: '2px',
                        backgroundColor: '#ff4d4d',
                        mb: 1,
                        transition: 'width 0.35s ease',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: '#ff4d4d', fontWeight: 600, mb: 0.5, letterSpacing: '0.05em' }}
                    >
                      {card.eyebrow}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '1.05rem',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        color: '#ffffff',
                        p: 0,
                        minWidth: 'auto',
                        justifyContent: 'flex-start',
                        fontSize: '0.8rem',
                        textTransform: 'none',
                        fontFamily: '"Space Grotesk", sans-serif',
                        '&:hover': { color: '#ff4d4d', backgroundColor: 'transparent' },
                      }}
                    >
                      {card.cta}{' '}
                      <span className="portfolio-card-cta-arrow" style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>
                        →
                      </span>
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </div>
        </Box>
      </motion.div>
      <Box
        sx={{
          backgroundColor: mode === "dark" ? "#070707" : "#f8fafc",
          borderTop: "1px solid",
          borderColor:
            mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        }}
      >
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
            Products We Offer
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
            Explore our beautifully crafted physical products and preservation services, creating timeless keepsakes for your memories.
          </Typography>
          <Box sx={{ bgcolor: COLORS.paper, py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 1180, mx: "auto" }}>


              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                  },
                  gap: 3.5,
                }}
              >
                {PRODUCTS.map((item, index) => (
                  <ServiceCard
                    key={item.title}
                    item={item}
                    index={index}
                    onClick={() => { }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
