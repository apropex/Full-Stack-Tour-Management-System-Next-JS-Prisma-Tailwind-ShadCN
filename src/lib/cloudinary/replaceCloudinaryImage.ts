"use server";

import {
  iCloudinaryUploadOptions,
  iCloudinaryUploadResult,
} from "@/interfaces/cloudinary.interfaces";
import { deleteFromCloudinary } from "./deleteFromCloudinary";
import { uploadToCloudinary } from "./uploadToCloudinary";

/**
 * Safely delete the old Cloudinary image (if any)
 * and upload a new one (e.g. for profile updates).
 *
 * - Delete failure won't stop upload
 * - Returns the new upload result
 *
 * @param {string | null} oldUrl - Previous Cloudinary file URL (optional)
 * @param {File} newFile - New file to upload
 * @param {Object} options - Upload settings
 * @returns {Promise<iCloudinaryUploadResult | null>}
 */
export async function replaceCloudinaryImage(
  oldUrl: string | null,
  newFile: File,
  options: iCloudinaryUploadOptions = {},
): Promise<iCloudinaryUploadResult | null> {
  // Step 1: Try deleting old image (ignore failure)
  if (oldUrl) {
    try {
      await deleteFromCloudinary(oldUrl);
    } catch (error) {
      console.warn("⚠️ Failed to delete old Cloudinary image:", error);
      // continue regardless
    }
  }

  // Step 2: Upload the new image
  try {
    const results = await uploadToCloudinary(newFile, {
      ...options,
      folder: options.folder || "users",
    });

    if (!results.length) {
      console.warn("⚠️ Cloudinary upload returned empty result");
      return null;
    }

    return results[0];
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw error;
  }
}
