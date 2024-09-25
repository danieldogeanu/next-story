import { z as val } from 'zod';
import { sanitizeString, sanitizeStringArray } from '@/utils/sanitization';
import type { ArticleParams, PageParams, SearchParams } from '@/types/page';


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
 * Validates and sanitizes the route parameters for a page.
 *
 * This function ensures that the provided parameters conform to the schema rules:
 * - `slug` must be an array of strings containing only alphanumeric characters, dashes, or underscores.
 * - The `slug` array is optional and defaults to an empty array if not provided.
 *
 * The function performs a two-pass validation:
 * - First pass: Validates the raw input.
 * - Second pass: Sanitizes the `slug` array and validates it again.
 *
 * @param {any} params - The raw parameters to validate, typically received from the route.
 * @returns {PageParams | null}
 * - Returns the validated and sanitized `PageParams` object if valid.
 * - Returns `null` if the validation fails.
 */
export function validatePageParams(params: any): PageParams | null {
  const paramsSchema = val.object({
    slug: val.array(val.string().regex(
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
 * Validates and sanitizes the route parameters for an article.
 *
 * This function ensures that the provided parameters conform to the schema rules:
 * - `created` must be a numeric string representing Unix Time.
 * - `slug` must contain only alphanumeric characters, dashes, or underscores.
 *
 * The function performs a two-pass validation:
 * - First pass: Validates the raw input.
 * - Second pass: Sanitizes the input and validates it again.
 *
 * @param {any} params - The raw parameters to validate, typically received from the route.
 * @returns {ArticleParams | null}
 * - Returns the validated and sanitized `ArticleParams` object if valid.
 * - Returns `null` if the validation fails.
 */
export function validateArticleParams(params: any): ArticleParams | null {
  const paramsSchema = val.object({
    created: val.string().regex(
      /^\d+$/, 'Created must be a numeric string representing Unix Time.'
    ),
    slug: val.string().regex(
      /^[a-zA-Z0-9_-]+$/, 'Slug must contain only alphanumeric characters, dashes, or underscores.'
    ),
  });

  const firstPass = paramsSchema.safeParse(params);
  if (!firstPass.success) {
    console.error('Invalid Params:', firstPass.error.errors);
    return null;
  }

  const sanitizedParams = {
    created: sanitizeString(firstPass.data.created),
    slug: sanitizeString(firstPass.data.slug),
  };

  const secondPass = paramsSchema.safeParse(sanitizedParams);
  if (!secondPass.success) {
    console.error('Invalid Params:', secondPass.error.errors);
  }
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
  const searchParamsSchema = val.record(val.union([val.string(), val.array(val.string()), val.undefined()]));

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
 * Validates and sanitizes the sorting parameter(s) to ensure they conform to specific schema rules.
 *
 * This function checks if the input sorting parameter(s) are valid according to a predefined or customized schema.
 * It supports single or multiple sorting parameters and ensures each one follows a valid format.
 * Additionally, it sanitizes the input string(s) before validation.
 *
 * @param {string | string[] | undefined} param - The sorting parameter(s) to validate.
 * - Can be a single string, an array of strings, or `undefined`.
 * - Each sorting parameter must match one of the allowed properties or a property with an optional sorting direction
 *   (e.g., `id`, `title`, `createdAt:asc`, `updatedAt:desc`).
 * - Allowed properties are provided through the `allowed` parameter or default to: `id`, `createdAt`, `updatedAt`.
 *
 * @param {string[]} [allowed=[]] - Additional allowed properties for sorting.
 * - These are combined with the default allowed properties (`id`, `createdAt`, `updatedAt`).
 *
 * @returns {string | string[] | null}
 * - Returns the validated and sanitized sorting parameter if valid.
 * - Returns an array of validated sorting parameters if multiple are provided.
 * - Returns `null` if no valid sorting parameters are found.
 *
 * ### Validation Logic:
 * - Allowed properties are merged with default allowed values (`id`, `createdAt`, `updatedAt`) and sanitized.
 * - Sorting parameters must either:
 *   - Be one of the allowed properties, or
 *   - Be in the format `property:direction` where the direction can be `asc` or `desc`.
 * - If multiple sorting parameters are provided in an array:
 *   - Each element is sanitized and validated individually.
 *   - Invalid elements are filtered out.
 *   - If no valid elements remain, `null` is returned.
 * - If a single string is provided, it is sanitized and validated. Returns the value if valid, otherwise `null`.
 */
export function validateSortParam(param: string | string[] | undefined, allowed: string[] = []): string | string[] | null {
  // Default allowed values.
  const defaultAllowed = ['id', 'createdAt', 'updatedAt'];

  // Merge allowed with default values and remove duplicates.
  const mergedAllowed = Array.from(new Set([...allowed, ...defaultAllowed]));

  // Create a regex pattern from the merged allowed array.
  const allowedPropsPattern = mergedAllowed.map(prop => prop.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&')).join('|');
  const sortCombinedRegex = new RegExp(`^(${allowedPropsPattern})(:(asc|desc))?$`);

  // Create Zod schemas with custom error messages.
  const sortPropsSchema = val.enum(mergedAllowed as [string, ...string[]], {
    errorMap: () => ({ message: `Sort parameter must be one of: ${mergedAllowed.join(', ')}.` }),
  });
  const sortCombinedSchema = val.string().regex(sortCombinedRegex, {
    message: `Sort parameter must match the format '<prop>:<asc|desc>', where prop is one of: ${mergedAllowed.join(', ')}.`,
  });
  const sortValueSchema = val.union([sortPropsSchema, sortCombinedSchema]);

  const validateSingleSort = (singleParam: string): string | null => {
    const sanitizedParam = sanitizeString(singleParam);
    const result = sortValueSchema.safeParse(sanitizedParam);
    if (!result.success) console.error(result.error.errors);
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
