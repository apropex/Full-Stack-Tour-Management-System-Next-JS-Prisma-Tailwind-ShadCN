/**
 * Extract Cloudinary public_id from any secure_url
 * Works with: transformations, versions, folders, auto format, etc.
 * @param url - Cloudinary secure_url
 * @returns public_id or null
 */

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Must be Cloudinary domain
    if (!parsedUrl.hostname.includes("cloudinary.com")) {
      return null;
    }

    const path = parsedUrl.pathname;
    const parts = path.split("/").filter(Boolean);

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    let startIndex = uploadIndex + 1;

    // Skip version (v1234567890)
    if (parts[startIndex]?.match(/^v\d+$/)) {
      startIndex++;
    }

    const remaining = parts.slice(startIndex);
    if (remaining.length === 0) return null;

    // Join all remaining parts — this is the full public_id (with or without extension)
    const publicIdWithExt = remaining.join("/");

    // Remove extension if present (e.g., .jpg, .webp)
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
