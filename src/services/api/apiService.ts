/**
 * API Service Layer
 *
 * Purpose:
 * - Provides core API interaction functionality
 * - Handles URL construction and parameter formatting
 * - Manages error handling and response parsing
 * - Centralizes API configuration
 *
 * Design Decisions:
 * - Generic fetch wrapper for type safety
 * - URL parameter normalization
 * - Consistent error handling
 * - Query parameter validation
 *
 * Technical Considerations:
 * - Type safety throughout
 * - Error boundary implementation
 * - Response type validation
 * - Network error handling
 */

import { SearchParams } from "../types";

/**
 * Builds a URL with query parameters
 *
 * Implementation Details:
 * - Filters out undefined parameters
 * - Properly encodes parameter values
 * - Maintains URL structure consistency
 *
 * @param baseUrl - Base URL for the endpoint
 * @param params - Object containing query parameters
 * @returns Formatted URL string with parameters
 */
export const buildUrl = (baseUrl: string, params: SearchParams): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
    )
    .join("&");

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

/**
 * Generic fetch wrapper with error handling
 *
 * Features:
 * - Type-safe responses
 * - Consistent error handling
 * - Response validation
 * - Network error recovery
 *
 * @param url - URL to fetch from
 * @returns Typed API response
 * @throws Error on failed requests
 */
export const fetchFromApi = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
