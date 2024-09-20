import { z } from 'zod';
import { sanitizeString, sanitizeStringArray } from '@/utils/sanitization';
import type { PageParams, SearchParams } from '@/types/page';


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

/**
 * Validates and sanitizes route parameters based on a schema.
 *
 * - First, it validates the input `params` against a schema.
 * - If the validation fails, logs errors and returns `null`.
 * - If validation succeeds, it sanitizes the `slug` array and validates again.
 *
 * @param {any} params - The route parameters to validate.
 * @returns {PageParams | null} The validated and sanitized parameters, or `null` if validation fails.
 */
export function validateParams(params: any): PageParams | null {
  const paramsSchema = z.object({
    slug: z.array(z.string().regex(
      /^[a-zA-Z0-9_-]+$/, 'Slug must contain only alphanumeric characters, dashes, or underscores.'
    )).optional().default([]),
  });

  const firstPass = paramsSchema.safeParse(params);
  if (!firstPass.success) {
    console.error('Invalid Params:', firstPass.error.errors);
    return null;
  }

  const sanitizedParams = {
    slug: firstPass.data.slug.map(sanitizeString),
  };

  const secondPass = paramsSchema.safeParse(sanitizedParams);
  if (!secondPass.success) console.error('Invalid Params:', secondPass.error.errors);
  return secondPass.success ? secondPass.data : null;
}

/**
 * Validates and sanitizes search parameters.
 *
 * This function validates the given search parameters against a schema, ensuring
 * that each key is a string and each value is either a string, an array of strings,
 * or `undefined`. The function also sanitizes the keys and values to ensure they are clean.
 *
 * @param {any} searchParams - The search parameters to validate and sanitize.
 * - Keys should be strings.
 * - Values should be strings, arrays of strings, or `undefined`.
 *
 * @returns {SearchParams | null}
 * - Returns sanitized and validated search parameters if valid.
 * - Returns `null` if the validation fails.
 *
 * ### Process:
 * - First, the input is validated against the schema.
 * - If valid, keys and values are sanitized:
 *   - Keys are sanitized to ensure they are strings.
 *   - Values can be either:
 *     - A sanitized string,
 *     - A sanitized array of strings (empty strings allowed),
 *     - `undefined`.
 * - If any invalid search parameters are found, the function logs an error and returns `null`.
 * - If valid after sanitization, the function returns the sanitized search parameters.
 */
export function validateSearchParams(searchParams: any): SearchParams | null {
  const searchParamsSchema = z.record(z.union([z.string(), z.array(z.string()), z.undefined()]));

  const firstPass = searchParamsSchema.safeParse(searchParams);
  if (!firstPass.success) {
    console.error('Invalid Search Params:', firstPass.error.errors);
    return null;
  }

  const sanitizedEntries = Array.from(Object.entries(searchParams)).map(([key, value]) => {
    const sanitizedKey = sanitizeString(key);

    if (typeof sanitizedKey === 'string') {
      if (Array.isArray(value)) {
        // Sanitize each item in the array, and allow empty strings.
        return [sanitizedKey, sanitizeStringArray(value)];
      } else if (typeof value === 'string') {
        // Allow empty strings to pass through.
        return [sanitizedKey, sanitizeString(value)];
      } else if (typeof value === 'undefined') {
        // Allow undefined values to pass through.
        return [sanitizedKey, undefined];
      }
    }
  }).filter(item => typeof item !== 'undefined');
  const sanitizedSearchParams = Object.fromEntries(sanitizedEntries) as SearchParams;

  const secondPass = searchParamsSchema.safeParse(sanitizedSearchParams);
  if (!secondPass.success) console.error('Invalid Search Params:', secondPass.error.errors);
  return secondPass.success ? secondPass.data : null;
}

/**
 * Validates the sorting parameter(s) to ensure they conform to specific schema rules and sanitizes the input.
 *
 * This function checks if the input sorting parameter(s) are valid according to a predefined schema.
 * It supports single or multiple sorting parameters and ensures each one follows a valid format.
 * It also sanitizes the input string(s) before validation.
 *
 * @param {string | string[] | undefined} param - The sorting parameter(s) to validate.
 * - Can be a single string, an array of strings, or `undefined`.
 * - Each sorting parameter must match one of the allowed properties
 *   or a property with an optional sorting direction (e.g., `name`, `createdAt:asc`, `updatedAt:desc`).
 * - Allowed properties: `name`, `title`, `createdAt`, `updatedAt`, `publishedAt`.
 *
 * @returns {string | string[] | null}
 * - Returns the validated and sanitized sorting parameter if valid.
 * - Returns an array of validated sorting parameters if multiple are provided.
 * - Returns `null` if no valid sorting parameters are found.
 *
 * ### Validation Logic:
 * - Each sorting parameter is sanitized before validation.
 * - Sorting parameter must either:
 *   - Be one of the allowed properties (`name`, `title`, `createdAt`, `updatedAt`, `publishedAt`), or
 *   - Be in the format `property:direction` where direction can be `asc` or `desc`.
 * - If multiple sorting parameters are provided in an array:
 *   - Each element is sanitized and validated individually.
 *   - Invalid elements are filtered out.
 *   - If no valid elements remain, `null` is returned.
 * - If a single string is provided, it is sanitized and validated. Returns the value if valid, otherwise `null`.
 */
export function validateSortParam(param: string | string[] | undefined): string | string[] | null {
  const sortPropsSchema = z.enum(['name', 'createdAt', 'updatedAt', 'title', 'publishedAt']);
  const sortCombinedSchema = z.string().regex(/^(name|createdAt|updatedAt|title|publishedAt)(:(asc|desc))?$/);
  const sortValueSchema = z.union([sortPropsSchema, sortCombinedSchema]);

  const validateSingleSort = (singleParam: string): string | null => {
    const sanitizedParam = sanitizeString(singleParam);
    const result = sortValueSchema.safeParse(sanitizedParam);
    return result.success ? result.data : null;
  };

  if (Array.isArray(param) && param.length !== 0) {
    const validatedArray = param.map(validateSingleSort).filter((item) => (typeof item === 'string'));
    return (validatedArray.length > 0) ? validatedArray : null;
  }

  if (typeof param === 'string') {
    return validateSingleSort(param);
  }

  return null;
}
