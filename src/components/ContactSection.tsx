/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  IconButton,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
} from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 5000);
    }
  };

  const mapCoordinates = "27.6915° N, 85.3422° E";

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s, color 0.3s",
      }}
      id="contact-root"
    >
      <Container maxWidth="xl" id="contact-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Branch Contact Details */}
          <div className="md:col-span-5">
            <Box sx={{ mb: 4 }}>
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
                <MapPin size={14} className="text-[#E50914]" />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: "#ff4d4d",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1rem",
                  }}
                >
                  Locate Our Studio
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  mb: 1.5,
                  color: "text.primary",
                }}
              >
                Get In Touch With Us
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  lineHeight: 1.5,
                  maxWidth: "420px",
                }}
              >
                Have custom dimensions required or need corporate booking rates?
                Contact us or drop by our studio in Central Kathmandu.
              </Typography>
            </Box>

            {/* Quick Details Cards stack */}
            <Stack spacing={3} sx={{ mb: 4 }} id="contact-details-stack">
              {/* Address card */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "rgba(229, 9, 20, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E50914",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    Our Address
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 300,
                      mt: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    Rudramati Pul <br />
                  </Typography>
                </Box>
              </Box>

              {/* Time opening card */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "rgba(229, 9, 20, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E50914",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    Studio Business Hours
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 300,
                      mt: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    Sunday – Friday: 10:00 AM – 6:30 PM <br />
                    Saturday: Closed (Pre-booked events only)
                  </Typography>
                </Box>
              </Box>

              {/* Contact numbers card */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "rgba(229, 9, 20, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E50914",
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    Phone Contacts
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 300,
                      mt: 0.5,
                      lineHeight: 1.4,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Cell / WhatsApp: +977-982336742
                  </Typography>
                </Box>
              </Box>

              {/* Email contact */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    backgroundColor: "rgba(229, 9, 20, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E50914",
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    Email Inquiries
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 300,
                      mt: 0.5,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    studiomeroclick@gmail.com{" "}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </div>

          {/* Right Interactive Messaging Form / Map representation */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-6">
              {/* Form card */}
              <div>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    transition: "background-color 0.3s, border-color 0.3s",
                  }}
                  id="contact-form-panel"
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      mb: 3,
                      color: "text.primary",
                    }}
                  >
                    Send Us an Instant Inquiry
                  </Typography>

                  {isSubmitted ? (
                    <Alert
                      severity="success"
                      icon={<CheckCircle2 size={18} />}
                      sx={{
                        backgroundColor: "rgba(34, 197, 94, 0.08)",
                        color: "#22c55e",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        mb: 1,
                        ".MuiAlert-icon": { color: "#22c55e" },
                      }}
                    >
                      Your message has been received! Our studio managers will
                      get back to you within 2-3 working hours.
                    </Alert>
                  ) : (
                    <form onSubmit={handleSubmit} id="contact-inquiry-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <TextField
                            required
                            fullWidth
                            label="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "text.primary",
                                "& fieldset": {
                                  borderColor: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.1)",
                                },
                                "&:hover fieldset": { borderColor: "#E50914" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#E50914",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "text.secondary",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#E50914",
                              },
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            required
                            fullWidth
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "text.primary",
                                "& fieldset": {
                                  borderColor: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.1)",
                                },
                                "&:hover fieldset": { borderColor: "#E50914" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#E50914",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "text.secondary",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#E50914",
                              },
                            }}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Write your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "text.primary",
                                "& fieldset": {
                                  borderColor: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.1)",
                                },
                                "&:hover fieldset": { borderColor: "#E50914" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#E50914",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "text.secondary",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#E50914",
                              },
                            }}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Button
                            type="submit"
                            variant="contained"
                            endIcon={<Send size={14} />}
                            id="submit-contact-form-btn"
                            sx={{
                              backgroundColor: isDark ? "#ffffff" : "#0f172a",
                              color: isDark ? "#000000" : "#ffffff",
                              fontFamily: '"Space Grotesk", sans-serif',
                              textTransform: "none",
                              px: 3.5,
                              py: 1.25,
                              fontWeight: 600,
                              borderRadius: "4px",
                              "&:hover": {
                                backgroundColor: "#E50914",
                                color: "#ffffff",
                              },
                            }}
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </Paper>
              </div>

              {/* Map mockup card */}
              <div>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 3,
                    transition: "background-color 0.3s, border-color 0.3s",
                  }}
                  id="contact-map-mockup"
                >
                  {/* Decorative Map graphic */}
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 110 },
                      height: 110,
                      borderRadius: "6px",
                      backgroundColor: isDark ? "#111111" : "#f8fafc",
                      border: "1px solid",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {/* Simulated abstract maps grid */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "15%",
                        left: 0,
                        right: 0,
                        height: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "45%",
                        left: 0,
                        right: 0,
                        height: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "75%",
                        left: 0,
                        right: 0,
                        height: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        left: "15%",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        left: "80%",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                      }}
                    />

                    {/* Coordinates Gold pin */}
                    <MapPin
                      size={24}
                      className="text-[#E50914] relative z-2 animate-bounce"
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.55rem",
                        color: "text.secondary",
                        mt: 0.5,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Rudramati Pul
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "#E50914", mb: 0.5 }}
                    >
                      Interactive Satellite Nav Map
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 2,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Latitude/Longitude: {mapCoordinates}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        window.open(
                          "https://maps.app.goo.gl/sswkczFkdBhMqDkR9",
                          "_blank",
                        )
                      }
                      id="external-maps-btn"
                      sx={{
                        color: "text.primary",
                        borderColor: isDark
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.15)",
                        textTransform: "none",
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: "0.75rem",
                        "&:hover": {
                          borderColor: "#E50914",
                          color: "#ff4d4d",
                          backgroundColor: "rgba(229,9,20,0.05)",
                        },
                      }}
                      startIcon={<Navigation size={12} />}
                    >
                      Pinpoint Direction
                    </Button>
                  </Box>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}
