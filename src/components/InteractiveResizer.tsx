/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Upload,
  RotateCw,
  ZoomIn,
  Sun,
  Contrast as ContrastIcon,
  Sparkles,
  Download,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { PHOTO_PRESETS } from '../data';
import { PhotoPreset, EditAdjustment } from '../types';

export default function InteractiveResizer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedPreset, setSelectedPreset] = useState<PhotoPreset>(PHOTO_PRESETS[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [simulatedSizeKb, setSimulatedSizeKb] = useState<number>(0);
  const [compressionStatus, setCompressionStatus] = useState<'success' | 'warning' | null>(null);

  // Editing parameters
  const [adjustments, setAdjustments] = useState<EditAdjustment>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
    zoom: 1.2,
    x: 0,
    y: 0
  });

  // Dragging states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Canvas refs
  const workspaceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setImageLoaded(false);
      setAdjustments({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        rotation: 0,
        zoom: 1.1,
        x: 0,
        y: 0
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handlePresetChange = (presetId: string) => {
    const preset = PHOTO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset);
      setAdjustments(prev => ({
        ...prev,
        zoom: preset.ratioWidth === preset.ratioHeight ? 1.0 : 1.2,
        x: 0,
        y: 0
      }));
    }
  };

  const rotateImage = () => {
    setAdjustments(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
      zoom: selectedPreset.ratioWidth === selectedPreset.ratioHeight ? 1.0 : 1.1,
      x: 0,
      y: 0
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageLoaded) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setAdjustments(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const drawWorkspace = useCallback(() => {
    const canvas = workspaceCanvasRef.current;
    const img = sourceImageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + adjustments.x, height / 2 + adjustments.y);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.zoom, adjustments.zoom);

    const activeBrightness = 100 + adjustments.brightness;
    const activeContrast = 100 + adjustments.contrast;
    const activeSaturation = 100 + adjustments.saturation;
    ctx.filter = `brightness(${activeBrightness}%) contrast(${activeContrast}%) saturate(${activeSaturation}%)`;

    const ratioX = width / img.width;
    const ratioY = height / img.height;
    const scale = Math.max(ratioX, ratioY);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(197, 168, 128, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);

    ctx.beginPath();
    ctx.moveTo(0, height * 0.33);
    ctx.lineTo(width, height * 0.33);
    ctx.moveTo(0, height * 0.66);
    ctx.lineTo(width, height * 0.66);
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.moveTo(width * 0.66, 0);
    ctx.lineTo(width * 0.66, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [imageLoaded, adjustments]);

  const calculateExportWeight = useCallback(() => {
    const exportCanvas = exportCanvasRef.current;
    if (!exportCanvas || !sourceImageRef.current || !imageLoaded) return;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    exportCanvas.width = selectedPreset.standardWidthPx;
    exportCanvas.height = selectedPreset.standardHeightPx;

    const width = exportCanvas.width;
    const height = exportCanvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    const workspaceCanvas = workspaceCanvasRef.current;
    if (workspaceCanvas) {
      const scaleFactor = width / workspaceCanvas.width;
      ctx.translate(width / 2 + adjustments.x * scaleFactor, height / 2 + adjustments.y * scaleFactor);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.scale(adjustments.zoom, adjustments.zoom);
    } else {
      ctx.translate(width / 2, height / 2);
    }

    const activeBrightness = 100 + adjustments.brightness;
    const activeContrast = 100 + adjustments.contrast;
    const activeSaturation = 100 + adjustments.saturation;
    ctx.filter = `brightness(${activeBrightness}%) contrast(${activeContrast}%) saturate(${activeSaturation}%)`;

    const img = sourceImageRef.current;
    const ratioX = width / img.width;
    const ratioY = height / img.height;
    const scale = Math.max(ratioX, ratioY);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    let quality = 0.85;
    if (selectedPreset.maxFileSizeKb && selectedPreset.maxFileSizeKb <= 15) {
      quality = 0.45;
    }

    const dataUrl = exportCanvas.toDataURL('image/jpeg', quality);
    const head = 'data:image/jpeg;base64,';
    const base64Len = dataUrl.length - head.length;
    const weightKb = Math.round((base64Len * (3 / 4)) / 102.4) / 10;
    setSimulatedSizeKb(weightKb);

    if (selectedPreset.maxFileSizeKb) {
      if (weightKb <= selectedPreset.maxFileSizeKb) {
        setCompressionStatus('success');
      } else {
        setCompressionStatus('warning');
      }
    } else {
      setCompressionStatus(null);
    }
  }, [selectedPreset, adjustments, imageLoaded]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        sourceImageRef.current = img;
        setImageLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  useEffect(() => {
    if (imageLoaded) {
      drawWorkspace();
      calculateExportWeight();
    }
  }, [imageLoaded, adjustments, drawWorkspace, calculateExportWeight]);

  const handleExportDownload = () => {
    const exportCanvas = exportCanvasRef.current;
    if (!exportCanvas || !imageLoaded) return;

    let quality = 0.92;
    if (selectedPreset.maxFileSizeKb && selectedPreset.maxFileSizeKb <= 15) {
      quality = 0.45;
    } else if (selectedPreset.maxFileSizeKb && selectedPreset.maxFileSizeKb <= 150) {
      quality = 0.82;
    }

    const dataUrl = exportCanvas.toDataURL('image/jpeg', quality);
    const link = document.createElement('a');
    const cleanFileName = selectedPreset.id + '_resized_' + Date.now() + '.jpg';
    link.download = cleanFileName;
    link.href = dataUrl;
    link.click();
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 0 },
        backgroundColor: 'background.default',
        color: 'text.primary',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.3s, color 0.3s',
      }}
      id="resizer-root"
    >
      <Container maxWidth="xl" id="resizer-container">
        {/* Title Block */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: '100px',
              backgroundColor: 'rgba(229, 9, 20, 0.08)',
              border: '1px solid rgba(229, 9, 20, 0.25)',
              mb: 2,
            }}
          >
            <Sparkles size={14} className="text-[#E50914]" />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#ff4d4d',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Compliant Crop Utility
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Online Biometric Sizer & Resizer Tool
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', maxWidth: '650px', mx: 'auto', fontSize: '0.95rem', fontWeight: 300 }}
          >
            Don't have time to shoot in Kathmandu? Upload your portrait below, pick your standard form requirements, align your eyes to the guidelines grid, and download fully-compliant results instantly.
          </Typography>
        </Box>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Side */}
          <div className="lg:col-span-4">
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                height: '100%',
                boxShadow: 'none',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              id="resizer-settings-card"
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    mb: 3,
                    color: '#E50914',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Upload size={18} /> Resizer Parameters
                </Typography>

                {/* Preset Input */}
                <FormControl fullWidth sx={{ mb: 4 }} size="small">
                  <InputLabel id="preset-select-label" sx={{ color: 'text.secondary' }}>Select Requirement Format</InputLabel>
                  <Select
                    labelId="preset-select-label"
                    id="preset-select"
                    value={selectedPreset.id}
                    label="Select Requirement Format"
                    onChange={(e) => handlePresetChange(e.target.value as string)}
                    sx={{
                      color: 'text.primary',
                      backgroundColor: 'background.default',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(229, 9, 20, 0.2)' : 'rgba(229, 9, 20, 0.15)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E50914' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E50914' },
                      '.MuiSvgIcon-root': { color: '#E50914' },
                    }}
                  >
                    {PHOTO_PRESETS.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Presets Spec Panel */}
                <Box
                  sx={{
                    backgroundColor: isDark ? '#111111' : 'rgba(0, 0, 0, 0.02)',
                    p: 2.5,
                    borderLeft: '3px solid #E50914',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '4px',
                    mb: 4,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Format Specifications:
                  </Typography>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Ratio:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedPreset.ratioWidth}:{selectedPreset.ratioHeight}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Output Standard:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#E50914' }}>
                        {selectedPreset.outputSizeText}
                      </Typography>
                    </div>
                  </div>
                  {selectedPreset.maxFileSizeKb && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Max File Size Target:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                        Under {selectedPreset.maxFileSizeKb} KB
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                    {selectedPreset.description}
                  </Typography>
                </Box>

                {/* Work Bench Sliders */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Alignment Adjustments
                </Typography>

                <Stack spacing={3} sx={{ mb: 4 }}>
                  {/* Zoom Slider */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ZoomIn size={12} /> Image Zoom Scale
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {adjustments.zoom.toFixed(1)}x
                      </Typography>
                    </Box>
                    <Slider
                      value={adjustments.zoom}
                      min={0.5}
                      max={3.0}
                      step={0.1}
                      disabled={!imageLoaded}
                      onChange={(_, val) => setAdjustments(prev => ({ ...prev, zoom: val as number }))}
                      sx={{ color: '#E50914', py: 1 }}
                    />
                  </Box>

                  {/* Brightness Slider */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Sun size={12} /> Brightness Compensation
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}%
                      </Typography>
                    </Box>
                    <Slider
                      value={adjustments.brightness}
                      min={-40}
                      max={40}
                      step={1}
                      disabled={!imageLoaded}
                      onChange={(_, val) => setAdjustments(prev => ({ ...prev, brightness: val as number }))}
                      sx={{ color: '#E50914', py: 1 }}
                    />
                  </Box>

                  {/* Contrast Slider */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ContrastIcon size={12} /> Facial Contrast Balance
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}%
                      </Typography>
                    </Box>
                    <Slider
                      value={adjustments.contrast}
                      min={-30}
                      max={30}
                      step={1}
                      disabled={!imageLoaded}
                      onChange={(_, val) => setAdjustments(prev => ({ ...prev, contrast: val as number }))}
                      sx={{ color: '#E50914', py: 1 }}
                    />
                  </Box>
                </Stack>

                {/* Additional controls buttons Row */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RotateCw size={14} />}
                    disabled={!imageLoaded}
                    onClick={rotateImage}
                    sx={{
                      color: 'text.primary',
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                      fontFamily: '"Space Grotesk", sans-serif',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: '#E50914',
                        backgroundColor: 'rgba(229, 9, 20, 0.05)',
                      },
                    }}
                  >
                    90° Rotate
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RefreshCw size={14} />}
                    disabled={!imageLoaded}
                    onClick={resetAdjustments}
                    sx={{
                      color: 'text.secondary',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      fontFamily: '"Space Grotesk", sans-serif',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      },
                    }}
                  >
                    Reset Grid
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Workspace Area */}
          <div className="md:col-span-7 lg:col-span-5">
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              id="resizer-workspace-card"
            >
              <CardContent
                sx={{
                  p: 3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!imageSrc ? (
                  /* Initial Upload Box drag-and-drop */
                  <Box
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                      width: '100%',
                      maxWidth: '380px',
                      aspectRatio: '5/7',
                      border: '2px dashed',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
                      '&:hover': {
                        borderColor: '#E50914',
                        backgroundColor: 'rgba(229, 9, 20, 0.03)',
                      },
                    }}
                    id="resizer-drop-zone"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="studio-file-upload"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="studio-file-upload" className="w-full h-full cursor-pointer flex flex-col items-center justify-center">
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(229, 9, 20, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2.5,
                        }}
                      >
                        <Upload size={24} className="text-[#E50914]" />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        Click to upload portrait / headshot
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
                        Supports JPEG, PNG, WEBP files
                      </Typography>
                      <Button
                        variant="contained"
                        component="span"
                        sx={{
                          background: 'linear-gradient(135deg, #E50914 0%, #B71C1C 100%)',
                          fontFamily: '"Space Grotesk", sans-serif',
                          textTransform: 'none',
                          fontSize: '0.85rem',
                          px: 3,
                        }}
                      >
                        Upload Photo
                      </Button>
                    </label>
                  </Box>
                ) : (
                  /* Active Interactive Canvas Workspace with aspect boundary bounding box */
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <AlertCircle animate-fade="true" size={12} className="text-[#E50914]" /> Use your mouse pointer to drag-and-pan your headshot inside the grid.
                    </Typography>

                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '280px',
                        aspectRatio: `${selectedPreset.ratioWidth}/${selectedPreset.ratioHeight}`,
                        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 6px 20px rgba(0,0,0,0.1)',
                        border: '2px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <canvas
                        ref={workspaceCanvasRef}
                        width={280}
                        height={280 * (selectedPreset.ratioHeight / selectedPreset.ratioWidth)}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ width: '100%', height: '100%', display: 'block', cursor: isDragging ? 'grabbing' : 'grab' }}
                      />
                    </Box>

                    <input
                      type="file"
                      accept="image/*"
                      id="change-file-upload"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="change-file-upload">
                      <Button
                        component="span"
                        variant="text"
                        size="small"
                        sx={{
                          color: '#ff4d4d',
                          mt: 3,
                          textTransform: 'none',
                          fontSize: '0.825rem',
                          fontFamily: '"Space Grotesk", sans-serif',
                          '&:hover': { color: '#E50914' },
                        }}
                      >
                        Choose another image
                      </Button>
                    </label>
                  </Box>
                )}

                <canvas ref={exportCanvasRef} style={{ display: 'none' }} />
              </CardContent>
            </Card>
          </div>

          {/* Guidelines & Direct Checklist side */}
          <div className="md:col-span-5 lg:col-span-3">
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: 'text.primary',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              id="resizer-guidelines-card"
            >
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                <Typography variant="subtitle1" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, color: '#E50914', mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CheckCircle size={16} /> Embedding Guidelines
                </Typography>

                <List sx={{ p: 0, mb: 4 }} dense>
                  {selectedPreset.recommendations.map((rec, ind) => (
                    <ListItem key={ind} sx={{ px: 0, py: 0.75, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 22, mt: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#E50914' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.4 }}>
                            {rec}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {imageLoaded && (
                  <Box sx={{ mt: 'auto', p: 2, backgroundColor: isDark ? '#111111' : 'rgba(0, 0, 0, 0.02)', borderRadius: '4px', border: '1px solid', borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', mb: 3 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Estimated Export Size:</Typography>
                    <div className="flex flex-row items-center gap-2">
                       <Typography variant="body1" sx={{ fontWeight: 700, color: compressionStatus === 'success' ? '#22c55e' : '#eab308' }}>
                        ~{simulatedSizeKb.toFixed(1)} KB
                      </Typography>
                      {selectedPreset.maxFileSizeKb && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          (Required under {selectedPreset.maxFileSizeKb} KB)
                        </Typography>
                      )}
                    </div>

                    {compressionStatus === 'success' && (
                      <Alert severity="success" sx={{ py: 0, px: 1, mt: 1.5, fontSize: '0.725rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', '.MuiAlert-icon': { p: 0, color: '#4ade80' } }}>
                        Guaranteed file size target met!
                      </Alert>
                    )}

                    {compressionStatus === 'warning' && (
                      <Alert severity="warning" sx={{ py: 0, px: 1, mt: 1.5, fontSize: '0.725rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#facc15', '.MuiAlert-icon': { p: 0, color: '#facc15' } }}>
                        Compressor auto-limiting active.
                      </Alert>
                    )}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  disabled={!imageLoaded}
                  onClick={handleExportDownload}
                  id="final-resize-download-btn"
                  sx={{
                    mt: imageLoaded ? 0 : 'auto',
                    background: 'linear-gradient(135deg, #E50914 0%, #B71C1C 100%)',
                    boxShadow: '0 4px 14px rgba(229, 9, 20, 0.2)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '0.95rem',
                    borderRadius: '4px',
                    borderColor: 'rgba(255,255,255,0.05)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff4c4c 0%, #a60000 100%)',
                    },
                  }}
                  startIcon={<Download size={18} />}
                >
                  Download Compliant Jpeg
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Box>
  );
}
