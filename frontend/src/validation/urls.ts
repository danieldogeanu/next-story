
/**
 * Validates an array of strings to determine if it follows the expected structure for a slug with optional pagination.
 *
 * The function checks if the input array represents a valid slug and page structure, where:
 * - If the array does not contain the keyword `page`, it should either be empty or contain a single non-numeric slug segment.
 * - If the array contains the keyword `page`, it should have an optional valid slug segment before `page` and a numeric page number after it.
 *
 * @param {string[] | undefined} slugArray - An array of strings representing a potential slug and page number structure.
 * @returns {boolean} Returns `true` if the slug array is valid according to the rules, otherwise `false`.
 *
 * @note If the array is empty or undefined, it will return true, as it represents a valid path.
 *
 * @example
 * // Example 1: Valid slug array without `page`.
 * isSlugArrayValid(['example-slug']); // Output: true
 *
 * // Example 2: Valid slug array with `page`.
 * isSlugArrayValid(['example-slug', 'page', '2']); // Output: true
 *
 * // Example 3: Valid slug array with `page`, without a `slug`.
 * isSlugArrayValid(['page', '2']); // Output: true
 *
 * // Example 4: Valid empty array or undefined.
 * isSlugArrayValid([]); || isSlugArrayValid(undefined); // Output: true
 *
 * // Example 5: Invalid slug array with extra segments.
 * isSlugArrayValid(['example-slug', 'page', '2', 'extra']); // Output: false
 *
 * // Example 6: Invalid slug array with a numeric slug.
 * isSlugArrayValid(['123']); // Output: false
 */
export function isSlugArrayValid(slugArray: string[] | undefined): boolean {
  const numberRegex = /^\d+$/;

  // Check if the slug is valid. There can be only one or no slug segment and it must be a string.
  const isValidSlug = (segments: string[]) => {
    switch(segments.length) {
      case 1: return !numberRegex.test(segments[0] as string);
      case 0: return true;
      default: return false;
    }
  };

  // Check if the array is undefined, null, or an empty array, which are considered valid.
  if (!Array.isArray(slugArray) || slugArray.length === 0) return true;

  // Check if `page` exists in the array.
  const pageIndex = slugArray.indexOf('page');

  if (pageIndex === -1) {
      // If `page` is not present and the array has only one segment, it's valid.
      return (slugArray.length === 1 && !numberRegex.test(slugArray[0] as string));
  } else {
      // If `page` is present, check the conditions:
      if (pageIndex >= 0 && pageIndex + 1 < slugArray.length) {
          const pageNumber = slugArray[pageIndex + 1];
          const slugSegments = slugArray.slice(0, pageIndex);
          const pageSegments = slugArray.slice(pageIndex + 1);

          // There can be one or no elements before the `page` and it must be a string.
          // The element after `page` must be a number, and there should be no extra elements.
          if (numberRegex.test(pageNumber)) {
            return (isValidSlug(slugSegments) && pageSegments.length === 1);
          }
      }

      // If any of the above conditions fail, it's invalid.
      return false;
  }
}
