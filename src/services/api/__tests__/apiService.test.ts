import { buildUrl } from "../apiService";
import { SearchParams } from "../../types";

/**
 * Test suite for apiService
 * Tests URL construction and API interaction utilities
 */
describe("apiService", () => {
  /**
   * Test suite for buildUrl function
   * Verifies correct URL construction with various parameters
   */
  describe("buildUrl", () => {
    const baseUrl = "http://test.com/api";

    it("should return base URL when no params provided", () => {
      const params: SearchParams = {};
      expect(buildUrl(baseUrl, params)).toBe(baseUrl);
    });

    it("should add search query parameter", () => {
      const params: SearchParams = { query: "margarita" };
      expect(buildUrl(baseUrl, params)).toBe(`${baseUrl}?query=margarita`);
    });

    it("should add pagination parameters", () => {
      const params: SearchParams = { index: 10, limit: 20 };
      expect(buildUrl(baseUrl, params)).toBe(`${baseUrl}?index=10&limit=20`);
    });

    it("should add first letter parameter", () => {
      const params: SearchParams = { firstLetter: "m" };
      expect(buildUrl(baseUrl, params)).toBe(`${baseUrl}?firstLetter=m`);
    });

    it("should combine multiple parameters", () => {
      const params: SearchParams = {
        query: "margarita",
        index: 0,
        limit: 10,
      };
      expect(buildUrl(baseUrl, params)).toBe(
        `${baseUrl}?query=margarita&index=0&limit=10`
      );
    });
  });
});
