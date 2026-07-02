/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import {
  Ticket,
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Copy,
  Clock,
  ChevronRight,
  Gift,
} from "lucide-react";
import { apiService } from "../utils/supabase";
import emailjs from "@emailjs/browser";
import { OfferAd } from "../types";

export default function ClaimOffer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferAd[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferAd | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");

  // Submission State
  const [claimCode, setClaimCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOffersAndSetDefault = async () => {
      try {
        const data = await apiService.getOffers();
        setOffers(data);

        // Check if there's an offer ID passed in query string or state
        const params = new URLSearchParams(location.search);
        const queryOfferId = params.get("offerId") || params.get("id");

        if (queryOfferId && data.length > 0) {
          const matched = data.find((o) => o.id === queryOfferId);
          if (matched) {
            setSelectedOffer(matched);
          } else {
            setSelectedOffer(data[0]);
          }
        } else if (data.length > 0) {
          setSelectedOffer(data[0]);
        }
      } catch (err) {
        console.error("Error loading offers in Claim Page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndSetDefault();
  }, [location]);

  const handleOfferChange = (offerId: string) => {
    const matched = offers.find((o) => o.id === offerId);
    if (matched) {
      setSelectedOffer(matched);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    setSubmitting(true);

    // Generate claim code
    setTimeout(() => {
      const code = `KTM-${selectedOffer.targetCategory.toUpperCase().substring(0, 3)}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

      // Store claim in local storage for persistence
      try {
        const storedClaims =
          localStorage.getItem("kathmandu_studio_claims") || "[]";
        const claims = JSON.parse(storedClaims);
        claims.push({
          code,
          offerId: selectedOffer.id,
          offerTitle: selectedOffer.title,
          discount: selectedOffer.discount,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          preferredDate,
          notes,
          claimedAt: new Date().toLocaleDateString("en-US"),
        });
        localStorage.setItem("kathmandu_studio_claims", JSON.stringify(claims));
      } catch (e) {
        console.error("Error saving claim locally:", e);
      }

      // Send email to admin
      emailjs
        .send(
          "service_nsrguph", // Your EmailJS Service ID
          "template_5vabe8", // Your EmailJS Template ID for offer claims
          {
            client_name: name,
            client_email: email,
            client_phone: phone,
            package_name: `${selectedOffer.title} (${selectedOffer.discount})`,
            booking_date: new Date(preferredDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            notes: `[Offer Claim] ${notes || "No special requests."}`,
            claim_code: code, // Pass the claim code to the template
            to_email: "neupanejiban73@gmail.com", // Admin's email
            reply_to: "neupanejiban73@gmail.com",
          },
          "cDNJDxxr2a8Yz4PF8", // Your EmailJS Public Key
        )
        .catch((err) =>
          console.error("Failed to send admin notification email:", err),
        );

      setClaimCode(code);
      setSubmitting(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    if (claimCode) {
      navigator.clipboard.writeText(claimCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 12,
          minHeight: "60vh",
          backgroundColor: "#09090b",
          color: "#ffffff",
        }}
      >
        <CircularProgress sx={{ color: "#E50914", mb: 2 }} />
        <Typography
          variant="body1"
          sx={{ fontFamily: '"Space Grotesk"', color: "rgba(255,255,255,0.6)" }}
        >
          Loading premium studio offers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        minHeight: "90vh",
        backgroundColor: "#09090b",
        color: "#ffffff",
      }}
    >
      <Container maxWidth="lg" id="claim-offer-page">
        {/* Back navigation */}
        <Button
          onClick={() => navigate("/")}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            color: "rgba(255,255,255,0.6)",
            mb: 4,
            textTransform: "none",
            fontFamily: '"Space Grotesk", sans-serif',
            "&:hover": { color: "#E50914", backgroundColor: "transparent" },
          }}
        >
          Back to Home
        </Button>

        {claimCode ? (
          /* ================================= SUCCESS VIEW ================================= */
          <Box sx={{ maxWidth: "650px", mx: "auto", textAlign: "center" }}>
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                backgroundColor: "#121214",
                border: "1px solid rgba(229, 9, 20, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(229, 9, 20, 0.1)",
                color: "#ffffff",
              }}
              id="success-claim-card"
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    backgroundColor: "rgba(229, 9, 20, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #E50914",
                  }}
                >
                  <CheckCircle size={36} className="text-[#E50914]" />
                </Box>
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
                Offer Claimed Successfully!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  maxWidth: "500px",
                  mx: "auto",
                  mb: 4,
                  fontWeight: 300,
                }}
              >
                Thank you, <strong>{name}</strong>! Your discount voucher code
                has been locked in. Bring or mention this code when you visit us
                in Kathmandu Rudramti Chowk Anamnagar.
              </Typography>

              {/* Offer visual snippet */}
              {selectedOffer && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    p: 2.5,
                    mb: 4,
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: selectedOffer.accentColor,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {selectedOffer.discount}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mt: 0.5 }}
                  >
                    {selectedOffer.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.82rem",
                      mt: 0.5,
                    }}
                  >
                    {selectedOffer.description}
                  </Typography>
                </Box>
              )}

              {/* Claim Voucher Box */}
              <Box
                sx={{
                  backgroundColor: "#1c1917",
                  border: "2px dashed rgba(229, 9, 20, 0.5)",
                  borderRadius: "10px",
                  p: 3,
                  mb: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    mb: 1,
                  }}
                >
                  YOUR VOUCHER CLAIM CODE
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Space Grotesk", monospace',
                    fontWeight: 800,
                    color: "#E50914",
                    letterSpacing: "0.05em",
                    fontSize: { xs: "1.8rem", sm: "2.5rem" },
                    mb: 2,
                  }}
                >
                  {claimCode}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCopyCode}
                  startIcon={<Copy size={14} />}
                  sx={{
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.15)",
                    textTransform: "none",
                    fontSize: "0.8rem",
                    "&:hover": {
                      borderColor: "#E50914",
                      backgroundColor: "rgba(229, 9, 20, 0.05)",
                    },
                  }}
                >
                  {copied ? "Copied to Clipboard!" : "Copy Claim Code"}
                </Button>
              </Box>

              {/* Instructions list */}
              <Box sx={{ textAlign: "left", mb: 4, px: { md: 2 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1.5, color: "#ffffff" }}
                >
                  💡 What's next?
                </Typography>
                <ul className="space-y-2 text-sm text-zinc-400 font-light list-disc list-inside">
                  <li>
                    Show this code on your phone to our Studio at Rudramati
                    Chowk Anamnagar, Kathmandu.
                  </li>
                  <li>
                    Our studio lead will apply the flat discount directly to
                    your final bill amount.
                  </li>
                  <li>
                    No payment required right now — claim is 100% free to lock
                    in.
                  </li>
                  <li>
                    Voucher code is valid until the listed date. Walk-ins are
                    daily!
                  </li>
                </ul>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    navigate(`/book?serviceId=${selectedOffer?.targetCategory}`)
                  }
                  sx={{
                    backgroundColor: "#E50914",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontFamily: '"Space Grotesk"',
                    "&:hover": { backgroundColor: "#b91c1c" },
                  }}
                >
                  Book Studio Session Now
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.15)",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#E50914",
                      backgroundColor: "rgba(229, 9, 20, 0.05)",
                    },
                  }}
                >
                  Return to Home
                </Button>
              </Box>
            </Paper>
          </Box>
        ) : (
          /* ================================= MAIN FORM VIEW ================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Selector and Form */}
            <div className="lg:col-span-7">
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#E50914",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    fontFamily: '"Space Grotesk"',
                  }}
                >
                  EXCLUSIVE DISCOUNTS
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    mb: 2,
                    color: "#ffffff",
                  }}
                >
                  Claim Your Studio Voucher
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 300 }}
                >
                  Select an active Kathmandu Studio offer below and fill out
                  your name and contact details to lock in your discount. No
                  upfront billing or card detail required!
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handleClaimSubmit}
                className="space-y-6"
              >
                {/* Offer Dropdown Selector */}
                <TextField
                  select
                  fullWidth
                  label="Select Studio Special Offer"
                  value={selectedOffer?.id || ""}
                  onChange={(e) => handleOfferChange(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      style: {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontFamily: '"Space Grotesk"',
                      },
                    },
                    input: { style: { color: "#ffffff" } },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": { borderColor: "#E50914" },
                      "&.Mui-focused fieldset": { borderColor: "#E50914" },
                    },
                  }}
                >
                  {offers.map((o) => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.discount} — {o.title}
                    </MenuItem>
                  ))}
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    required
                    label="Your Name"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        style: {
                          color: "rgba(255, 255, 255, 0.6)",
                          fontFamily: '"Space Grotesk"',
                        },
                      },
                      input: {
                        style: { color: "#ffffff" },
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={16} className="text-zinc-500" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email Address"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        style: {
                          color: "rgba(255, 255, 255, 0.6)",
                          fontFamily: '"Space Grotesk"',
                        },
                      },
                      input: {
                        style: { color: "#ffffff" },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} className="text-zinc-500" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    placeholder="e.g. 9801000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        style: {
                          color: "rgba(255, 255, 255, 0.6)",
                          fontFamily: '"Space Grotesk"',
                        },
                      },
                      input: {
                        style: { color: "#ffffff" },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={16} className="text-zinc-500" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Preferred Session Date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                        style: {
                          color: "rgba(255, 255, 255, 0.6)",
                          fontFamily: '"Space Grotesk"',
                        },
                      },
                      input: {
                        style: { color: "#ffffff" },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Calendar size={16} className="text-zinc-500" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.12)",
                        },
                        "&:hover fieldset": { borderColor: "#E50914" },
                        "&.Mui-focused fieldset": { borderColor: "#E50914" },
                      },
                    }}
                  />
                </div>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Special Requests / Message (Optional)"
                  placeholder="Tell us if you have any customization requests or specific preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      style: {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontFamily: '"Space Grotesk"',
                      },
                    },
                    input: { style: { color: "#ffffff" } },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": { borderColor: "#E50914" },
                      "&.Mui-focused fieldset": { borderColor: "#E50914" },
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    background:
                      "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    py: 1.75,
                    borderRadius: "4px",
                    boxShadow: "0 4px 20px rgba(229, 9, 20, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
                      boxShadow: "0 6px 24px rgba(229, 9, 20, 0.4)",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "rgba(229, 9, 20, 0.3)",
                      color: "rgba(255, 255, 255, 0.4)",
                    },
                  }}
                >
                  {submitting ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: "#ffffff" }} />
                      <span>Generating voucher code...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Ticket size={18} />
                      <span>Claim Free Discount Voucher</span>
                    </Box>
                  )}
                </Button>
              </Box>
            </div>

            {/* Right side: Selected Offer Detail Display Card */}
            <div className="lg:col-span-5">
              {selectedOffer && (
                <Card
                  sx={{
                    backgroundColor: "#121214",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  id="preview-claim-offer-card"
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: "240px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={selectedOffer.image}
                      alt={selectedOffer.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, #121214 0%, rgba(18,18,20,0.4) 65%, rgba(18,18,20,0) 100%)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        backgroundColor: "#E50914",
                        color: "#ffffff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk"',
                        letterSpacing: "0.1em",
                      }}
                    >
                      {selectedOffer.badge}
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 4, pt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Gift
                        size={16}
                        style={{ color: selectedOffer.accentColor }}
                      />
                      <Typography
                        variant="overline"
                        sx={{
                          color: selectedOffer.accentColor,
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          fontFamily: '"Space Grotesk"',
                        }}
                      >
                        {selectedOffer.discount}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 700,
                        mb: 2,
                        color: "#ffffff",
                      }}
                    >
                      {selectedOffer.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        mb: 3,
                      }}
                    >
                      {selectedOffer.description}
                    </Typography>

                    <Divider
                      sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 3 }}
                    />

                    <div className="space-y-3">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Clock size={16} className="text-zinc-500" />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.85rem",
                          }}
                        >
                          <strong>Offer Validity:</strong>{" "}
                          {selectedOffer.validUntil}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Sparkles size={16} className="text-[#E50914]" />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.85rem",
                          }}
                        >
                          <strong>Category:</strong>{" "}
                          {selectedOffer.targetCategory} Studio Specialties
                        </Typography>
                      </Box>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </Container>
    </Box>
  );
}
