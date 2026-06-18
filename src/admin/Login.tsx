/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Eye, EyeOff, Lock, Mail, Camera, ShieldAlert } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth validation
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          onLoginSuccess(data.session.user.email || email);
        }
      } else {
        // Graceful Client-only Demo Sandbox log-in bypass
        // Enables immediate, painless preview verification!
        if (email === "admin@studio.com" && password === "admin123") {
          onLoginSuccess(email);
        } else {
          setErrorMsg(
            "Invalid Credentials. Since Supabase environment variables are not live, use: admin@studio.com with password: admin123 to log in.",
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        background:
          "radial-gradient(circle at center, rgb(15, 15, 20) 0%, rgb(3, 3, 5) 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "rgba(20, 20, 25, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(229, 9, 20, 0.25)",
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          mx: 2,
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(229, 9, 20, 0.1)",
                border: "1px solid rgba(229, 9, 20, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Camera size={28} className="text-[#E50914]" />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                color: "#ffffff",
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Kathmandu Studio Admin
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.5)", mt: 0.5 }}
            >
              Enter secure credentials to manage showcase files
            </Typography>
          </Box>

          {!isSupabaseConfigured && (
            <Alert
              severity="info"
              icon={<ShieldAlert size={18} />}
              sx={{
                mb: 3,
                backgroundColor: "rgba(229, 9, 20, 0.08)",
                color: "#ff8a80",
                border: "1px solid rgba(229, 9, 20, 0.2)",
                fontSize: "0.78rem",
                "& .MuiAlert-icon": { color: "#E50914" },
              }}
            >
              Supabase environment variables not connected. Using local security
              sandbox! Log in with: <strong>admin@studio.com</strong> /{" "}
              <strong>admin123</strong>
            </Alert>
          )}

          {errorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: "6px", fontSize: "0.8rem" }}
            >
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={16} className="text-gray-400" />
                    </InputAdornment>
                  ),
                  style: {
                    color: "#ffffff",
                    height: "52px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  },
                },
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                  "&:hover fieldset": { borderColor: "rgba(229, 9, 20, 0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#E50914" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                inputLabel: {
                  style: {
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: '"Space Grotesk"',
                  },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    color: "#ffffff",
                    height: "52px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  },
                },
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                  "&:hover fieldset": { borderColor: "rgba(229, 9, 20, 0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#E50914" },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: "50px",
                background: "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                borderRadius: "8px",
                color: "#ffffff",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
                },
                "&.Mui-disabled": {
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Acknowledge & Sign In"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
