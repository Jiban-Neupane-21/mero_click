/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export interface PhotoPreset {
  id: string;
  name: string;
  ratioWidth: number;
  ratioHeight: number;
  standardWidthPx: number;
  standardHeightPx: number;
  outputSizeText: string;
  description: string;
  maxFileSizeKb?: number;
  category: "Visa" | "Residency" | "Entrance" | "Portrait" | "Custom";
  recommendations: string[];
}

export interface StudioService {
  id: string;
  title: string;
  category:
    | "Portrait"
    | "Product"
    | "Event"
    | "Visa"
    | "Wedding"
    | "Videography"
    | "Photo Frame"
    | "Photography"
    | "Customized Gift"
    | "Photo Enhancement"
    | "Document Service";
  basePrice: string;
  duration: string;
  description: string;
  features: string[];
  rating: number;
  imageUrl: string;
}

export type ServiceMenuItem = {
  label: string;
  value: string;
  section: string;
  icon: React.ElementType;
};

export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | "Portrait"
    | "Product"
    | "Event"
    | "Studio"
    | "Visa"
    | "Wedding"
    | "Videography"
    | "Photo Frame";
  imageUrl: string;
  specLabel?: string;
  author?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "preparation" | "resizer" | "pricing";
}

export interface BookingDetails {
  serviceId: string;
  packageName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  addons: string[];
  totalPrice: number;
}

export interface EditAdjustment {
  brightness: number; // -100 to 100 (percentage adjustment)
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  rotation: number; // 0 to 270 (in steps of 90, or fine rotation)
  zoom: number; // 1 to 3
  x: number; // panning offset x
  y: number; // panning offset y
}
