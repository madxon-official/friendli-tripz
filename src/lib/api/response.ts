/**
 * Enterprise API Response Envelope Utility for Friendli Tripz
 * Standardizes API responses with consistent payload structure, metadata, and status codes.
 */

import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    timestamp: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId?: string;
    timestamp: string;
  };
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  meta: {
    requestId?: string;
    timestamp: string;
  };
}

export class ApiResponse {
  static success<T>(data: T, status = 200, requestId?: string): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    totalCount: number,
    status = 200,
    requestId?: string
  ): NextResponse<ApiPaginatedResponse<T>> {
    const totalPages = Math.ceil(totalCount / limit) || 1;
    return NextResponse.json(
      {
        success: true,
        data,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }

  static error(
    message: string,
    code = 'INTERNAL_SERVER_ERROR',
    status = 500,
    details?: unknown,
    requestId?: string
  ): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status }
    );
  }
}
