/* eslint-disable @typescript-eslint/no-explicit-any */

import cloudinary from "./cloudinary";
import { extractPublicIdFromUrl } from "./extractCloudinaryPublicIdFromUrl";

/**
 * Delete file(s) from Cloudinary by public_id
 * @param {string | string[]} publicIds
 * @returns {Promise<Object>}
 */

export async function deleteFromCloudinary(
  url: string | string[],
): Promise<any> {
  const urls = url ? (Array.isArray(url) ? url : [url]) : [];

  if (!urls.length) return null;

  const publicIds = urls
    .map(extractPublicIdFromUrl)
    .filter((id): id is string => !!id);

  if (!publicIds.length) return null;

  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    throw error;
  }
}
