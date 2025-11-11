/* eslint-disable @typescript-eslint/no-explicit-any */

export type iCloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: "video" | "image" | "auto" | "raw";
};

export type iCloudinaryUploadOptions = {
  folder?: string;
  public_id?: string;
  maxWidth?: number;
  maxHeight?: number;
  overwrite?: boolean;
  cloudinaryOptions?: Record<string, any>;
};
