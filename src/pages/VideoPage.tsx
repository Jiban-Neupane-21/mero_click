/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  Divider,
} from "@mui/material";
import {
  Play,
  Film,
  Calendar,
  Clock,
  Share2,
  ExternalLink,
  Info,
  X,
  ChevronRight,
  TrendingUp,
  Tv,
  Sparkles,
  Heart,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoItem } from "../types";
import { ColorModeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { apiService } from "../utils/supabase";

export default function VideoSection() {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";
  const navigate = useNavigate();

  // State managers
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [spotlightVideo, setSpotlightVideo] = useState<VideoItem | null>(null);
  const [theaterVideo, setTheaterVideo] = useState<VideoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiService.getVideoItems();
        setVideos(data);
        if (data.length > 0) {
          setSpotlightVideo(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      "Wedding Reel",
      "Cinematography",
      "Behind the Scenes",
      "Studio Promo",
      "Commercial",
    ];
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "All") return videos;
    return videos.filter((video) => video.category === selectedCategory);
  }, [selectedCategory, videos]);

  const handleShare = (video: VideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookRedirect = () => {
    navigate("/book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      id="page-videos"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: isDark ? "#020202" : "#f8fafc",
        color: "text.primary",
        transition: "background-color 0.3s",
      }}
    >
      <Container maxWidth="xl">
        {/* Animated Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: isDark
                ? "rgba(229, 9, 20, 0.08)"
                : "rgba(229, 9, 20, 0.05)",
              border: "1px solid rgba(229, 9, 20, 0.15)",
              borderRadius: "99px",
              px: 2,
              py: 0.75,
              mb: 2,
            }}
          >
            <Video size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                color: "#E50914",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Cinematic Showroom
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "2.25rem", md: "3.25rem" },
              mb: 2.5,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Kathmandu in Masterful
            <Box
              component="span"
              sx={{ color: "#E50914", display: "inline-block", ml: 1.5 }}
            >
              4K Motion
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: isDark ? "#94a3b8" : "#475569",
              maxWidth: "780px",
              mx: "auto",
              fontWeight: 300,
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            Experience our stunning high-frame videography, traditional Nepali
            wedding memories, corporate promos, and creative lighting guides.
            Powered by global-grade lens selection and pristine audio details.
          </Typography>
        </Box>

        {/* Dynamic Category Filter bar */}
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            mb: 6,
            overflowX: "auto",
            pb: 1.5,
            justifyContent: { xs: "flex-start", md: "center" },
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            px: { xs: 2, md: 0 },
            mx: { xs: -2, md: 0 },
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.85rem",
                  px: 1.5,
                  py: 2.25,
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

        {/* ACTIVE VIDEOS GRID & SPOTLIGHT */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Main Large Spotlight Theater Player (Left or Top) */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {spotlightVideo && (
              <Card
                sx={{
                  background: isDark ? "rgba(10, 10, 10, 0.6)" : "#ffffff",
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 15px 45px rgba(0,0,0,0.5)"
                    : "0 15px 30px rgba(0,0,0,0.04)",
                }}
              >
                {/* Responsive 16:9 YouTube Container */}
                <Box
                  className="relative w-full overflow-hidden"
                  sx={{
                    aspectRatio: "16/9",
                    backgroundColor: "#000000",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <iframe
                    title={spotlightVideo.title}
                    src={`https://www.youtube.com/embed/${spotlightVideo.youtubeId}?autoplay=0&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full height-full border-none"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>

                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label={spotlightVideo.category}
                        size="small"
                        sx={{
                          background:
                            "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                          color: "#ffffff",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          fontFamily: '"Space Grotesk", sans-serif',
                          borderRadius: "4px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          fontSize: "0.8rem",
                          gap: 0.5,
                          ml: 1,
                        }}
                      >
                        <Clock size={12} />
                        <span>{spotlightVideo.duration} mins</span>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          fontSize: "0.8rem",
                          gap: 0.5,
                          ml: 1.5,
                        }}
                      >
                        <Calendar size={12} />
                        <span>{spotlightVideo.uploadDate}</span>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => handleShare(spotlightVideo, e)}
                        startIcon={<Share2 size={13} />}
                        sx={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          textTransform: "none",
                          color:
                            copiedId === spotlightVideo.id
                              ? "#10b981"
                              : "text.secondary",
                          borderColor:
                            copiedId === spotlightVideo.id
                              ? "rgba(16,185,129,0.3)"
                              : isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                          borderRadius: "4px",
                          "&:hover": {
                            borderColor: "#E50914",
                            backgroundColor: "rgba(229,9,20,0.03)",
                          },
                        }}
                      >
                        {copiedId === spotlightVideo.id
                          ? "Saved Link!"
                          : "Copy Link"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        href={`https://www.youtube.com/watch?v=${spotlightVideo.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<ExternalLink size={13} />}
                        sx={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          textTransform: "none",
                          color: "text.secondary",
                          borderColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          borderRadius: "4px",
                          "&:hover": {
                            borderColor: "#E50914",
                            backgroundColor: "rgba(229,9,20,0.03)",
                          },
                        }}
                      >
                        YouTube
                      </Button>
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      mb: 1.5,
                    }}
                  >
                    {spotlightVideo.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? "#cbd5e1" : "#475569",
                      lineHeight: 1.7,
                      fontWeight: 300,
                    }}
                  >
                    {spotlightVideo.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Quick Playlist Grid / Dynamic List on the Right */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: "0.12em",
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                Play Showcase Playlist ({filteredVideos.length})
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: { lg: "620px" },
                overflowY: { lg: "auto" },
                pr: { lg: 1 },
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  borderRadius: "2px",
                },
              }}
            >
              {filteredVideos.map((video) => {
                const isCurrentSpotlight = spotlightVideo?.id === video.id;
                return (
                  <Box
                    key={video.id}
                    onClick={() => setSpotlightVideo(video)}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: "8px",
                      backgroundColor: isCurrentSpotlight
                        ? isDark
                          ? "rgba(229, 9, 20, 0.08)"
                          : "rgba(229, 9, 20, 0.04)"
                        : isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.01)",
                      border: "1px solid",
                      borderColor: isCurrentSpotlight
                        ? "#E50914"
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        borderColor: "#E50914",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.03)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {/* Compact Thumbnail Frame */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100px",
                        height: "62px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        flexShrink: 0,
                        backgroundColor: "#000000",
                      }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play
                          size={12}
                          color="#ffffff"
                          className="fill-[#ffffff]"
                        />
                      </Box>
                    </Box>

                    {/* Meta info brief */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <span className="text-[0.62rem] tracking-wider text-red-500 font-bold uppercase mb-0.5">
                        {video.category}
                      </span>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "0.82rem",
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontWeight: 600,
                          lineHeight: 1.25,
                          mb: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: isCurrentSpotlight
                            ? "#E50914"
                            : "text.primary",
                        }}
                      >
                        {video.title}
                      </Typography>
                      <span className="text-[0.68rem] text-slate-400 font-light">
                        {video.duration} Mins • {video.uploadDate}
                      </span>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 6,
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        />

        {/* Dense Showcase GRID of ALL Video Options */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TrendingUp size={18} className="text-[#E50914]" /> Explore Other
          Studio Broadcasts
        </Typography>

        <Grid container spacing={4}>
          {filteredVideos.map((video) => (
            <Grid size={{ xs: 12, lg: 8 }} key={video.id}>
              <Card
                className="hover-gold-glow h-full"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  background: isDark ? "rgba(12, 12, 12, 0.45)" : "#ffffff",
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                  borderRadius: "10px",
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0,0,0,0.3)"
                    : "0 8px 24px rgba(0,0,0,0.02)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "#E50914",
                    "& .hover-play-btn": {
                      opacity: 1,
                      transform: "translate(-50%, -50%) scale(1.1)",
                    },
                    "& .thumbnail-cover-img": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                {/* HD Thumbnail Card media */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "16/10",
                    cursor: "pointer",
                  }}
                  onClick={() => setTheaterVideo(video)}
                >
                  <CardMedia
                    component="img"
                    image={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="thumbnail-cover-img"
                    onError={(e: any) => {
                      e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />

                  {/* Dark Matte Film tint overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.15)",
                    }}
                  />

                  {/* Duration marker pill */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      bgcolor: "rgba(0,0,0,0.85)",
                      px: 1,
                      py: 0.25,
                      borderRadius: "3px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Clock size={10} /> {video.duration}
                    </Typography>
                  </Box>

                  {/* Category badging */}
                  <Box sx={{ position: "absolute", top: 10, left: 10 }}>
                    <Chip
                      size="small"
                      label={video.category}
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        backgroundColor: isDark
                          ? "rgba(0,0,0,0.75)"
                          : "rgba(255,255,255,0.9)",
                        color: isDark ? "#ffffff" : "#0f172a",
                        border: "1px solid",
                        borderColor: "#E50914",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                    />
                  </Box>

                  {/* Suspended Red Play state button overlay */}
                  <IconButton
                    className="hover-play-btn"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) scale(1)",
                      backgroundColor: "rgba(229, 9, 20, 0.95)",
                      color: "#ffffff",
                      p: 2,
                      opacity: 0,
                      boxShadow: "0 8px 24px rgba(229, 9, 20, 0.4)",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        backgroundColor: "#ff3333",
                      },
                    }}
                  >
                    <Play size={20} className="fill-[#ffffff] ml-0.5" />
                  </IconButton>
                </Box>

                <CardContent
                  sx={{
                    p: 2.5,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    onClick={() => {
                      setSpotlightVideo(video);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    sx={{
                      fontSize: "1rem",
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      mb: 1,
                      cursor: "pointer",
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      height: "2.7em",
                      "&:hover": { color: "#E50914" },
                    }}
                  >
                    {video.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 300,
                      lineHeight: 1.5,
                      mb: 2.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      height: "4.5em",
                    }}
                  >
                    {video.description}
                  </Typography>

                  {/* Foot metadata buttons inside core card and action triggers */}
                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1.5,
                      borderTop: "1px solid",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)",
                    }}
                  >
                    <span className="text-[0.68rem] text-slate-500 font-light">
                      Exported {video.uploadDate}
                    </span>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleShare(video, e)}
                        sx={{
                          color:
                            copiedId === video.id
                              ? "#10b981"
                              : "text.secondary",
                        }}
                      >
                        <Share2 size={14} />
                      </IconButton>
                      <Button
                        size="small"
                        onClick={() => {
                          setSpotlightVideo(video);
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }}
                        endIcon={<ChevronRight size={12} />}
                        sx={{
                          textTransform: "none",
                          color: "#E50914",
                          fontSize: "0.75rem",
                          p: 0,
                          minWidth: "auto",
                          fontWeight: 600,
                        }}
                      >
                        Spotlight
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* BOTTOM CALL-TO-ACTION FOR KATHMANDU VIDEOGRAPHY SERVICES */}
        <Box
          sx={{
            mt: 10,
            p: { xs: 4, md: 6 },
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden",
            border: "2px solid rgba(229, 9, 20, 0.2)",
            background: isDark
              ? "radial-gradient(ellipse at bottom, rgba(229,9,20,0.12) 0%, rgba(5,5,5,1) 80%)"
              : "radial-gradient(ellipse at bottom, rgba(229,9,20,0.05) 0%, rgba(255,255,255,1) 80%)",
          }}
          id="videography-services-cta"
        >
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#E50914",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  display: "block",
                  mb: 1,
                }}
              >
                CUSTOM RESERVATIONS & REELS
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                Planning an Event or Promo in Kathmandu?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  fontWeight: 300,
                  maxWidth: "680px",
                }}
              >
                We provide complete high-end videography solutions with expert
                editing, color grading, multi-lens configurations, and premium
                sound design for traditional weddings, musical gigs, and
                corporate brand showcases.
              </Typography>
            </Grid>
            <Grid
              sx={{ xs: 12, md: 4, textAlign: { xs: "left", md: "right" } }}
            >
              <Button
                variant="contained"
                onClick={handleBookRedirect}
                sx={{
                  background:
                    "linear-gradient(135deg, #E50914 0%, #B71C1C 100%)",
                  boxShadow: "0 8px 24px rgba(229, 9, 20, 0.35)",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  borderRadius: "4px",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 30px rgba(229, 9, 20, 0.45)",
                  },
                }}
              >
                Hire Videographer Service
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* FULLSTAGE THEATER MODE INTERACTIVE OVERLAY MODAL */}
      <AnimatePresence>
        {theaterVideo && (
          <Dialog
            fullWidth
            maxWidth="lg"
            open={Boolean(theaterVideo)}
            onClose={() => setTheaterVideo(null)}
            slotProps={{
              backdrop: {
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.92)",
                  backdropFilter: "blur(8px)",
                },
              },
              paper: {
                sx: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  overflow: "hidden",
                  borderRadius: "8px",
                  mx: { xs: 2, sm: 4 },
                },
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{ width: "100%", height: "100%" }}
            >
              <Box sx={{ width: "100%", position: "relative" }}>
                {/* Header Close triggers */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    px: 1,
                    color: "#ffffff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Film size={15} className="text-[#E50914]" />
                    <span className="font-family-display font-medium text-sm text-[rgba(255,255,255,0.8)] tracking-wider">
                      THEATER SPOTLIGHT: {theaterVideo.category.toUpperCase()}
                    </span>
                  </Box>
                  <IconButton
                    onClick={() => setTheaterVideo(null)}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        color: "#ffffff",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                </Box>

                {/* Main 16:9 Cinema Screen */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#000000",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.85)",
                  }}
                >
                  <iframe
                    title={theaterVideo.title}
                    src={`https://www.youtube.com/embed/${theaterVideo.youtubeId}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </Box>

                {/* Video Info Foot */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.6)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.04)",
                    color: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {theaterVideo.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#cbd5e1",
                      fontWeight: 300,
                      fontSize: "0.82rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {theaterVideo.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
}
