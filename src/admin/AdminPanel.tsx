/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
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
  KeyRound,
  ExternalLink,
  CheckCircle,
  Eye,
  AlertCircle,
  Sparkles,
  Edit,
  Clock,
  BadgePercent,
  PlaySquare,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { apiService, isSupabaseConfigured } from "../utils/supabase";
import {
  PortfolioItem,
  VideoItem,
  StudioService,
  OfferAd,
  TutorialVideo,
  LearningArticle,
  HeroImg,
} from "../types";

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
  const [services, setServices] = useState<StudioService[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "info" | "warning";
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
  const [activeVideoModalType, setActiveVideoModalType] = useState<
    "youtube" | "facebook" | "tiktok"
  >("youtube");
  const [videoForm, setVideoForm] = useState({
    title: "",
    youtubeUrlOrId: "",
    category: "Cinematography",
    duration: "",
    description: "",
    facebookLink: "",
    tiktokLink: "",
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [offers, setOffers] = useState<OfferAd[]>([]);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    category: "Portrait",
    basePrice: "",
    duration: "",
    description: "",
    rating: 5.0,
    imageUrl: "",
    featuresText: "",
  });

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({
    badge: "",
    title: "",
    discount: "",
    description: "",
    image: "",
    validUntil: "",
    actionText: "",
    targetCategory: "Wedding",
    accentColor: "#E50914",
  });

  const [tutorialVideos, setTutorialVideos] = useState<TutorialVideo[]>([]);
  const [learningArticles, setLearningArticles] = useState<LearningArticle[]>(
    [],
  );

  const [heroImage, setHeroImage] = useState<HeroImg | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tutorials/Articles Forms State
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [editingTutorialId, setEditingTutorialId] = useState<string | null>(
    null,
  );
  const [tutorialForm, setTutorialForm] = useState({
    title: "",
    youtubeUrlOrId: "",
    category: "Biometrics",
    duration: "",
    description: "",
  });

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "Biometrics",
    excerpt: "",
    content: "",
    readTime: "",
    imageUrl: "",
    author: "",
  });
  // Load all items
  const loadDatabaseItems = async () => {
    setLoading(true);
    try {
      const fetchedPortfolios = await apiService.getPortfolioItems();
      const fetchedVideos = await apiService.getVideoItems();
      const fetchedServices = await apiService.getServices();
      const fetchedOffers = await apiService.getOffers();
      const fetchedTutorialVideos = await apiService.getTutorialVideos();
      const fetchedLearningArticles = await apiService.getLearningArticles();
      const fetchedHeroImages = await apiService.getHeroImages();

      setPortfolios(fetchedPortfolios);
      setVideos(fetchedVideos);
      setServices(fetchedServices);
      setOffers(fetchedOffers);
      setTutorialVideos(fetchedTutorialVideos);
      setLearningArticles(fetchedLearningArticles);
      setHeroImage(fetchedHeroImages.length > 0 ? fetchedHeroImages[0] : null);
    } catch (err: any) {
      console.error("Error fetching admin dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseItems();
    if (isSupabaseConfigured) {
      console.log(
        "Supabase Instance Connected! Modifications will synchronize directly onto your PostgreSQL tables.",
      );
    } else {
      console.warn(
        "Running in local sandbox mode. Changes will persist directly inside your browser's persistent key-value localStorage. Connect VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env parameters to sync live!",
      );
    }
  }, []);

  const triggerAlert = (
    type: "success" | "error" | "info" | "warning",
    message: string,
  ) => {
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
      if (file.size > 5 * 1024 * 1024) {
        triggerAlert(
          "error",
          "Image size exceeds 5MB limit. Please upload a smaller image.",
        );
        e.target.value = "";
        return;
      }
      setImageFile(file);
      // Generate a temporary local URL for preview
      const objectUrl = URL.createObjectURL(file);

      if (isPortfolioModalOpen) {
        setPortfolioForm((p) => ({ ...p, imageUrl: objectUrl }));
      } else if (isServiceModalOpen) {
        setServiceForm((s) => ({ ...s, imageUrl: objectUrl }));
      } else if (isOfferModalOpen) {
        setOfferForm((o) => ({ ...o, image: objectUrl }));
      } else if (isArticleModalOpen) {
        setArticleForm((a) => ({ ...a, imageUrl: objectUrl }));
      }

      triggerAlert("success", `Image "${file.name}" ready to upload.`);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title || (!portfolioForm.imageUrl && !imageFile)) {
      triggerAlert(
        "error",
        "Please provide a title and select/upload an image.",
      );
      return;
    }

    try {
      let finalImageUrl = portfolioForm.imageUrl;

      if (imageFile) {
        setUploadProgress(true);
        triggerAlert("info", "Uploading image...");
        finalImageUrl = await apiService.uploadImage(imageFile);
        setUploadProgress(false);
      }

      await apiService.savePortfolioItem({
        title: portfolioForm.title,
        category: portfolioForm.category as any,
        imageUrl: finalImageUrl,
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
      setUploadProgress(false);
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
    if (!videoForm.title) {
      triggerAlert("error", "Please enter a video title.");
      return;
    }

    if (
      !videoForm.youtubeUrlOrId &&
      !(videoForm as any).facebookLink &&
      !(videoForm as any).tiktokLink
    ) {
      triggerAlert(
        "error",
        "Please provide at least one link (YouTube, Facebook, or TikTok).",
      );
      return;
    }

    let youtubeId = "";
    if (videoForm.youtubeUrlOrId) {
      youtubeId = extractYoutubeId(videoForm.youtubeUrlOrId);
      if (youtubeId.length !== 11) {
        triggerAlert(
          "error",
          "Unable to parse standard YouTube video ID. Ensure link is correct.",
        );
        return;
      }
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
        facebookLink: (videoForm as any).facebookLink,
        tiktokLink: (videoForm as any).tiktokLink,
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
        facebookLink: "",
        tiktokLink: "",
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

  // --- STUDIO SERVICES ACTIONS ---
  const handleServiceFormChange = (prop: string, val: any) => {
    setServiceForm((prev) => ({ ...prev, [prop]: val }));
  };

  const handleEditService = (service: StudioService) => {
    setEditingServiceId(service.id);
    setServiceForm({
      title: service.title,
      category: service.category,
      basePrice: service.basePrice,
      duration: service.duration,
      description: service.description,
      rating: service.rating || 5.0,
      imageUrl: service.imageUrl,
      featuresText: Array.isArray(service.features)
        ? service.features.join("\n")
        : "",
    });
    setIsServiceModalOpen(true);
    setImageFile(null);
  };

  const handleAddServiceClick = () => {
    setEditingServiceId(null);
    setServiceForm({
      title: "",
      category: "Portrait",
      basePrice: "",
      duration: "",
      description: "",
      rating: 5.0,
      imageUrl: "",
      featuresText: "",
    });
    setIsServiceModalOpen(true);
    setImageFile(null);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !serviceForm.title ||
      (!serviceForm.imageUrl && !imageFile) ||
      !serviceForm.basePrice ||
      !serviceForm.duration
    ) {
      triggerAlert(
        "error",
        "Please provide title, base price, duration, and select/upload an image.",
      );
      return;
    }

    const features = serviceForm.featuresText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    try {
      let finalImageUrl = serviceForm.imageUrl;

      if (imageFile) {
        setUploadProgress(true);
        triggerAlert("info", "Uploading image...");
        finalImageUrl = await apiService.uploadImage(imageFile);
        setUploadProgress(false);
      }

      await apiService.saveServiceItem({
        id: editingServiceId || undefined,
        title: serviceForm.title,
        category: serviceForm.category as any,
        basePrice: serviceForm.basePrice,
        duration: serviceForm.duration,
        description: serviceForm.description,
        features: features,
        rating: Number(serviceForm.rating) || 5.0,
        imageUrl: finalImageUrl,
      });

      triggerAlert(
        "success",
        editingServiceId
          ? "Successfully updated studio service details!"
          : "Successfully created new studio service!",
      );
      setIsServiceModalOpen(false);
      setImageFile(null);
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      setUploadProgress(false);
      triggerAlert("error", err.message || "Error saving service details.");
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete service "${title}" from Kathmandu active specialties?`,
      )
    ) {
      try {
        await apiService.deleteServiceItem(id);
        triggerAlert(
          "success",
          `Deleted studio service "${title}" successfully.`,
        );
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting service.");
      }
    }
  };

  // --- SPECIAL OFFERS & ADS ACTIONS ---
  const handleOfferFormChange = (prop: string, val: string) => {
    setOfferForm((prev) => ({ ...prev, [prop]: val }));
  };

  const handleEditOffer = (offer: OfferAd) => {
    setEditingOfferId(offer.id);
    setOfferForm({
      badge: offer.badge,
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      image: offer.image,
      validUntil: offer.validUntil,
      actionText: offer.actionText,
      targetCategory: offer.targetCategory,
      accentColor: offer.accentColor || "#E50914",
    });
    setIsOfferModalOpen(true);
    setImageFile(null);
  };

  const handleAddOfferClick = () => {
    setEditingOfferId(null);
    setOfferForm({
      badge: "LIMITED SEASON OFFER",
      title: "",
      discount: "15% FLAT DISCOUNT",
      description: "",
      image: "",
      validUntil: "Ends Soon",
      actionText: "Claim Discount",
      targetCategory: "Wedding",
      accentColor: "#E50914",
    });
    setIsOfferModalOpen(true);
    setImageFile(null);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !offerForm.title ||
      (!offerForm.image && !imageFile) ||
      !offerForm.badge ||
      !offerForm.discount
    ) {
      triggerAlert(
        "error",
        "Please provide a badge, title, discount value, and select/upload an image.",
      );
      return;
    }

    try {
      let finalImageUrl = offerForm.image;

      if (imageFile) {
        setUploadProgress(true);
        triggerAlert("info", "Uploading image...");
        finalImageUrl = await apiService.uploadImage(imageFile);
        setUploadProgress(false);
      }

      await apiService.saveOfferItem({
        id: editingOfferId || undefined,
        badge: offerForm.badge,
        title: offerForm.title,
        discount: offerForm.discount,
        description: offerForm.description,
        image: finalImageUrl,
        validUntil: offerForm.validUntil,
        actionText: offerForm.actionText,
        targetCategory: offerForm.targetCategory,
        accentColor: offerForm.accentColor,
      });

      triggerAlert(
        "success",
        editingOfferId
          ? "Successfully updated promotional offer banner!"
          : "Successfully launched new promotional offer!",
      );
      setIsOfferModalOpen(false);
      setImageFile(null);
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      setUploadProgress(false);
      triggerAlert(
        "error",
        err.message || "Error saving promotional offer details.",
      );
    }
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete offer "${title}" from the dynamic carousel?`,
      )
    ) {
      try {
        await apiService.deleteOfferItem(id);
        triggerAlert(
          "success",
          `Deleted promotional offer "${title}" successfully.`,
        );
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting offer.");
      }
    }
  };

  // --- TUTORIALS ACTIONS ---
  const handleTutorialFormChange = (prop: string, val: string) => {
    setTutorialForm((prev) => ({ ...prev, [prop]: val }));
  };

  const handleEditTutorial = (tutorial: TutorialVideo) => {
    setEditingTutorialId(tutorial.id);
    setTutorialForm({
      title: tutorial.title,
      youtubeUrlOrId: tutorial.youtubeId,
      category: tutorial.category,
      duration: tutorial.duration,
      description: tutorial.description,
    });
    setIsTutorialModalOpen(true);
  };

  const handleAddTutorialClick = () => {
    setEditingTutorialId(null);
    setTutorialForm({
      title: "",
      youtubeUrlOrId: "",
      category: "General",
      duration: "8:00",
      description: "",
    });
    setIsTutorialModalOpen(true);
  };

  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorialForm.title || !tutorialForm.youtubeUrlOrId) {
      triggerAlert(
        "error",
        "Please enter a title and YouTube video URL or ID.",
      );
      return;
    }

    const youtubeId = extractYoutubeId(tutorialForm.youtubeUrlOrId);
    if (youtubeId.length !== 11) {
      triggerAlert(
        "error",
        "Unable to parse standard YouTube video ID. Ensure link is correct.",
      );
      return;
    }

    const fetchHeroImage = async () => {
      setLoading(true);
      try {
        const images = await apiService.getHeroImages();
        setHeroImage(images.length > 0 ? images[0] : null);
      } catch (err) {
        console.error("Error fetching hero images:", err);
        setError("Failed to load hero image.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchHeroImage();
    }, []);

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        // Replace the existing image. First, delete the old one if it exists.
        if (heroImage) {
          await apiService.deleteHeroImage(heroImage.id);
        }
        const imageUrl = await apiService.uploadImage(file);
        await apiService.saveHeroImage({ imageUrl });
        await fetchHeroImage(); // Refetch to show the new image
      } catch (err: any) {
        console.error("Upload failed:", err);
        setError(err.message || "An error occurred during upload.");
      } finally {
        setUploading(false);
        // Reset file input
        if (event.target) {
          event.target.value = "";
        }
      }
    };

    const handleDelete = async () => {
      if (!heroImage) return;

      setUploading(true); // Use uploading state to disable buttons
      setError(null);

      try {
        await apiService.deleteHeroImage(heroImage.id);
        setHeroImage(null);
      } catch (err: any) {
        console.error("Delete failed:", err);
        setError(err.message || "An error occurred during deletion.");
      } finally {
        setUploading(false);
      }
    };

    try {
      await apiService.saveTutorialVideo({
        id: editingTutorialId || undefined,
        title: tutorialForm.title,
        youtubeId: youtubeId,
        category: tutorialForm.category,
        duration: tutorialForm.duration,
        description: tutorialForm.description,
        publishedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });

      triggerAlert(
        "success",
        editingTutorialId
          ? "Successfully updated tutorial video details!"
          : "Successfully created new tutorial video!",
      );
      setIsTutorialModalOpen(false);
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      triggerAlert("error", err.message || "Error saving tutorial video.");
    }
  };

  const handleDeleteTutorial = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete tutorial "${title}"?`,
      )
    ) {
      try {
        await apiService.deleteTutorialVideo(id);
        triggerAlert("success", `Deleted tutorial "${title}" successfully.`);
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting tutorial.");
      }
    }
  };

  // --- ARTICLES ACTIONS ---
  const handleArticleFormChange = (prop: string, val: string) => {
    setArticleForm((prev) => ({ ...prev, [prop]: val }));
  };

  const handleEditArticle = (article: LearningArticle) => {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      author: article.author,
    });
    setIsArticleModalOpen(true);
    setImageFile(null);
  };

  const handleAddArticleClick = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: "",
      category: "General",
      excerpt: "",
      content: "",
      readTime: "Take 3 Minutes to Read",
      imageUrl: "",
      author: "Studio Specialist",
    });
    setIsArticleModalOpen(true);
    setImageFile(null);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !articleForm.title ||
      !articleForm.content ||
      !articleForm.excerpt ||
      (!articleForm.imageUrl && !imageFile)
    ) {
      triggerAlert(
        "error",
        "Please provide a title, excerpt, content, and cover image.",
      );
      return;
    }

    try {
      let finalImageUrl = articleForm.imageUrl;

      if (imageFile) {
        setUploadProgress(true);
        triggerAlert("info", "Uploading image...");
        finalImageUrl = await apiService.uploadImage(imageFile);
        setUploadProgress(false);
      }

      await apiService.saveLearningArticle({
        id: editingArticleId || undefined,
        title: articleForm.title,
        category: articleForm.category,
        excerpt: articleForm.excerpt,
        content: articleForm.content,
        readTime: articleForm.readTime,
        imageUrl: finalImageUrl,
        author: articleForm.author,
        publishedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });

      triggerAlert(
        "success",
        editingArticleId
          ? "Successfully updated learning article details!"
          : "Successfully created new learning article!",
      );
      setIsArticleModalOpen(false);
      setImageFile(null);
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      setUploadProgress(false);
      triggerAlert("error", err.message || "Error saving learning article.");
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete article "${title}"?`,
      )
    ) {
      try {
        await apiService.deleteLearningArticle(id);
        triggerAlert(
          "success",
          `Deleted learning article "${title}" successfully.`,
        );
        loadDatabaseItems();
        if (onDataChange) onDataChange();
      } catch (err: any) {
        triggerAlert("error", err.message || "Error deleting article.");
      }
    }
  };

  const handleHeroImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleHeroImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      if (heroImage) {
        await apiService.deleteHeroImage(heroImage.id);
      }
      const imageUrl = await apiService.uploadImage(file);
      await apiService.saveHeroImage({ imageUrl });
      const images = await apiService.getHeroImages();
      setHeroImage(images.length > 0 ? images[0] : null);
      if (onDataChange) onDataChange();
      triggerAlert("success", "Hero image updated successfully!");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "An error occurred during upload.");
      triggerAlert("error", err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleHeroImageDelete = async () => {
    if (!heroImage) return;

    if (!window.confirm("Are you sure you want to delete the home image?")) return;

    setUploading(true);
    setError(null);

    try {
      await apiService.deleteHeroImage(heroImage.id);
      setHeroImage(null);
      if (onDataChange) onDataChange();
      triggerAlert("success", "Hero image deleted successfully.");
    } catch (err: any) {
      console.error("Delete failed:", err);
      setError(err.message || "An error occurred during deletion.");
      triggerAlert("error", err.message || "An error occurred during deletion.");
    } finally {
      setUploading(false);
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
              Studio Mero Click Platform
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
            Log Out
          </Button>
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
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
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
              label="Manage Home Image"
              iconPosition="start"
            />

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
            <Tab
              icon={<Briefcase size={18} />}
              label="Manage Studio Services"
              iconPosition="start"
            />
            <Tab
              icon={<BadgePercent size={18} />}
              label="Manage Promo Offers & Ads"
              iconPosition="start"
            />
            <Tab
              icon={<PlaySquare size={18} />}
              label="Manage Tutorial Videos"
              iconPosition="start"
            />
            <Tab
              icon={<BookOpen size={18} />}
              label="Manage Learning Articles"
              iconPosition="start"
            />
          </Tabs>
        </Box>

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
                Manage Home Image
              </Typography>
            </Box>
            <Card sx={{ background: "#121214", border: "1px solid rgba(255,255,255,0.06)", p: 4, textAlign: "center" }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleHeroImageFileChange}
              />
              {uploading ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#E50914", mb: 2 }} />
                  <Typography>Uploading image...</Typography>
                </Box>
              ) : heroImage ? (
                <Box sx={{ position: "relative", display: "inline-block", maxWidth: "100%", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={heroImage.imageUrl} alt="Home Hero" style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "contain" }} referrerPolicy="no-referrer" />
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button variant="outlined" onClick={handleHeroImageUploadClick} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                      Replace Image
                    </Button>
                    <Button variant="contained" onClick={handleHeroImageDelete} sx={{ backgroundColor: "#E50914", "&:hover": { backgroundColor: "#b91c1c" } }}>
                      Delete Image
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ py: 8 }}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 3 }}>No home image uploaded yet.</Typography>
                  <Button variant="contained" onClick={handleHeroImageUploadClick} startIcon={<Upload size={18} />} sx={{ backgroundColor: "#E50914", "&:hover": { backgroundColor: "#b91c1c" } }}>
                    Upload Home Image
                  </Button>
                </Box>
              )}
            </Card>
          </Box>
        )}

        {/* ==================================== PORTFOLIO ARTWORKS VIEW ==================================== */}
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
        {activeTab === 2 && (
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
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveVideoModalType("youtube");
                    setIsVideoModalOpen(true);
                  }}
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
                  YouTube Video
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveVideoModalType("facebook");
                    setIsVideoModalOpen(true);
                  }}
                  startIcon={<PlusCircle size={16} />}
                  sx={{
                    backgroundColor: "#1877F2",
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#166FE5" },
                  }}
                >
                  Facebook Video
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveVideoModalType("tiktok");
                    setIsVideoModalOpen(true);
                  }}
                  startIcon={<PlusCircle size={16} />}
                  sx={{
                    backgroundColor: "#000000",
                    border: "1px solid rgba(255,255,255,0.2)",
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#111111" },
                  }}
                >
                  TikTok Video
                </Button>
              </Box>
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
                        {vid.youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                            alt={vid.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: (vid as any).facebookLink
                                ? "#1877F2"
                                : (vid as any).tiktokLink
                                  ? "#000000"
                                  : "#222",
                              border: (vid as any).tiktokLink
                                ? "1px solid #333"
                                : "none",
                            }}
                          >
                            <VideoIcon
                              size={32}
                              color={
                                (vid as any).facebookLink ||
                                  (vid as any).tiktokLink
                                  ? "#ffffff"
                                  : "rgba(255,255,255,0.3)"
                              }
                            />
                          </Box>
                        )}
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
                            {vid.youtubeId ? (
                              <>
                                YouTube ID:{" "}
                                <span className="font-mono text-xs">
                                  {vid.youtubeId}
                                </span>
                              </>
                            ) : (vid as any).facebookLink ? (
                              <>Facebook Video</>
                            ) : (vid as any).tiktokLink ? (
                              <>TikTok Video</>
                            ) : (
                              <>External Video</>
                            )}
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
                            href={
                              vid.youtubeId
                                ? `https://www.youtube.com/watch?v=${vid.youtubeId}`
                                : (vid as any).facebookLink
                                  ? (vid as any).facebookLink
                                  : (vid as any).tiktokLink
                            }
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

        {/* ==================================== STUDIO SERVICES VIEW ==================================== */}
        {activeTab === 3 && (
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
                Active Studio Specialties / Services ({services.length} active)
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddServiceClick}
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
                Add Studio Specialty
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : services.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary">
                  No custom studio specialties defined yet.
                </Typography>
              </Box>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item) => (
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
                          aspectRatio: "16/9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
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
                              backgroundColor: "rgba(0,0,0,0.85)",
                              color: "#ffffff",
                              border: "1px solid rgba(255,255,255,0.15)",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                        {item.duration && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              backgroundColor: "rgba(0,0,0,0.8)",
                              color: "#ffffff",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "3px",
                              fontSize: "0.7rem",
                              fontWeight: 650,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Clock size={10} className="text-[#E50914]" />
                            {item.duration}
                          </Box>
                        )}
                      </Box>
                      <CardContent
                        sx={{
                          p: 2.5,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              lineHeight: 1.3,
                              color: "#ffffff",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              mb: 2,
                              fontSize: "0.82rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.description}
                          </Typography>
                          <div className="flex justify-between items-center bg-[#18181c] p-2.5 rounded border border-white/4 mb-3">
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255,255,255,0.5)" }}
                            >
                              Base Pricing:
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#E50914", fontWeight: 700 }}
                            >
                              {item.basePrice}
                            </Typography>
                          </div>

                          {/* Features Preview */}
                          {item.features && item.features.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255,255,255,0.4)",
                                  textTransform: "uppercase",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Included Features Preview:
                              </Typography>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(Array.isArray(item.features)
                                  ? item.features
                                  : []
                                )
                                  .slice(0, 3)
                                  .map((f: string, i: number) => (
                                    <Chip
                                      key={i}
                                      label={f}
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          "rgba(255,255,255,0.04)",
                                        color: "rgba(255,255,255,0.7)",
                                        fontSize: "0.65rem",
                                      }}
                                    />
                                  ))}
                                {(Array.isArray(item.features)
                                  ? item.features
                                  : []
                                ).length > 3 && (
                                    <Chip
                                      label={`+${item.features.length - 3} more`}
                                      size="small"
                                      sx={{
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: "0.65rem",
                                      }}
                                    />
                                  )}
                              </div>
                            </Box>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            pt: 1.5,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleEditService(item)}
                            startIcon={<Edit size={14} />}
                            sx={{
                              color: "#38bdf8",
                              textTransform: "none",
                              fontFamily: '"Space Grotesk"',
                              fontSize: "0.75rem",
                            }}
                          >
                            Edit Features
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteService(item.id, item.title)
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

        {/* ==================================== PROMO OFFERS & ADS VIEW ==================================== */}
        {activeTab === 4 && (
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
                Active Promotional Offers & Ads Carousel ({offers.length}{" "}
                active)
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddOfferClick}
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
                Add Promo Offer / Ad
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : offers.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No promotional offers defined yet.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleAddOfferClick}
                  sx={{
                    color: "#E50914",
                    borderColor: "#E50914",
                    textTransform: "none",
                  }}
                >
                  Create First Dynamic Offer
                </Button>
              </Box>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((item) => (
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
                          aspectRatio: "16/9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              backgroundColor: item.accentColor || "#E50914",
                              color: "#ffffff",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                            }}
                          />
                          <Chip
                            label={item.targetCategory}
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
                        {item.validUntil && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              backgroundColor: "rgba(0,0,0,0.8)",
                              color: "#ffffff",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "3px",
                              fontSize: "0.7rem",
                              fontWeight: 650,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Clock size={10} className="text-[#E50914]" />
                            {item.validUntil}
                          </Box>
                        )}
                      </Box>
                      <CardContent
                        sx={{
                          p: 2.5,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{
                              color: item.accentColor || "#E50914",
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {item.discount}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              lineHeight: 1.3,
                              color: "#ffffff",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              mb: 2,
                              fontSize: "0.82rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.description}
                          </Typography>
                          {item.actionText && (
                            <div className="flex justify-between items-center bg-[#18181c] p-2.5 rounded border border-white/4 mb-3">
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.5)" }}
                              >
                                Action Label:
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "#ffffff",
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {item.actionText}
                              </Typography>
                            </div>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            pt: 1.5,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleEditOffer(item)}
                            startIcon={<Edit size={14} />}
                            sx={{
                              color: "#38bdf8",
                              textTransform: "none",
                              fontFamily: '"Space Grotesk"',
                              fontSize: "0.75rem",
                            }}
                          >
                            Edit Offer
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteOffer(item.id, item.title)
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

        {/* ==================================== TUTORIAL VIDEOS VIEW ==================================== */}
        {activeTab === 5 && (
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
                Learn From Us: Tutorial Videos ({tutorialVideos.length} videos)
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddTutorialClick}
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
                Add Tutorial Video
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : tutorialVideos.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No tutorial videos tracked yet.
                </Typography>
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tutorialVideos.map((vid) => (
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
                        {vid.youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                            alt={vid.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: (vid as any).facebookLink
                                ? "#1877F2"
                                : (vid as any).tiktokLink
                                  ? "#000000"
                                  : "#222",
                              border: (vid as any).tiktokLink
                                ? "1px solid #333"
                                : "none",
                            }}
                          >
                            <VideoIcon
                              size={32}
                              color={
                                (vid as any).facebookLink ||
                                  (vid as any).tiktokLink
                                  ? "#ffffff"
                                  : "rgba(255,255,255,0.3)"
                              }
                            />
                          </Box>
                        )}
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
                            Published: {vid.publishedAt}
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
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleEditTutorial(vid)}
                            startIcon={<Edit size={14} />}
                            sx={{
                              color: "#38bdf8",
                              textTransform: "none",
                              fontFamily: '"Space Grotesk"',
                              fontSize: "0.75rem",
                            }}
                          >
                            Edit
                          </Button>
                          <Box sx={{ display: "flex", gap: 1 }}>
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
                              onClick={() =>
                                handleDeleteTutorial(vid.id, vid.title)
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
                        </Box>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Box>
        )}

        {/* ==================================== LEARNING ARTICLES VIEW ==================================== */}
        {activeTab === 6 && (
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
                Learn From Us: Learning Articles ({learningArticles.length}{" "}
                articles)
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddArticleClick}
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
                Add Article
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            ) : learningArticles.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No learning articles defined yet.
                </Typography>
              </Box>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningArticles.map((item) => (
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
                          aspectRatio: "16/9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
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
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "3px",
                            fontSize: "0.7rem",
                            fontWeight: 650,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Clock size={10} className="text-[#E50914]" />{" "}
                          {item.readTime}
                        </Box>
                      </Box>
                      <CardContent
                        sx={{
                          p: 2.5,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              lineHeight: 1.3,
                              color: "#ffffff",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              mb: 2,
                              fontSize: "0.82rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.excerpt}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              display: "block",
                            }}
                          >
                            By {item.author} | {item.publishedAt}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            pt: 1.5,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleEditArticle(item)}
                            startIcon={<Edit size={14} />}
                            sx={{
                              color: "#38bdf8",
                              textTransform: "none",
                              fontFamily: '"Space Grotesk"',
                              fontSize: "0.75rem",
                            }}
                          >
                            Edit Article
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteArticle(item.id, item.title)
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
                  "Wedding",
                  "Maternity",
                  "Cake Smash",
                  "Fashion",
                  "Portrait",
                  "Identity Photo",
                  "Commercial",
                  "Customize Gifts",
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
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: -1.5,
                    mb: 2,
                  }}
                >
                  Max file size: 5MB
                </Typography>

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
              Insert New{" "}
              {activeVideoModalType === "youtube"
                ? "YouTube"
                : activeVideoModalType === "facebook"
                  ? "Facebook"
                  : "TikTok"}{" "}
              Video
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

              {activeVideoModalType === "youtube" && (
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
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.12)",
                      },
                      "&:hover fieldset": { borderColor: "#E50914" },
                      "&.Mui-focused fieldset": { borderColor: "#E50914" },
                    },
                  }}
                />
              )}

              {activeVideoModalType === "facebook" && (
                <TextField
                  fullWidth
                  label="Facebook Video Link"
                  placeholder="https://facebook.com/..."
                  margin="normal"
                  required
                  value={(videoForm as any).facebookLink || ""}
                  onChange={(e) =>
                    handleVideoFormChange("facebookLink", e.target.value)
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
              )}

              {activeVideoModalType === "tiktok" && (
                <TextField
                  fullWidth
                  label="TikTok Video Link"
                  placeholder="https://tiktok.com/..."
                  margin="normal"
                  required
                  value={(videoForm as any).tiktokLink || ""}
                  onChange={(e) =>
                    handleVideoFormChange("tiktokLink", e.target.value)
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
              )}

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
                  "Fashion",
                  "Behind the Scenes",
                  "UCG Ads",
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

        {/* ==================================== MODAL DIALOG: ADD/EDIT STUDIO SERVICE ==================================== */}
        <Dialog
          open={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
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
          <Box component="form" onSubmit={handleSaveService}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              {editingServiceId
                ? "Edit Active Service Specialty"
                : "Add New Active Service Specialty"}
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label="Service / Specialty Title"
                placeholder="e.g. Cinematic Wedding Motion Film"
                margin="normal"
                required
                value={serviceForm.title}
                onChange={(e) =>
                  handleServiceFormChange("title", e.target.value)
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <TextField
                  select
                  fullWidth
                  label="Category Name"
                  margin="none"
                  required
                  value={serviceForm.category}
                  onChange={(e) =>
                    handleServiceFormChange("category", e.target.value)
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
                >
                  {[
                    "Visa",
                    "Portrait",
                    "Wedding",
                    "Videography",
                    "Photo Frame",
                    "Product",
                    "Photography",
                    "Photo Enhancement",
                    "Customized Gift",
                    "Document Service",
                  ].map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Rating (1.0 to 5.0)"
                  type="number"
                  placeholder="4.9"
                  margin="none"
                  required
                  value={serviceForm.rating}
                  onChange={(e) =>
                    handleServiceFormChange("rating", e.target.value)
                  }
                  slotProps={{
                    inputLabel: {
                      style: {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontFamily: '"Space Grotesk"',
                      },
                    },
                    input: { style: { color: "#ffffff" } },
                    htmlInput: { min: 1.0, max: 5.0, step: 0.1 },
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <TextField
                  fullWidth
                  label="Base Price (with currency symbol)"
                  placeholder="Rs. 45,000"
                  margin="none"
                  required
                  value={serviceForm.basePrice}
                  onChange={(e) =>
                    handleServiceFormChange("basePrice", e.target.value)
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

                <TextField
                  fullWidth
                  label="Duration Label"
                  placeholder="e.g. 1 hour / 3 days"
                  margin="none"
                  required
                  value={serviceForm.duration}
                  onChange={(e) =>
                    handleServiceFormChange("duration", e.target.value)
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
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: -1.5,
                    mb: 2,
                  }}
                >
                  Max file size: 5MB
                </Typography>

                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }}>
                  OR
                </Divider>

                <TextField
                  fullWidth
                  label="Alternative Web Image URL (Unsplash etc.)"
                  placeholder="https://images.unsplash.com/..."
                  value={serviceForm.imageUrl}
                  onChange={(e) =>
                    handleServiceFormChange("imageUrl", e.target.value)
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

              {serviceForm.imageUrl && (
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
                    src={serviceForm.imageUrl}
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
                multiline
                rows={3}
                label="Service Outline / Description"
                placeholder="Describe service outputs, resolutions, camera bodies used..."
                margin="normal"
                required
                value={serviceForm.description}
                onChange={(e) =>
                  handleServiceFormChange("description", e.target.value)
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
                multiline
                rows={4}
                label="Features List (Put each feature on a separate new line)"
                placeholder="4K Multi-angle cinematic cameras&#10;Professional editing suite adjustments&#10;Delivered in physical drives within 7 days"
                margin="normal"
                value={serviceForm.featuresText}
                onChange={(e) =>
                  handleServiceFormChange("featuresText", e.target.value)
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
                onClick={() => setIsServiceModalOpen(false)}
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
                {editingServiceId ? "Update Service" : "Activate Service"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* ==================================== MODAL DIALOG: ADD/EDIT PROMO OFFER ==================================== */}
        <Dialog
          open={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
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
          <Box component="form" onSubmit={handleSaveOffer}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              {editingOfferId
                ? "Edit Active Promotion Offer"
                : "Launch New Promotional Offer"}
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <TextField
                  fullWidth
                  label="Promo Badge Text"
                  placeholder="e.g. LIMITED SEASON OFFER"
                  required
                  value={offerForm.badge}
                  onChange={(e) =>
                    handleOfferFormChange("badge", e.target.value)
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

                <TextField
                  fullWidth
                  label="Discount Overline Value"
                  placeholder="e.g. 15% FLAT DISCOUNT"
                  required
                  value={offerForm.discount}
                  onChange={(e) =>
                    handleOfferFormChange("discount", e.target.value)
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
                label="Offer Campaign Title"
                placeholder="e.g. Monsoon Wedding Film Premium Package"
                margin="normal"
                required
                value={offerForm.title}
                onChange={(e) => handleOfferFormChange("title", e.target.value)}
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
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: -1.5,
                    mb: 2,
                  }}
                >
                  Max file size: 5MB
                </Typography>

                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }}>
                  OR
                </Divider>

                <TextField
                  fullWidth
                  label="Alternative Web Image URL (Unsplash etc.)"
                  placeholder="https://images.unsplash.com/..."
                  value={offerForm.image}
                  onChange={(e) =>
                    handleOfferFormChange("image", e.target.value)
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

              {offerForm.image && (
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
                    src={offerForm.image}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <TextField
                  fullWidth
                  label="Validity Date / Text"
                  placeholder="e.g. Ends June 30, 2026"
                  required
                  value={offerForm.validUntil}
                  onChange={(e) =>
                    handleOfferFormChange("validUntil", e.target.value)
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

                <TextField
                  fullWidth
                  label="CTA Action Button Label"
                  placeholder="e.g. Claim 15% Discount"
                  required
                  value={offerForm.actionText}
                  onChange={(e) =>
                    handleOfferFormChange("actionText", e.target.value)
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <TextField
                  select
                  fullWidth
                  label="Target Portfolio Category"
                  value={offerForm.targetCategory}
                  onChange={(e) =>
                    handleOfferFormChange("targetCategory", e.target.value)
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
                >
                  {["Wedding", "Visa", "Portrait", "Event", "Commercial"].map(
                    (cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ),
                  )}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Brand Theme Accent Color"
                  value={offerForm.accentColor}
                  onChange={(e) =>
                    handleOfferFormChange("accentColor", e.target.value)
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
                >
                  <MenuItem value="#E50914">Crimson Red (#E50914)</MenuItem>
                  <MenuItem value="#10B981">Emerald Green (#10B981)</MenuItem>
                  <MenuItem value="#3B82F6">Royal Blue (#3B82F6)</MenuItem>
                  <MenuItem value="#F59E0B">Amber Gold (#F59E0B)</MenuItem>
                  <MenuItem value="#8B5CF6">Amethyst Purple (#8B5CF6)</MenuItem>
                </TextField>
              </div>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Offer Campaign Description"
                placeholder="Describe details, conditions, bundles, or timeline criteria of this promotional deal..."
                margin="normal"
                required
                value={offerForm.description}
                onChange={(e) =>
                  handleOfferFormChange("description", e.target.value)
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
                onClick={() => setIsOfferModalOpen(false)}
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
                {editingOfferId ? "Update Promo Offer" : "Launch Promo Offer"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        {/* ==================================== MODAL DIALOG: ADD/EDIT TUTORIAL VIDEO ==================================== */}
        <Dialog
          open={isTutorialModalOpen}
          onClose={() => setIsTutorialModalOpen(false)}
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
          <Box component="form" onSubmit={handleSaveTutorial}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              {editingTutorialId
                ? "Edit Tutorial Video"
                : "Add New Tutorial Video"}
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label="Tutorial Title"
                margin="normal"
                required
                value={tutorialForm.title}
                onChange={(e) =>
                  handleTutorialFormChange("title", e.target.value)
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
                label="YouTube URL or 11-Digit Video ID"
                placeholder="https://www.youtube.com/watch?v=..."
                margin="normal"
                required
                value={tutorialForm.youtubeUrlOrId}
                onChange={(e) =>
                  handleTutorialFormChange("youtubeUrlOrId", e.target.value)
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <TextField
                  select
                  fullWidth
                  label="Category"
                  margin="none"
                  required
                  value={tutorialForm.category}
                  onChange={(e) =>
                    handleTutorialFormChange("category", e.target.value)
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
                >
                  {[
                    "Biometrics",
                    "Posing",
                    "Framing",
                    "Lighting",
                    "Editing",
                    "General",
                  ].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Duration (e.g. 5:10)"
                  placeholder="8:00"
                  margin="none"
                  value={tutorialForm.duration}
                  onChange={(e) =>
                    handleTutorialFormChange("duration", e.target.value)
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
                label="Tutorial Description"
                placeholder="Describe what viewers will learn..."
                margin="normal"
                value={tutorialForm.description}
                onChange={(e) =>
                  handleTutorialFormChange("description", e.target.value)
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
                onClick={() => setIsTutorialModalOpen(false)}
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
                {editingTutorialId ? "Update Tutorial" : "Save Tutorial"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* ==================================== MODAL DIALOG: ADD/EDIT LEARNING ARTICLE ==================================== */}
        <Dialog
          open={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          fullWidth
          maxWidth="md"
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
          <Box component="form" onSubmit={handleSaveArticle}>
            <DialogTitle
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"Space Grotesk"',
                fontWeight: 700,
              }}
            >
              {editingArticleId
                ? "Edit Learning Article"
                : "Add New Learning Article"}
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <TextField
                  fullWidth
                  label="Article Title"
                  required
                  value={articleForm.title}
                  onChange={(e) =>
                    handleArticleFormChange("title", e.target.value)
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
                <TextField
                  select
                  fullWidth
                  label="Category"
                  required
                  value={articleForm.category}
                  onChange={(e) =>
                    handleArticleFormChange("category", e.target.value)
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
                >
                  {[
                    "Biometrics",
                    "Posing",
                    "Framing",
                    "Lighting",
                    "Editing",
                    "General",
                  ].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <TextField
                  fullWidth
                  label="Read Time (e.g. 5 mins read)"
                  value={articleForm.readTime}
                  onChange={(e) =>
                    handleArticleFormChange("readTime", e.target.value)
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
                <TextField
                  fullWidth
                  label="Author Name"
                  value={articleForm.author}
                  onChange={(e) =>
                    handleArticleFormChange("author", e.target.value)
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
                  <Upload size={16} className="text-[#E50914]" /> Select Article
                  Cover Image
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
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: -1.5,
                    mb: 2,
                  }}
                >
                  Max file size: 5MB
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }}>
                  OR
                </Divider>
                <TextField
                  fullWidth
                  label="Alternative Web Image URL"
                  placeholder="https://images.unsplash.com/..."
                  value={articleForm.imageUrl}
                  onChange={(e) =>
                    handleArticleFormChange("imageUrl", e.target.value)
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

              {articleForm.imageUrl && (
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
                    src={articleForm.imageUrl}
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
                multiline
                rows={2}
                label="Short Excerpt"
                placeholder="A brief 1-2 sentence summary..."
                margin="normal"
                required
                value={articleForm.excerpt}
                onChange={(e) =>
                  handleArticleFormChange("excerpt", e.target.value)
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
                multiline
                rows={8}
                label="Full Content (Supports Markdown)"
                placeholder="Write your full article content here..."
                margin="normal"
                required
                value={articleForm.content}
                onChange={(e) =>
                  handleArticleFormChange("content", e.target.value)
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
                onClick={() => setIsArticleModalOpen(false)}
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
                {editingArticleId ? "Update Article" : "Publish Article"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
