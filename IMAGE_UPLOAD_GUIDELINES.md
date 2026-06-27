# Image Upload Guidelines for Admin

This document provides the recommended image sizes and aspect ratios for different sections of the website. Following these guidelines ensures that images fit cleanly into their containers without excessive cropping or distortion, maintaining a premium look.

## 1. Hero Ads & Special Offers (`Hero.tsx`)
This section features a vertical card that showcases special offers or dynamic ads.

*   **Target Aspect Ratio:** **4:5** (Standard Portrait) or **9:16** (Vertical/Story size)
*   **Recommended Resolution:** 
    *   **1080 x 1350 pixels** (for 4:5 ratio)
    *   **1080 x 1920 pixels** (for 9:16 ratio)
*   **Why?** The container has a maximum width of 440px and a minimum height of 540px. A vertical portrait image fits this space best. The `object-fit: cover` property is used, so keep the main subject centered to avoid it being cropped out on different screen sizes.

## 2. Service Catalog (`ServiceCatalog.tsx`)
The service cards have a responsive layout. On mobile devices, the image spans the full width and is 240px tall (a wide banner shape). On desktop devices, the image takes up the left 40% of the card (often appearing square or slightly portrait depending on text length).

*   **Target Aspect Ratio:** **1:1** (Square) or **4:3** (Standard Landscape)
*   **Recommended Resolution:**
    *   **1080 x 1080 pixels** (for 1:1 Square) 
    *   **1200 x 900 pixels** (for 4:3 Landscape)
*   **Why?** A 1:1 square is highly recommended as a safe middle ground. The `object-fit: cover` styling will automatically crop the top and bottom on mobile, and the left and right on desktop. **Important:** Always ensure the main subject or focus of the image is perfectly centered so it remains visible regardless of how it gets cropped on different devices.

## 3. Portfolio Grid (`PortfolioGrid.tsx`)
The portfolio images are displayed in a clean grid with a fixed aspect ratio.

*   **Target Aspect Ratio:** **4:5** (Portrait)
*   **Recommended Resolution:** **1080 x 1350 pixels** (or a minimum of 800 x 1000 pixels)
*   **Why?** The code explicitly enforces an `aspectRatio: "4/5"` for these grid items. Uploading images that already match this ratio ensures exactly 0% of the image is cropped unexpectedly, giving you full control over what the user sees.

---

### General Best Practices for Image Uploads:
*   **Format:** Use `.jpg` or `.webp` for photographs to keep file sizes small while maintaining quality. Use `.png` only if you need a transparent background.
*   **File Size:** Compress images before uploading (aim for under **500KB - 1MB** per image) to ensure the website loads lightning fast.
*   **Focus Point:** Because the website uses `object-fit: cover` to make the design fully responsive across mobile and desktop, the edges of images might get cropped. **Always keep the most important part of the photo (like a person's face or the main subject) in the direct center of the image.**
