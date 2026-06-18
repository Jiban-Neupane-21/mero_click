/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, VideoItem } from "../types";
import {  STUDIO_VIDEOS } from "../data/StudioVideos";
import {  PORTFOLIO_ITEMS, } from "../data/portfolioItems";



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

/**
 * Fallback LocalStorage utility to ensure full preview interactive functionality.
 * This ensures that a copy-paste client-side application does not crash in
 * the absence of initial database bindings, but persists flawlessly!
 */
const STORAGE_PORTFOLIO_KEY = "kathmandu_studio_portfolio";
const STORAGE_VIDEOS_KEY = "kathmandu_studio_videos";

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
};

initializeMockDatabaseIfNeeded();

export const apiService = {
  // --- PORTFOLIO ITEMS ---
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as PortfolioItem[];
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
        if (data && data.length > 0) return data as VideoItem[];
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
};
