/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

//

export interface iChildren {
  children: Readonly<React.ReactNode>;
}

export interface iResponse<T> {
  statusCode?: number;
  success: boolean;
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
  data: T;
}
