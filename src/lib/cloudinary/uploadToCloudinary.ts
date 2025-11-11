/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  iCloudinaryUploadOptions,
  iCloudinaryUploadResult,
} from "@/interfaces/cloudinary.interfaces";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary";

/**
 * Upload single or multiple files to Cloudinary.
 * Handles images/videos, transformation, and partial failures safely.
 *
 * @param {File | File[]} files - Single File or Array of Files
 * @param {Object} options - Optional upload settings
 * @returns {Promise<iCloudinaryUploadResult[]>} - List of successful uploads
 */
export async function uploadToCloudinary(
  files: File | File[],
  options: iCloudinaryUploadOptions = {},
): Promise<iCloudinaryUploadResult[]> {
  const fileArray = Array.isArray(files) ? files : [files];

  // Validate allowed file types
  const validFiles = fileArray.filter(
    (file): file is File =>
      file instanceof File &&
      file.size > 0 &&
      ["image/", "video/"].some((type) => file.type.startsWith(type)),
  );

  // ⚠️ If no valid files, return empty array instead of throwing
  if (validFiles.length === 0) return [];

  // Convert files to upload promises
  const uploadPromises = validFiles.map(async (file) => {
    const ba = await file.arrayBuffer();
    const buffer = Buffer.from(ba);

    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    return new Promise<iCloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType as "image" | "video",
          folder: options.folder || "uploads",
          public_id: options.public_id,
          overwrite: options.overwrite ?? true,
          transformation: [
            {
              width: options.maxWidth || 1000,
              height: options.maxHeight || 1000,
              crop: "limit",
              quality: "auto",
              format: "auto",
            },
          ],
          ...options.cloudinaryOptions, // allow override
        },
        (error: any, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed: no result"));

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          });
        },
      );

      uploadStream.end(buffer);
    });
  });

  // Handle partial success using Promise.allSettled
  const results = await Promise.allSettled(uploadPromises);

  // Filter out only successful uploads
  const successfulUploads = results
    .filter(
      (r): r is PromiseFulfilledResult<iCloudinaryUploadResult> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value);

  // Optionally log failed uploads
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.warn(
      `⚠️ ${failed.length} upload(s) failed`,
      failed.map((r) => (r as PromiseRejectedResult).reason),
    );
  }

  return successfulUploads;
}
