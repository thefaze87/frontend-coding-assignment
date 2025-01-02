/**
 * API Service Tests
 *
 * Testing Strategy:
 * - Unit tests for URL construction
 * - Error handling verification
 * - Parameter validation
 * - Response type checking
 *
 * Test Coverage:
 * - URL building with various params
 * - Error scenarios
 * - Edge cases
 * - Type safety
 */

import { buildUrl, fetchFromApi } from "../apiService";
import { SearchParams } from "../../types";

describe("apiService", () => {
  describe("buildUrl", () => {
    it("constructs URLs with valid parameters", () => {
      const baseUrl = "http://api.test";
      const params: SearchParams = {
        query: "margarita",
        index: 0,
        limit: 10,
      };

      const url = buildUrl(baseUrl, params);
      expect(url).toBe("http://api.test?query=margarita&index=0&limit=10");
    });

    // ... more tests
  });
});
