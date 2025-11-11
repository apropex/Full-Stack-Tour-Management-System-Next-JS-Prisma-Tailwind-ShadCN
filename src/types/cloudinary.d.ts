/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "cloudinary" {
  export interface UploadApiResponse {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    format?: string;
    [key: string]: any;
  }
}
