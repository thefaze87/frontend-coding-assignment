/**
 * TypeScript Declaration File for Image Assets
 *
 * This file is needed to help TypeScript understand how to handle
 * imported image files like SVGs. Without these declarations,
 * TypeScript would show errors when trying to import SVG files
 * directly into our React components.
 *
 * Example usage:
 * import searchIcon from "./assets/icons/Search-Icon.svg";
 * <img src={searchIcon} alt="search" />
 */

declare module "*.svg" {
  const content: string;
  export default content;
}
