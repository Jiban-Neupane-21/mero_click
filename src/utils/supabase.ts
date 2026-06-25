/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, VideoItem, StudioService, OfferAd, TutorialVideo, LearningArticle } from "../types";
import { STUDIO_VIDEOS } from "../data/StudioVideos";
import { PORTFOLIO_ITEMS } from "../data/portfolioItems";
import { DEFAULT_OFFERS, STUDIO_SERVICES } from "../data";

const metaEnv = (import.meta as any).env || {};
const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL || "https://uaxiuvlyzztdmuesqsod.supabase.co";
const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Js2eY3ap51wNR_yOdrGcHA_MY4KvmgF";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl !== "YOUR_SUPABASE_URL" &&
  supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY";

// Initialize Supabase Client ONLY if credentials exist to avoid console crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;


const DEFAULT_TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: 'tv1',
    title: 'How to Align & Capture Biometric Passport Photos at Home',
    youtubeId: '9vY7XfNl8C0',
    category: 'Biometrics',
    duration: '8:45',
    description: 'Learn the core guidelines for white backgrounds, facial ratios, shadow elimination, and clothing choices required for official passport photos.',
    publishedAt: '2026-06-20'
  },
  {
    id: 'tv2',
    title: 'Posing Masterclass: 5 Poses for Executive Corporate Portraits',
    youtubeId: 'fJv8O9V96Yw',
    category: 'Posing',
    duration: '12:30',
    description: 'Perfect your posture, head tilt, and shoulder angle for business headshots. Helpful guidelines for professionals and individuals.',
    publishedAt: '2026-06-18'
  },
  {
    id: 'tv3',
    title: 'Choosing the Right Photo Frame: Teak Wood vs Composite Glass',
    youtubeId: 'OndV_GszBvs',
    category: 'Framing',
    duration: '6:15',
    description: 'A deep dive into framing materials, UV protection glass, and selecting backing board mounts to preserve prints and portraits forever.',
    publishedAt: '2026-06-10'
  }
];

const DEFAULT_LEARNING_ARTICLES: LearningArticle[] = [
  {
    id: 'la1',
    title: '5 Common Mistakes to Avoid in US Visa & DV Lottery Photos',
    category: 'Biometrics',
    excerpt: 'An essential checklist detailing background specs, expression rules, and resolution requirements for US State Department submittals.',
    content: `When submitting photos for the US Visa or Diversity Visa (DV) Lottery, even a minor mistake can lead to an immediate rejection. Here are the 5 most common errors we see and how to avoid them:

### 1. Wearing Eyeglasses
Starting in 2016, the US Department of State has strictly forbidden eyeglasses in passport and visa photos. Unless you have a rare medical emergency documented by a physician, take off your glasses.

### 2. Incorrect Face Scaling
Your face (from chin to top of hair) must take up exactly 50% to 69% of the photo's overall height. If it's too close or too far away, automated biometric checkers will discard the application.

### 3. Shadows on Face or Background
Uneven lighting creates shadows behind the ears or on the white background. Secure soft, dual light sources from 45-degree angles to maintain absolute neutral lighting.

### 4. Clothing Blending with Background
Since the background must be white or off-white, avoid wearing white or light cream shirts. Choose dark colors like black, navy blue, or charcoal gray to create a sharp contrast.

### 5. Non-neutral Facial Expressions
No smiling, showing teeth, squinting, or frowning. Maintain a neutral expression with both eyes open, looking directly at the camera.`,
    readTime: '4 mins read',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    publishedAt: '2026-06-22',
    author: 'Rohan Adhikari (Biometrics Lead)'
  },
  {
    id: 'la2',
    title: 'Preparing for Your Executive Portrait: The Styling Guide',
    category: 'Posing',
    excerpt: 'Dress for authority. Discover the best colors, fabrics, and styling practices to ensure your professional business profile looks outstanding.',
    content: `Your corporate headshot is often your first impression on clients, investors, and recruiters. Here is how to style yourself for a commanding, professional presence:

### 1. Color Selections
Solid, rich mid-tones to dark tones work best. Classic options include:
- **Navy Blue**: Signals trustworthiness, calmness, and analytical depth.
- **Charcoal Gray**: Projects sophisticated authority and versatility.
- **Deep Emerald or Plum**: Provides elegant brand character without distraction.
Avoid pure white as the main outer layer, as well as neon shades.

### 2. Fabric Choices and Patterns
Select structured jackets, blazers, and shirts made of high-quality fabrics that resist wrinkling. Solid colors are strongly preferred over fine stripes or checker patterns, which can cause a distracting "moiré effect" in digital screens.

### 3. Jewelry and Accessories
Keep accessories minimal. Sleek watches, elegant studs, or a simple tie clip are perfect. Avoid large reflective necklaces or dangling earrings that pull the focus away from your face and eyes.

### 4. Grooming and Makeup
- **Hydration**: Drink plenty of water the night before to ensure healthy skin.
- **Matte Finishes**: Use light translucent powder to prevent shine under strong studio strobe lights.
- **Hair**: Style hair in your normal day-to-day fashion. Avoid major haircut changes right before the shoot.`,
    readTime: '6 mins read',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    publishedAt: '2026-06-19',
    author: 'Prerna Shrestha (Lead Portraitist)'
  }
];

/**
 * Fallback LocalStorage utility to ensure full preview interactive functionality.
 * This ensures that a copy-paste client-side application does not crash in
 * the absence of initial database bindings, but persists flawlessly!
 */
const STORAGE_PORTFOLIO_KEY = "kathmandu_studio_portfolio";
const STORAGE_VIDEOS_KEY = "kathmandu_studio_videos";
const STORAGE_SERVICES_KEY = "kathmandu_studio_services";
const STORAGE_OFFERS_KEY = 'kathmandu_studio_offers';
const STORAGE_TUTORIALS_KEY = 'kathmandu_studio_tutorials';
const STORAGE_ARTICLES_KEY = 'kathmandu_studio_articles';

const initializeMockDatabaseIfNeeded = () => {
  if (!localStorage.getItem(STORAGE_PORTFOLIO_KEY)) {
    localStorage.setItem(
      STORAGE_PORTFOLIO_KEY,
      JSON.stringify(PORTFOLIO_ITEMS),
    );
  }
  if (!localStorage.getItem(STORAGE_VIDEOS_KEY)) {
    localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(STUDIO_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_SERVICES_KEY)) {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(STUDIO_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_OFFERS_KEY)) {
    localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(DEFAULT_OFFERS));
  }
  if (!localStorage.getItem(STORAGE_TUTORIALS_KEY)) {
    localStorage.setItem(STORAGE_TUTORIALS_KEY, JSON.stringify(DEFAULT_TUTORIAL_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_ARTICLES_KEY)) {
    localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(DEFAULT_LEARNING_ARTICLES));
  }
};

initializeMockDatabaseIfNeeded();

export const apiService = {
  // --- FILE UPLOAD ---
  async uploadImage(file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(filePath);
        return data.publicUrl;
      } catch (err) {
        console.warn("Supabase storage upload error:", err);
        throw err;
      }
    }

    // Fallback to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // --- PORTFOLIO ITEMS ---
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        // Return data even if empty to prevent showing hardcoded fallbacks
        if (data) return data as PortfolioItem[];
      } catch (err) {
        console.warn(
          "Supabase portfolio fetch error, falling back to localStorage:",
          err,
        );
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_PORTFOLIO_KEY);
    return stored ? JSON.parse(stored) : PORTFOLIO_ITEMS;
  },

  async savePortfolioItem(
    item: Omit<PortfolioItem, "id"> & { id?: string },
  ): Promise<PortfolioItem> {
    const newItem: PortfolioItem = {
      id: item.id || `p_${Date.now()}`,
      title: item.title,
      category: item.category as any,
      imageUrl: item.imageUrl,
      specLabel: item.specLabel || "Custom Added Image",
      author: item.author || "Studio Editor",
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .upsert(newItem)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as PortfolioItem;
      } catch (err) {
        console.warn(
          "Supabase portfolio insert/update error, falling back to localStorage:",
          err,
        );
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_PORTFOLIO_KEY);
    const list: PortfolioItem[] = stored
      ? JSON.parse(stored)
      : [...PORTFOLIO_ITEMS];
    const index = list.findIndex((x) => x.id === newItem.id);
    if (index !== -1) {
      list[index] = newItem;
    } else {
      list.unshift(newItem);
    }
    localStorage.setItem(STORAGE_PORTFOLIO_KEY, JSON.stringify(list));
    return newItem;
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("portfolio")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.warn(
          "Supabase portfolio delete error, falling back to localStorage:",
          err,
        );
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_PORTFOLIO_KEY);
    if (stored) {
      const list: PortfolioItem[] = JSON.parse(stored);
      const filtered = list.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_PORTFOLIO_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // --- VIDEO ITEMS ---
  async getVideoItems(): Promise<VideoItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        if (data) return data as VideoItem[];
      } catch (err) {
        console.warn(
          "Supabase video fetch error, falling back to localStorage:",
          err,
        );
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_VIDEOS_KEY);
    return stored ? JSON.parse(stored) : STUDIO_VIDEOS;
  },

  async saveVideoItem(
    video: Omit<VideoItem, "id"> & { id?: string },
  ): Promise<VideoItem> {
    const newVideo: VideoItem = {
      id: video.id || `v_${Date.now()}`,
      title: video.title,
      youtubeId: video.youtubeId,
      category: video.category as any,
      duration: video.duration || "3:00",
      description: video.description || "Custom Added Video Link",
      uploadDate:
        video.uploadDate ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("videos")
          .upsert(newVideo)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as VideoItem;
      } catch (err) {
        console.warn(
          "Supabase video insert/update error, falling back to localStorage:",
          err,
        );
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_VIDEOS_KEY);
    const list: VideoItem[] = stored ? JSON.parse(stored) : [...STUDIO_VIDEOS];
    const index = list.findIndex((x) => x.id === newVideo.id);
    if (index !== -1) {
      list[index] = newVideo;
    } else {
      list.unshift(newVideo);
    }
    localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(list));
    return newVideo;
  },

  async deleteVideoItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("videos").delete().eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.warn(
          "Supabase video delete error, falling back to localStorage:",
          err,
        );
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_VIDEOS_KEY);
    if (stored) {
      const list: VideoItem[] = JSON.parse(stored);
      const filtered = list.filter((v) => v.id !== id);
      localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // --- STUDIO SERVICES ---
  async getServices(): Promise<StudioService[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        // Return data even if empty to prevent showing hardcoded fallbacks
        if (data) return data as StudioService[];
      } catch (err) {
        console.warn('Supabase services fetch error, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    return stored ? JSON.parse(stored) : STUDIO_SERVICES;
  },

  async saveServiceItem(service: Omit<StudioService, 'id'> & { id?: string }): Promise<StudioService> {
    const newService: StudioService = {
      id: service.id || `s_${Date.now()}`,
      title: service.title,
      category: service.category,
      basePrice: service.basePrice,
      duration: service.duration,
      description: service.description,
      features: service.features || [],
      rating: service.rating ?? 5.0,
      imageUrl: service.imageUrl
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .upsert(newService)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as StudioService;
      } catch (err) {
        console.warn('Supabase service insert/update error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    const list: StudioService[] = stored ? JSON.parse(stored) : [...STUDIO_SERVICES];
    const index = list.findIndex(x => x.id === newService.id);
    if (index !== -1) {
      list[index] = newService;
    } else {
      list.push(newService);
    }
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(list));
    return newService;
  },

  async deleteServiceItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase service delete error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    if (stored) {
      const list: StudioService[] = JSON.parse(stored);
      const filtered = list.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },
  // --- SPECIAL OFFERS & ADS ---
  async getOffers(): Promise<OfferAd[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) return data as OfferAd[];
      } catch (err) {
        console.warn('Supabase offers fetch error, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_OFFERS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_OFFERS;
  },

  async saveOfferItem(offer: Omit<OfferAd, 'id'> & { id?: string }): Promise<OfferAd> {
    const newOffer: OfferAd = {
      id: offer.id || `o_${Date.now()}`,
      badge: offer.badge,
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      image: offer.image,
      validUntil: offer.validUntil,
      actionText: offer.actionText,
      targetCategory: offer.targetCategory,
      accentColor: offer.accentColor || '#E50914'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .upsert(newOffer)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as OfferAd;
      } catch (err) {
        console.warn('Supabase offers insert/update error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_OFFERS_KEY);
    const list: OfferAd[] = stored ? JSON.parse(stored) : [...DEFAULT_OFFERS];
    const index = list.findIndex(x => x.id === newOffer.id);
    if (index !== -1) {
      list[index] = newOffer;
    } else {
      list.push(newOffer);
    }
    localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(list));
    return newOffer;
  },

  async deleteOfferItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('offers')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase offer delete error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_OFFERS_KEY);
    if (stored) {
      const list: OfferAd[] = JSON.parse(stored);
      const filtered = list.filter(o => o.id !== id);
      localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // --- TUTORIAL VIDEOS ---
  async getTutorialVideos(): Promise<TutorialVideo[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select('*')
          .order('id', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as TutorialVideo[];
      } catch (err) {
        console.warn('Supabase tutorials fetch error, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_TUTORIALS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TUTORIAL_VIDEOS;
  },

  async saveTutorialVideo(video: Omit<TutorialVideo, 'id'> & { id?: string }): Promise<TutorialVideo> {
    const newVideo: TutorialVideo = {
      id: video.id || `tv_${Date.now()}`,
      title: video.title,
      youtubeId: video.youtubeId,
      category: video.category,
      duration: video.duration || '5:00',
      description: video.description,
      publishedAt: video.publishedAt || new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('tutorials')
          .upsert(newVideo)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as TutorialVideo;
      } catch (err) {
        console.warn('Supabase tutorials insert/update error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_TUTORIALS_KEY);
    const list: TutorialVideo[] = stored ? JSON.parse(stored) : [...DEFAULT_TUTORIAL_VIDEOS];
    const index = list.findIndex(x => x.id === newVideo.id);
    if (index !== -1) {
      list[index] = newVideo;
    } else {
      list.unshift(newVideo);
    }
    localStorage.setItem(STORAGE_TUTORIALS_KEY, JSON.stringify(list));
    return newVideo;
  },

  async deleteTutorialVideo(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('tutorials')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase tutorial delete error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_TUTORIALS_KEY);
    if (stored) {
      const list: TutorialVideo[] = JSON.parse(stored);
      const filtered = list.filter(v => v.id !== id);
      localStorage.setItem(STORAGE_TUTORIALS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // --- LEARNING ARTICLES ---
  async getLearningArticles(): Promise<LearningArticle[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('id', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as LearningArticle[];
      } catch (err) {
        console.warn('Supabase articles fetch error, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_LEARNING_ARTICLES;
  },

  async saveLearningArticle(article: Omit<LearningArticle, 'id'> & { id?: string }): Promise<LearningArticle> {
    const newArticle: LearningArticle = {
      id: article.id || `la_${Date.now()}`,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      readTime: article.readTime || '5 mins read',
      imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600',
      publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
      author: article.author || 'Studio Specialist'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .upsert(newArticle)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as LearningArticle;
      } catch (err) {
        console.warn('Supabase articles insert/update error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_ARTICLES_KEY);
    const list: LearningArticle[] = stored ? JSON.parse(stored) : [...DEFAULT_LEARNING_ARTICLES];
    const index = list.findIndex(x => x.id === newArticle.id);
    if (index !== -1) {
      list[index] = newArticle;
    } else {
      list.unshift(newArticle);
    }
    localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(list));
    return newArticle;
  },

  async deleteLearningArticle(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase article delete error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_ARTICLES_KEY);
    if (stored) {
      const list: LearningArticle[] = JSON.parse(stored);
      const filtered = list.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
};


