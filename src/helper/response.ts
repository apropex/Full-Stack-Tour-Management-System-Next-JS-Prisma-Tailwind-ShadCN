/* eslint-disable @typescript-eslint/no-explicit-any */

export default function _response<T>(jsonData: {
  success?: boolean;
  message: string;
  meta?: {
    total_data?: number;
    filtered_data?: number;
    present_data?: number;
    total_page?: number;
    present_page?: number;
    skip?: number;
    limit?: number;
    options?: Record<string, any>;
  };
  data?: T | null | undefined;
}) {
  return {
    success: jsonData.success ?? true,
    message: jsonData.message,
    data: jsonData.data ?? null,
    meta: jsonData.meta ?? null,
  };
}
