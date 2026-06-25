/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Check, Clock, Award } from "lucide-react";
import { STUDIO_SERVICES } from "../data";
import { apiService } from "../utils/supabase";
import { StudioService } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

interface ServiceCatalogProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export default function ServiceCatalog({
  onSelectServiceForBooking,
}: ServiceCatalogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category") || "All";

  const [services, setServices] = React.useState<StudioService[]>([]);
  const [loading, setLoading] = React.useState(true);

  const categories = React.useMemo(() => {
    const list = [
      "All",
      "Identity Photo",
      "Portrait",
      "Wedding",
      "Photo Frame",
      "Photography",
      "Photo Enhancement",
      "Customized Gift",
      "Document Service",
    ];
    services.forEach((s) => {
      if (
        s.category &&
        !list.some((c) => c.toLowerCase() === s.category.toLowerCase())
      ) {
        list.push(s.category);
      }
    });
    return list;
  }, [services]);

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      navigate("/services");
    } else {
      navigate(`/services?category=${encodeURIComponent(category)}`);
    }
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter(
        (service) =>
          service.category.toLowerCase() === selectedCategory.toLowerCase(),
      );

  React.useEffect(() => {
    let active = true;
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        if (active) {
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load dynamic studio services:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchServices();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="services-root"
    >
      <Container maxWidth="xl" id="services-container">
        {/* Section Heading */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: "100px",
              backgroundColor: "rgba(229, 9, 20, 0.08)",
              border: "1px solid rgba(229, 9, 20, 0.25)",
              mb: 2.5,
            }}
          >
            <Award size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: "#ff4d4d",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Excellence & Compliance
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 2,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Our Photography Specialties
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              maxWidth: "680px",
              mx: "auto",
              fontWeight: 300,
            }}
          >
            We operate Kathmandu's premier boutique portrait and biometric
            studio, utilizing calibrated high-definition camera arrays, elite
            backdrops, and masterful studio lighting setups.
          </Typography>
        </Box>

        {/* Swipable Category Filter Pills */}
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            mb: 8,
            overflowX: "auto",
            pb: 2,
            justifyContent: { xs: "flex-start", md: "center" },
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            px: { xs: 1.5, md: 0 },
            mx: { xs: -2, md: 0 },
          }}
        >
          {categories.map((cat) => {
            const isActive =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <Chip
                key={cat}
                label={cat}
                onClick={() => handleCategoryChange(cat)}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.85rem",
                  px: 1,
                  py: 2,
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? "#E50914"
                    : isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                  color: isActive ? "#ffffff" : "text.secondary",
                  border: "1px solid",
                  borderColor: isActive
                    ? "#E50914"
                    : isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "#E50914"
                      : "rgba(229, 9, 20, 0.08)",
                    borderColor: "#E50914",
                    color: isActive ? "#ffffff" : "#E50914",
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Services Grid */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 12,
            }}
          >
            <CircularProgress sx={{ color: "#E50914" }} />
          </Box>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="w-full">
                <Card
                  className="hover-gold-glow"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    backgroundColor: "background.paper",
                    boxShadow: "none",
                    overflow: "hidden",
                    transition: "background-color 0.3s, border-color 0.3s",
                  }}
                  id={`service-card-${service.id}`}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "40%" },
                      minWidth: { xs: "auto", md: "200px" },
                      position: "relative",
                      height: { xs: "240px", md: "auto" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={service.imageUrl}
                      alt={service.title}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      referrerPolicy="no-referrer"
                    />
                    {/* Category chip overlay */}
                    <Chip
                      label={service.category}
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "rgba(26, 26, 26, 0.85)",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 600,
                        border: "1px solid rgba(229, 9, 20, 0.3)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  {/* Content Side */}
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 3, md: 4 },
                      boxSizing: "border-box",
                      "&:last-child": { pb: { xs: 3, md: 4 } },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 1,
                        lineHeight: 1.25,
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          value={service.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{ color: "#E50914" }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          fontSize: "0.8rem",
                        }}
                      >
                        {service.rating.toFixed(1)} / 5.0
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.5,
                        mb: 3,
                        fontSize: "0.9rem",
                        fontWeight: 300,
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Pricing and duration bubble */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                        p: 1.5,
                        backgroundColor: isDark ? "#111111" : "#f1f5f9",
                        border: "1px solid",
                        borderColor: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.05)",
                        borderRadius: "4px",
                        transition: "background-color 0.3s, border-color 0.3s",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            opacity: 0.8,
                            display: "block",
                            lineHeight: 1,
                          }}
                        >
                          Price From
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#E50914" }}
                        >
                          {service.basePrice}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          borderLeft: "1px solid",
                          borderColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          pl: 2,
                        }}
                      >
                        <Clock size={14} className="text-gray-400" />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                        >
                          {service.duration}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bullet features */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        opacity: 0.8,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      What Is Included:
                    </Typography>

                    <List sx={{ p: 0, mb: 4 }} dense>
                      {(Array.isArray(service.features)
                        ? service.features
                        : typeof service.features === "string"
                          ? (() => {
                            try {
                              return JSON.parse(service.features);
                            } catch {
                              return (service.features as any)
                                .split("\n")
                                .filter(Boolean);
                            }
                          })()
                          : []
                      ).map((feature: string, idx: number) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <Check size={14} className="text-[#E50914]" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.825rem",
                                  fontWeight: 300,
                                }}
                              >
                                {feature}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Action */}
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => onSelectServiceForBooking(service.id)}
                        id={`book-service-btn-${service.id}`}
                        sx={{
                          backgroundColor: isDark ? "#ffffff" : "#0f172a",
                          color: isDark ? "#000000" : "#ffffff",
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 600,
                          textTransform: "none",
                          py: 1.25,
                          borderRadius: "4px",
                          "&:hover": {
                            backgroundColor: "#E50914",
                            color: "#ffffff",
                          },
                        }}
                      >
                        Book Session Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
              }}
            >
              No Specialty Under "{selectedCategory}" Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                fontWeight: 300,
                maxWidth: "500px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              We are regularly expanding our professional studio catalogue in
              Kathmandu. Reach out to our helpdesk to request custom setups or
              same-day reservations.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleCategoryChange("All")}
              sx={{
                color: "#E50914",
                borderColor: "#E50914",
                borderRadius: "4px",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(229,9,20,0.05)",
                  borderColor: "#E50914",
                },
              }}
            >
              View All Specialties
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
