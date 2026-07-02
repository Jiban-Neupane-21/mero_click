/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Radio,
  Checkbox,
  Card,
  FormControlLabel,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import emailjs from "@emailjs/browser";

import { Clock, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { BookingDetails, StudioService } from "../types";
import { apiService } from "../utils/supabase";

interface BookingPortalProps {
  initialServiceId?: string;
  onBookingComplete?: (details: BookingDetails) => void;
}

export default function BookingPortal({
  initialServiceId,
  onBookingComplete,
}: BookingPortalProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const [services, setServices] = useState<StudioService[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<string>(
    initialServiceId || "",
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Wedding Specific Configurations
  const [weddingTier, setWeddingTier] = useState<
    "silver" | "golden" | "diamond"
  >("golden");
  const [weddingVenue, setWeddingVenue] = useState<string>("");

  const [studioAddons, setStudioAddons] = useState<
    { id: string; label: string; price: number; checked: boolean }[]
  >([
    {
      id: "add-makeup",
      label: "On-studio professional hair & makeup prep",
      price: 1500,
      checked: false,
    },
    {
      id: "add-expedited",
      label: "Priority expedited edit (Delivered within 3 hours)",
      price: 1000,
      checked: false,
    },
    {
      id: "add-prints",
      label: "Extra biometric physical prints block (12 photos)",
      price: 400,
      checked: false,
    },
  ]);

  const [weddingAddons, setWeddingAddons] = useState<
    { id: string; label: string; price: number; checked: boolean }[]
  >([
    {
      id: "add-wedding-drone",
      label: "Ultra 4K Aerial Drone Cinematic Coverage",
      price: 10000,
      checked: false,
    },
    {
      id: "add-wedding-album",
      label: "Luxury Handcrafted Teak Wood Physical Album",
      price: 6000,
      checked: false,
    },
    {
      id: "add-wedding-pre",
      label: "Pre-wedding Outdoor Couple Highlights Shoot",
      price: 15000,
      checked: false,
    },
    {
      id: "add-wedding-delivery",
      label: "Teaser Reel express editing within 48 Hours",
      price: 5000,
      checked: false,
    },
  ]);

  const steps = [
    "Select Service",
    "Pick Schedule",
    "Your Details",
    "Complete Appointment",
  ];

  const activeServiceObj =
    services.find((s) => s.id === selectedService) || services[0];
  const activeAddons =
    selectedService === "service-wedding-shoot" ? weddingAddons : studioAddons;

  // Real-time calculated base price matching tier and category
  let basePriceNum = 0;
  let resolvedBasePriceLabel = "";

  if (activeServiceObj) {
    basePriceNum = parseInt(
      activeServiceObj.basePrice.replace(/[^0-9]/g, ""),
      10,
    );
    resolvedBasePriceLabel = activeServiceObj.basePrice;
  }

  React.useEffect(() => {
    let active = true;
    apiService.getServices().then((data) => {
      if (active) {
        setServices(data);
        setLoading(false);
        if (data.length > 0) {
          if (
            !initialServiceId ||
            !data.find((s) => s.id === initialServiceId)
          ) {
            setSelectedService(data[0].id);
          } else {
            setSelectedService(initialServiceId);
          }
        }
      }
    });
    return () => {
      active = false;
    };
  }, [initialServiceId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress sx={{ color: "#E50914" }} />
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          backgroundColor: "background.default",
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          No services available at the moment.
        </Typography>
      </Box>
    );
  }

  if (selectedService === "service-wedding-shoot") {
    if (weddingTier === "silver") {
      basePriceNum = 25000;
      resolvedBasePriceLabel = "Rs. 25,000 (Silver Portrait Package)";
    } else if (weddingTier === "golden") {
      basePriceNum = 45000;
      resolvedBasePriceLabel = "Rs. 45,000 (Golden Royal Package)";
    } else if (weddingTier === "diamond") {
      basePriceNum = 85000;
      resolvedBasePriceLabel = "Rs. 85,000 (Diamond Majestic Cinematic)";
    }
  }

  const addonsPriceSum = activeAddons
    .filter((a) => a.checked)
    .reduce((sum, current) => sum + current.price, 0);
  const totalPrice = basePriceNum + addonsPriceSum;

  const handleNext = () => {
    if (activeStep === 2) {
      if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const toggleAddon = (index: number) => {
    if (selectedService === "service-wedding-shoot") {
      const updated = [...weddingAddons];
      updated[index].checked = !updated[index].checked;
      setWeddingAddons(updated);
    } else {
      const updated = [...studioAddons];
      updated[index].checked = !updated[index].checked;
      setStudioAddons(updated);
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    const finalDetails: BookingDetails = {
      serviceId: selectedService,
      packageName:
        selectedService === "service-wedding-shoot"
          ? `Wedding Photoshoot (${weddingTier.toUpperCase()} Package)`
          : activeServiceObj.title,
      date: selectedDate,
      clientName,
      clientEmail,
      clientPhone,
      notes:
        selectedService === "service-wedding-shoot"
          ? `[Venue: ${weddingVenue || "To be decided"}] ${notes}`
          : notes,
      addons: activeAddons.filter((a) => a.checked).map((a) => a.label),
      totalPrice,
    };

    try {
      await emailjs.send(
        "service_wt15ou7", // service id
        "template_sfe4x7z", //template id
        {
          client_name: clientName,
          client_email: clientEmail,
          to_email: clientEmail, // Often used in EmailJS templates for dynamic 'To' address
          // email: "studiomeroclick@gmail.com", // Another common variable name

          email: clientEmail,
          reply_to: clientEmail,
          client_phone: clientPhone,
          package_name: finalDetails.packageName,
          booking_date: new Date(selectedDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          venue:
            selectedService === "service-wedding-shoot"
              ? weddingVenue || "To be decided"
              : "N/A — In-studio session",
          addons:
            finalDetails.addons.length > 0
              ? finalDetails.addons.join(", ")
              : "None selected",
          total_price: totalPrice.toLocaleString(),
          notes: notes || "None provided",
        },
        "cDNJDxxr2a8Yz4PF8", //public key
      );

      if (onBookingComplete) {
        onBookingComplete(finalDetails);
      }
      handleNext();
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setSubmitError(
        "We couldn't notify the studio right now, but you can still try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="booking-portal-root"
    >
      <Container maxWidth="md" id="booking-container">
        {/* Header Title */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
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
              mb: 2,
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
                letterSpacing: "0.1em",
              }}
            >
              Real-time Reservation
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              mb: 1,
              color: "text.primary",
            }}
          >
            Book Your Studio Session
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              maxWidth: "520px",
              mx: "auto",
              fontWeight: 300,
            }}
          >
            Reserve your photography slot instantly. Walk out with gorgeous,
            professional digital exports and high-quality printed layouts.
          </Typography>
        </Box>

        {/* Dynamic Booking Card Wrapper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            border: "1px solid",
            borderColor: isDark
              ? "rgba(229, 9, 20, 0.15)"
              : "rgba(229, 9, 20, 0.08)",
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRadius: "8px",
            transition: "background-color 0.3s, border-color 0.3s",
          }}
          id="booking-panel"
        >
          {/* Progress Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ mb: 5 }}
            id="booking-stepper"
          >
            {steps.map((label) => (
              <Step
                key={label}
                sx={{
                  "& .MuiStepIcon-root": {
                    color: isDark ? "#222222" : "#e2e8f0",
                  },
                  "& .MuiStepIcon-root.Mui-active": { color: "#E50914" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "#22c55e" },
                }}
              >
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      "&.Mui-active": { color: "text.primary" },
                      "&.Mui-completed": { color: "#22c55e" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Stepper Case Screens */}
          {activeStep === 0 && (
            <Box id="booking-step-service">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                  color: "#ffffff",
                }}
              >
                1. Select Desired Service Category
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {services.map((serv) => {
                  const isChosen = selectedService === serv.id;
                  return (
                    <Card
                      key={serv.id}
                      onClick={() => setSelectedService(serv.id)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isChosen
                          ? "rgba(229, 9, 20, 0.03)"
                          : "#111111",
                        border: isChosen
                          ? "2px solid #E50914"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        transition: "all 0.2s",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: isChosen
                            ? "rgba(229, 9, 20, 0.05)"
                            : "rgba(255, 255, 255, 0.02)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "4px",
                          overflow: "hidden",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={serv.imageUrl}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            lineHeight: 1.25,
                            mb: 0.5,
                            color: "#ffffff",
                          }}
                        >
                          {serv.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#ff4d4d",
                            fontWeight: 700,
                            display: "block",
                          }}
                        >
                          {serv.basePrice}
                        </Typography>
                      </Box>
                      <Radio
                        checked={isChosen}
                        value={serv.id}
                        name="service-radio"
                        sx={{
                          color: "rgba(255,255,255,0.2)",
                          "&.Mui-checked": { color: "#E50914" },
                        }}
                      />
                    </Card>
                  );
                })}
              </div>

              {/* Wedding Photoshoot Specific Custom Selection (Package Tier and Venue Location Input) */}
              {selectedService === "service-wedding-shoot" && (
                <Box
                  sx={{
                    mt: 4,
                    mb: 4,
                    p: 3,
                    backgroundColor: "rgba(229, 9, 20, 0.02)",
                    border: "1px solid rgba(229, 9, 20, 0.12)",
                    borderRadius: "6px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      color: "#ffffff",
                      mb: 2,
                    }}
                  >
                    💎 Custom Wedding Photoshoot Package Configuration
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Silver Package selector */}
                    <Paper
                      onClick={() => setWeddingTier("silver")}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        backgroundColor:
                          weddingTier === "silver"
                            ? "rgba(229,9,20,0.06)"
                            : "#111111",
                        border:
                          weddingTier === "silver"
                            ? "2px solid #E50914"
                            : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 0.5, color: "#ffffff" }}
                      >
                        Silver Portrait
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#E50914",
                          fontSize: "1rem",
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Rs. 25,000
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#cbd5e1",
                          display: "block",
                          lineHeight: 1.3,
                        }}
                      >
                        4 Hours | 1 Lead Photographer | 50 Retouched Photos
                      </Typography>
                    </Paper>

                    {/* Golden Package selector (Standard) */}
                    <Paper
                      onClick={() => setWeddingTier("golden")}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        backgroundColor:
                          weddingTier === "golden"
                            ? "rgba(229,9,20,0.06)"
                            : "#111111",
                        border:
                          weddingTier === "golden"
                            ? "2px solid #E50914"
                            : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 0.5, color: "#ffffff" }}
                      >
                        Golden Royal
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#E50914",
                          fontSize: "1rem",
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Rs. 45,000
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#cbd5e1",
                          display: "block",
                          lineHeight: 1.3,
                        }}
                      >
                        Full Day | 2 Crew Members | Drone Coverage | Cinematic
                        Film
                      </Typography>
                    </Paper>

                    {/* Diamond Package selector */}
                    <Paper
                      onClick={() => setWeddingTier("diamond")}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        backgroundColor:
                          weddingTier === "diamond"
                            ? "rgba(229,9,20,0.06)"
                            : "#111111",
                        border:
                          weddingTier === "diamond"
                            ? "2px solid #E50914"
                            : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 0.5, color: "#ffffff" }}
                      >
                        Diamond Majestic
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#E50914",
                          fontSize: "1rem",
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Rs. 85,000
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#cbd5e1",
                          display: "block",
                          lineHeight: 1.3,
                        }}
                      >
                        Full Day + Pre-Shoot | 3 Crew | Gold-Trim Teak Album |
                        4K Cinema Movie
                      </Typography>
                    </Paper>
                  </div>

                  {/* Auspicious Venue location field */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "#ffffff",
                      display: "block",
                    }}
                  >
                    Auspicious Wedding Venue / Location Details:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={weddingVenue}
                    onChange={(e) => setWeddingVenue(e.target.value)}
                    placeholder="E.g. Amrapali Banquet, Lalitpur or specific address in Kathmandu"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#111111",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                    }}
                  />
                </Box>
              )}

              {/* Addons Selection Block */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    mb: 2,
                    color: "#ffffff",
                  }}
                >
                  Optional{" "}
                  {selectedService === "service-wedding-shoot"
                    ? "Wedding"
                    : "Studio"}{" "}
                  Add-ons (Select if desired):
                </Typography>
                <div className="grid grid-cols-1 gap-3">
                  {activeAddons.map((option, idx) => (
                    <Paper
                      key={option.id}
                      variant="outlined"
                      onClick={() => toggleAddon(idx)}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        borderColor: option.checked
                          ? "#E50914"
                          : "rgba(255,255,255,0.05)",
                        backgroundColor: option.checked
                          ? "rgba(229, 9, 20, 0.04)"
                          : "#111111",
                        borderRadius: "4px",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={option.checked}
                            sx={{
                              color: "rgba(255,255,255,0.2)",
                              "&.Mui-checked": { color: "#E50914" },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                color: "#e5e7eb",
                              }}
                            >
                              {option.label}
                            </Typography>
                          </Box>
                        }
                        sx={{ pointerEvents: "none", margin: 0 }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: option.checked ? "#ff4d4d" : "#9ca3af",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        + Rs. {option.price.toLocaleString()}
                      </Typography>
                    </Paper>
                  ))}
                </div>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#E50914", color: "#ffffff" },
                    px: 4,
                    py: 1,
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box id="booking-step-schedule">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                  color: "#ffffff",
                }}
              >
                2. Select Date & Time Slot
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar Input picker */}
                <div>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 1, color: "#ffffff" }}
                  >
                    Select Date:
                  </Typography>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={
                      new Date(Date.now() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full px-3 py-2.5 bg-[#111111] border border-zinc-800 rounded focus:outline-none focus:border-[#E50914] text-sm text-white"
                  />
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#111111",
                      borderRadius: "4px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#E50914",
                        fontWeight: 600,
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <MapPin size={12} /> Kathmandu Main Branch
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#a3a3a3",
                        display: "block",
                        lineHeight: 1.4,
                      }}
                    >
                      Appointments booked online are automatically verified.
                      Please arrive 10 minutes before your scheduled slot.
                    </Typography>
                  </Box>
                </div>
              </div>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}
              >
                <Button
                  variant="text"
                  onClick={handleBack}
                  sx={{
                    color: "#9ca3af",
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#E50914", color: "#ffffff" },
                    px: 4,
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box id="booking-step-details">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                  color: "#ffffff",
                }}
              >
                3. Your Registration Information
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your first and last name"
                    id="booking-form-name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                      "& .MuiInputLabel-root": { color: "#8a8a8f" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#E50914" },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    id="booking-form-email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                      "& .MuiInputLabel-root": { color: "#8a8a8f" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#E50914" },
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    fullWidth
                    type="tel"
                    label="Phone Number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 98XXXXXXXX (Nepal Mobile)"
                    id="booking-form-phone"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                      "& .MuiInputLabel-root": { color: "#8a8a8f" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#E50914" },
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Posing Requirements or Notes (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. I need soft background matching ERAS standards, we are bringing white coats, or I have a strict visa specification deadline."
                    id="booking-form-notes"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                      "& .MuiInputLabel-root": { color: "#8a8a8f" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#E50914" },
                    }}
                  />
                </div>
              </div>

              {/* Order total info line */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "#111111",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "6px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#ffffff", mb: 1 }}
                >
                  Booking Summary Preview
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                    Service:{" "}
                    {selectedService === "service-wedding-shoot"
                      ? `Wedding Photoshoot (${weddingTier.toUpperCase()})`
                      : activeServiceObj.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#ffffff" }}
                  >
                    {selectedService === "service-wedding-shoot"
                      ? resolvedBasePriceLabel.split(" (")[0]
                      : activeServiceObj.basePrice}
                  </Typography>
                </Box>
                {selectedService === "service-wedding-shoot" &&
                  weddingVenue && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                        Venue Location:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#ff4d4d" }}
                      >
                        {weddingVenue}
                      </Typography>
                    </Box>
                  )}
                {activeAddons.filter((a) => a.checked).length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#9ca3af", display: "block" }}
                    >
                      Add-ons:
                    </Typography>
                    {activeAddons
                      .filter((a) => a.checked)
                      .map((a) => (
                        <Box
                          key={a.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            pl: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#a3a3a3" }}
                          >
                            • {a.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 500, color: "#ffffff" }}
                          >
                            + Rs. {a.price.toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                )}
                <Divider
                  sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.05)" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#ffffff" }}
                  >
                    Total Final Price
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#E50914" }}
                  >
                    Rs. {totalPrice.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}
              >
                <Button
                  variant="text"
                  onClick={handleBack}
                  sx={{
                    color: "#9ca3af",
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  Back
                </Button>
                {submitError && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ff4d4d",
                      display: "block",
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    {submitError}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting}
                  id="final-booking-submit-btn"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#E50914", color: "#ffffff" },
                    px: 4,
                  }}
                >
                  {isSubmitting ? "Sending..." : "Reserve Session"}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 3 && (
            <Box sx={{ textAlign: "center", py: 4 }} id="booking-step-success">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <CheckCircle2 size={40} className="text-[#22c55e]" />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  mb: 1,
                  color: "#ffffff",
                }}
              >
                Booking Successfully Made!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#a3a3a3",
                  maxWidth: "440px",
                  mx: "auto",
                  mb: 4,
                  fontWeight: 300,
                  fontSize: "0.95rem",
                }}
              >
                Thank you,{" "}
                <strong className="font-semibold text-white">
                  {clientName}
                </strong>
                . Your photography appointment has been recorded at Kathmandu
                branch.
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  maxWidth: "480px",
                  mx: "auto",
                  textAlign: "left",
                  mb: 4,
                  backgroundColor: "#111111",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                }}
              >
                <div className="grid grid-cols-12 gap-y-3 gap-x-4">
                  <div className="col-span-5">
                    <Typography
                      variant="caption"
                      sx={{ color: "#8a8a8f", display: "block" }}
                    >
                      Reference Code:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "#ffffff",
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      PSS-{100000 + Math.floor(Math.random() * 900000)}
                    </Typography>
                  </div>
                  <div className="col-span-7">
                    <Typography
                      variant="caption"
                      sx={{ color: "#8a8a8f", display: "block" }}
                    >
                      Studio Session:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#ff4d4d" }}
                    >
                      {activeServiceObj.title}
                    </Typography>
                  </div>
                  <div className="col-span-5">
                    <Typography
                      variant="caption"
                      sx={{ color: "#8a8a8f", display: "block" }}
                    >
                      Scheduled Date:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#ffffff" }}
                    >
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </div>
                  <div className="col-span-12">
                    <Typography
                      variant="caption"
                      sx={{ color: "#8a8a8f", display: "block" }}
                    >
                      Kathmandu Address:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        color: "#ffffff",
                      }}
                    >
                      <MapPin size={14} className="text-[#E50914]" />
                      Rudramati Chowk Anamnagar
                    </Typography>
                  </div>
                </div>
              </Paper>

              <Typography
                variant="caption"
                sx={{ color: "#9ca3af", display: "block", mb: 4 }}
              >
                Thank you for reserving your slot. See you soon!
              </Typography>

              <Button
                variant="outlined"
                onClick={() => {
                  setActiveStep(0);
                  setClientName("");
                  setClientEmail("");
                  setClientPhone("");
                  setNotes("");
                }}
                id="reset-booking-portal-btn"
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#E50914",
                    backgroundColor: "rgba(229, 9, 20, 0.05)",
                    color: "#ff4d4d",
                  },
                }}
              >
                Book Another Appointment
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
