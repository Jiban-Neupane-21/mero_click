/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  LogOut,
  PlusCircle,
  Trash2,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  Eye,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { apiService, isSupabaseConfigured } from "../utils/supabase";
import { PortfolioItem, VideoItem } from "../types";

interface AdminPanelProps {
  userEmail: string;
  onLogout: () => void;
  onDataChange?: () => void; // Call whenever database content is modified
}

export default function AdminPanel({
  userEmail,
  onLogout,
  onDataChange,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Forms logic
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    category: "Wedding",
    imageUrl: "",
    specLabel: "",
    author: "",
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    youtubeUrlOrId: "",
    category: "Cinematography",
    duration: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Load all items
  const loadDatabaseItems = async () => {
    setLoading(true);
    try {
      const fetchedPortfolios = await apiService.getPortfolioItems();
      const fetchedVideos = await apiService.getVideoItems();
      setPortfolios(fetchedPortfolios);
      setVideos(fetchedVideos);
    } catch (err: any) {
      console.error("Error fetching admin dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseItems();
  }, []);

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  // Portfolio items actions
  const handlePortfolioFormChange = (prop: string, val: string) => {
    setPortfolioForm((prev) => ({ ...prev, [prop]: val }));
  };

  // Image Upload helper: reads files and turns them into base64 URLs immediately
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadProgress(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioForm((p) => ({ ...p, imageUrl: reader.result as string }));
        setUploadProgress(false);
        triggerAlert(
          "success",
          `Image "${file.name}" loaded and processed locally! Ready to insert.`,
        );
      };
      reader.onerror = () => {
        setUploadProgress(false);
        triggerAlert("error", "Error reading uploaded file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title || !portfolioForm.imageUrl) {
      triggerAlert(
        "error",
        "Please provide a title and select/upload an image.",
      );
      return;
    }

    try {
      await apiService.savePortfolioItem({
        title: portfolioForm.title,
        category: portfolioForm.category as any,
        imageUrl: portfolioForm.imageUrl,
        specLabel: portfolioForm.specLabel || undefined,
        author: portfolioForm.author || undefined,
      });

      triggerAlert(
        "success",
        "Successfully added new portfolio artwork record!",
      );
      setIsPortfolioModalOpen(false);
      setImageFile(null);
      setPortfolioForm({
        title: "",
        category: "Wedding",
        imageUrl: "",
        specLabel: "",
        author: "",
      });
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      triggerAlert("error", err.message || "Error inserting photo record.");
    }
  };

  const handleDeletePortfolio = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}" from the portfolio?`,
      )
    ) {
      try {
        await apiService.deletePortfolioItem(id);
        triggerAlert("success", `Deleted "${name}" successfully.`);
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting item.");
      }
    }
  };

  // Video items actions
  const handleVideoFormChange = (prop: string, val: string) => {
    setVideoForm((prev) => ({ ...prev, [prop]: val }));
  };

  // Intelligent filter: extracts 11-char YouTube ID from any full link
  const extractYoutubeId = (urlOrId: string): string => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return match && match[2].length === 11 ? match[2] : urlOrId.trim();
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeUrlOrId) {
      triggerAlert(
        "error",
        "Please enter a video title and YouTube URL or ID.",
      );
      return;
    }

    const youtubeId = extractYoutubeId(videoForm.youtubeUrlOrId);
    if (youtubeId.length !== 11) {
      triggerAlert(
        "error",
        "Unable to parse standard YouTube video ID. Ensure link is correct.",
      );
      return;
    }

    try {
      await apiService.saveVideoItem({
        title: videoForm.title,
        youtubeId: youtubeId,
        category: videoForm.category as any,
        duration: videoForm.duration || "3:30",
        description: videoForm.description,
        uploadDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });

      triggerAlert(
        "success",
        "Successfully logged new cinematic motion video!",
      );
      setIsVideoModalOpen(false);
      setVideoForm({
        title: "",
        youtubeUrlOrId: "",
        category: "Cinematography",
        duration: "",
        description: "",
      });
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      triggerAlert("error", err.message || "Error saving video.");
    }
  };

  const handleDeleteVideo = async (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete the video "${name}"?`)
    ) {
      try {
        await apiService.deleteVideoItem(id);
        triggerAlert("success", `Deleted film video "${name}" successfully.`);
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting video reference.");
      }
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: "#09090b",
        minHeight: "90vh",
        color: "#ffffff",
      }}
    >
      <Container maxWidth="xl">
        {/* Custom Header Layout */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <KeyRound size={16} className="text-[#E50914]" />
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                }}
              >
                MANAGEMENT PLATFORM
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Kathmandu Studio Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
              Logged in as:{" "}
              <span className="font-semibold text-red-400">{userEmail}</span>
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={onLogout}
            startIcon={<LogOut size={16} />}
            sx={{
              color: "#f43f5e",
              fontFamily: '"Space Grotesk", sans-serif',
              textTransform: "none",
              borderColor: "rgba(244, 63, 94, 0.3)",
              borderRadius: "6px",
              px: 3,
              "&:hover": {
                borderColor: "#f43f5e",
                backgroundColor: "rgba(244, 63, 94, 0.08)",
              },
            }}
          >
            End Workspace Session
          </Button>
        </Box>

        {/* Database binding alert warning if keys aren't added, otherwise success chip */}
        <Box sx={{ mb: 4 }}>
          {isSupabaseConfigured ? (
            <Alert
              severity="success"
              icon={<CheckCircle size={18} />}
              sx={{
                background: "rgba(16, 185, 129, 0.08)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                alignItems: "center",
                "& .MuiAlert-icon": { color: "#10b981" },
              }}
            >
              Supabase Instance Connected! Modifications will synchronize
              directly onto your PostgreSQL tables.
            </Alert>
          ) : (
            <Alert
              severity="warning"
              icon={<AlertCircle size={18} />}
              sx={{
                background: "rgba(245, 158, 11, 0.08)",
                color: "#fbbf24",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                alignItems: "center",
                "& .MuiAlert-icon": { color: "#f59e0b" },
              }}
            >
              Running in local sandbox mode. Changes will persist directly
              inside your browser's persistent key-value{" "}
              <strong>localStorage</strong>. Connect{" "}
              <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> env parameters to sync live!
            </Alert>
          )}
        </Box>

        {/* Alert updates */}
        {alertInfo && (
          <Alert
            severity={alertInfo.type}
            sx={{
              mb: 4,
              borderRadius: "8px",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {alertInfo.message}
          </Alert>
        )}

        {/* TAB CONTROLS */}
        <Box
          sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.08)", mb: 4 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#E50914",
                height: "3px",
              },
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.6)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                minHeight: "48px",
                "&.Mui-selected": { color: "#ffffff" },
              },
            }}
          >
            <Tab
              icon={<ImageIcon size={18} />}
              label="Manage Portfolio Artworks"
              iconPosition="start"
            />
            <Tab
              icon={<VideoIcon size={18} />}
              label="Manage Cinematic Videos"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* ==================================== PORTFOLIO ARTWORKS VIEW ==================================== */}
        {activeTab === 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                }}
              >
                Artworks Portfolio Showcase ({portfolios.length} items)
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsPortfolioModalOpen(true)}
                startIcon={<PlusCircle size={16} />}
                sx={{
                  backgroundColor: "#E50914",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#b91c1c" },
                }}
              >
                Add Image / Artwork
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : portfolios.length === 0 ? (
              <Box
                sx={{
                  textCenter: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary">
                  No custom portfolio items configured yet.
                </Typography>
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {portfolios.map((item) => (
                  <div key={item.id}>
                    <Card
                      sx={{
                        background: "#121214",
                        border: "1px solid rgba(255,255,255,0.06)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.01)" },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          aspectRatio: "4/3",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.8)",
                              color: "#ffffff",
                              border: "1px solid rgba(255,255,255,0.15)",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      </Box>
                      <CardContent
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 650, mb: 0.5, lineHeight: 1.3 }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              display: "block",
                            }}
                          >
                            Label: {item.specLabel || "N/A"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              display: "block",
                            }}
                          >
                            Credits: {item.author || "N/A"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                            pt: 1,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeletePortfolio(item.id, item.title)
                            }
                            sx={{
                              color: "#f43f5e",
                              "&:hover": {
                                backgroundColor: "rgba(244,63,94,0.08)",
                              },
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Box>
        )}

        {/* ==================================== CINEMATIC VIDEOS VIEW ==================================== */}
        {activeTab === 1 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                }}
              >
                Cinematic Videos Showcase ({videos.length} videos)
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsVideoModalOpen(true)}
                startIcon={<PlusCircle size={16} />}
                sx={{
                  backgroundColor: "#E50914",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#b91c1c" },
                }}
              >
                Add YouTube Video Link
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : videos.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary">
                  No custom videos tracked yet.
                </Typography>
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map((vid) => (
                  <div key={vid.id}>
                    <Card
                      sx={{
                        background: "#121214",
                        border: "1px solid rgba(255,255,255,0.06)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.01)" },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          aspectRatio: "16/9",
                          overflow: "hidden",
                          backgroundColor: "#000000",
                        }}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                          alt={vid.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                          <Chip
                            label={vid.category}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.85)",
                              color: "#ffffff",
                              border: "1px solid rgba(255,255,255,0.15)",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            color: "#ffffff",
                            px: 1,
                            borderRadius: "3px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        >
                          {vid.duration} mins
                        </Box>
                      </Box>
                      <CardContent
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 650, mb: 1, lineHeight: 1.3 }}
                          >
                            {vid.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              mb: 2,
                              fontSize: "0.82rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {vid.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              display: "block",
                            }}
                          >
                            YouTube ID:{" "}
                            <span className="font-mono text-xs">
                              {vid.youtubeId}
                            </span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 3,
                            pt: 1,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                            target="_blank"
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              "&:hover": { color: "#ff3333" },
                            }}
                          >
                            <ExternalLink size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteVideo(vid.id, vid.title)}
                            sx={{
                              color: "#f43f5e",
                              "&:hover": {
                                backgroundColor: "rgba(244,63,94,0.08)",
                              },
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Box>
        )}

        {/* ==================================== MODAL DIALOG: ADD PORTFOLIO ==================================== */}
        <Dialog
          open={isPortfolioModalOpen}
          onClose={() => setIsPortfolioModalOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#18181b",
              backgroundImage: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#ffffff",
            },
          }}
        >
          <Box component="form" onSubmit={handleSavePortfolio}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              Insert New Portfolio Artwork
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label="Artwork Title"
                margin="normal"
                required
                value={portfolioForm.title}
                onChange={(e) =>
                  handlePortfolioFormChange("title", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />

              <TextField
                select
                fullWidth
                label="Category"
                margin="normal"
                value={portfolioForm.category}
                onChange={(e) =>
                  handlePortfolioFormChange("category", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              >
                {[
                  "Portrait",
                  "Product",
                  "Event",
                  "Studio",
                  "Visa",
                  "Wedding",
                  "Videography",
                  "Photo Frame",
                ].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              {/* TWO CHOICE INTERACTIVE UPLOAD SCHEME */}
              <Box
                sx={{
                  mt: 3,
                  mb: 1,
                  border: "1px dashed rgba(229, 9, 20, 0.25)",
                  p: 2.5,
                  borderRadius: "8px",
                  backgroundColor: "rgba(229,9,20,0.02)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontFamily: '"Space Grotesk"',
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Upload size={16} className="text-[#E50914]" /> Select Image
                  Source
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Upload size={14} />}
                  disabled={uploadProgress}
                  sx={{
                    width: "100%",
                    mb: 2.5,
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.15)",
                    textTransform: "none",
                    fontFamily: '"Space Grotesk"',
                    "&:hover": {
                      borderColor: "#E50914",
                      backgroundColor: "rgba(229,9,20,0.05)",
                    },
                  }}
                >
                  {uploadProgress
                    ? "Reading raw file data..."
                    : "Upload Image / Drop local photo"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </Button>

                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }}>
                  OR
                </Divider>

                <TextField
                  fullWidth
                  label="Alternative Web Image URL (Unsplash etc.)"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={portfolioForm.imageUrl}
                  onChange={(e) =>
                    handlePortfolioFormChange("imageUrl", e.target.value)
                  }
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
                        <IconButton
                          size="small"
                          edge="start"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          <LinkIcon size={14} />
                        </IconButton>
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
              </Box>

              {portfolioForm.imageUrl && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    textAlign: "center",
                    backgroundColor: "#121214",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Image Preview
                  </Typography>
                  <img
                    src={portfolioForm.imageUrl}
                    alt="Preview"
                    style={{
                      maxHeight: "140px",
                      maxWidth: "100%",
                      margin: "0 auto",
                      borderRadius: "4px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                label="Technical Spec Label (Optional)"
                placeholder="e.g. F/2.8 Outdoor Golden Hour Setup"
                margin="normal"
                value={portfolioForm.specLabel}
                onChange={(e) =>
                  handlePortfolioFormChange("specLabel", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Photographer / Author Tag (Optional)"
                placeholder="e.g. Kathmandu Portrait Lab"
                margin="normal"
                value={portfolioForm.author}
                onChange={(e) =>
                  handlePortfolioFormChange("author", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Button
                onClick={() => setIsPortfolioModalOpen(false)}
                sx={{ color: "#a1a1aa" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#E50914",
                  "&:hover": { backgroundColor: "#b91c1c" },
                }}
              >
                Insert Artwork
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* ==================================== MODAL DIALOG: ADD VIDEO ==================================== */}
        <Dialog
          open={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#18181b",
              backgroundImage: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#ffffff",
            },
          }}
        >
          <Box component="form" onSubmit={handleSaveVideo}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              Insert New Cinematic Video Link
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label="Video Title"
                margin="normal"
                required
                value={videoForm.title}
                onChange={(e) => handleVideoFormChange("title", e.target.value)}
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />

              <TextField
                fullWidth
                label="YouTube URL or 11-Digit Video ID"
                placeholder="e.g. https://www.youtube.com/watch?v=8F735-S_TzI or just 8F735-S_TzI"
                margin="normal"
                required
                value={videoForm.youtubeUrlOrId}
                onChange={(e) =>
                  handleVideoFormChange("youtubeUrlOrId", e.target.value)
                }
                helperText="Fully supports full watch URLs, sharing links, embed sequences, or pure IDs."
                slotProps={{
                  inputLabel: {
                    style: {
                      color: "rgba(255, 255, 255, 0.6)",
                      fontFamily: '"Space Grotesk"',
                    },
                  },
                  formHelperText: {
                    style: {
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.72rem",
                    },
                  },
                  input: {
                    style: { color: "#ffffff" },
                    startAdornment: (
                      <IconButton
                        size="small"
                        edge="start"
                        sx={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        <VideoIcon size={14} />
                      </IconButton>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />

              <TextField
                select
                fullWidth
                label="Category"
                margin="normal"
                value={videoForm.category}
                onChange={(e) =>
                  handleVideoFormChange("category", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              >
                {[
                  "Wedding Reel",
                  "Cinematography",
                  "Behind the Scenes",
                  "Studio Promo",
                  "Commercial",
                ].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <TextField
                  fullWidth
                  label="Duration (e.g. 5:10)"
                  placeholder="3:30"
                  margin="none"
                  value={videoForm.duration}
                  onChange={(e) =>
                    handleVideoFormChange("duration", e.target.value)
                  }
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
              </div>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Video Descriptive Outline"
                placeholder="A brief overview about client wedding moments, equipment setups, drones used, etc."
                margin="normal"
                value={videoForm.description}
                onChange={(e) =>
                  handleVideoFormChange("description", e.target.value)
                }
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
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "#E50914" },
                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                  },
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Button
                onClick={() => setIsVideoModalOpen(false)}
                sx={{ color: "#a1a1aa" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#E50914",
                  "&:hover": { backgroundColor: "#b91c1c" },
                }}
              >
                Log Film Video
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
