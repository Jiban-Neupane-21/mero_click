# Image Upload Guidelines & Limits

This document outlines the image size constraints and guidelines implemented in the Studio Mero Click Platform.

## 1. File Size Limits

### Frontend Constraints (Admin Panel)
- **Maximum File Size**: `5 MB`
- **Why?** Uploading excessively large files impacts both upload times and the end-user's page load speed. 5MB is a generous limit that allows for high-quality, web-optimized imagery without degrading frontend performance.
- **Enforcement**: This is validated in `src/admin/AdminPanel.tsx`. If a user attempts to upload an image exceeding 5MB, the upload is aborted and an error alert is shown.

### Backend Constraints (Supabase Storage)
- **Default Storage Limit**: The Supabase platform typically imposes a maximum file size depending on your specific Bucket settings (often 50MB on the free tier by default). 
- **Configuration**: If you need to change absolute backend limits or restrict file types at the infrastructure level, you must configure the `portfolio-images` bucket settings directly in your Supabase Dashboard under Storage -> Policies & Configuration.

## 2. Recommended Formats & Dimensions

To ensure the web platform remains user-friendly and aesthetically pleasing:

- **Formats Allowed**: `.jpg`, `.jpeg`, `.png`, `.webp` (WebP is highly recommended for faster load times).
- **Portfolio Images**: Recommended resolution is `1920x1080` (16:9) or `1080x1080` (1:1) depending on the orientation. 
- **Studio Services & Promos**: Banners look best when exported at standard HD width (`1920px`) and optimized via tools like TinyPNG before upload.
- **Learning Articles Cover**: Usually displayed in a landscape format. Ideal dimensions are `1200x630` pixels to look great on web and social media sharing.

## 3. Best Practices for Admins

1. **Optimize Before Uploading**: Always resize raw RAW or TIFF files to standard web formats (JPG/WEBP) before trying to upload them through the Admin platform.
2. **Compress**: Use tools like TinyPNG or Squoosh to compress images. A visually lossless image can often be compressed to under 500KB.
3. **Naming**: Use descriptive filenames for better SEO, though the system appends a random hash to ensure no collisions in the database.
