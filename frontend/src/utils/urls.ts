import mime from 'mime';
import path from 'path';
import { z as val } from 'zod';
import { notFound, permanentRedirect, redirect, RedirectType } from 'next/navigation';
import { getBackEndURL, getFrontEndURL, getHostname } from '@/utils/client/env';
import { isSlugArrayValid } from '@/validation/urls';
import { convertToUnixTime } from '@/utils/date';


/**
 * Checks if a given URL is an absolute URL.
 *
 * @param {string | undefined} url - The URL to check.
 * @returns {boolean} True if the URL is absolute, otherwise false.
 */
export function isAbsoluteUrl(url: string | undefined): boolean {
  if (typeof url === 'string') {
    return url.toLowerCase().startsWith('http') || url.toLowerCase().startsWith('https');
  } else return false;
}

/**
 * Checks if a given URL is a relative URL.
 *
 * @param {string | undefined} url - The URL to check.
 * @returns {boolean} True if the URL is relative, otherwise false.
 */
export function isRelativeUrl(url: string | undefined): boolean {
  if (typeof url === 'string') {
    return !isAbsoluteUrl(url) && url.toLowerCase().startsWith('/');
  } else return false;
}

/**
 * Determines if a given URL is external compared to the current hostname.
 *
 * @param {string | undefined} url - The URL to check.
 * @returns {boolean} True if the URL is external, otherwise false.
 */
export function isExternalUrl(url: string | undefined): boolean {
  const currentHostname = getHostname();

  try {
    if (typeof url === 'string') {
      const parsedHostname = new URL(url).hostname.replace('www.', '');
      return parsedHostname !== currentHostname;
    } else return false;
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves the relative URL from an absolute URL or returns the given URL if it's already relative.
 *
 * @param {string | undefined} url - The URL to be processed. Can be an absolute or relative URL.
 * @returns {string | undefined} The relative URL if the input is an absolute URL, or the original URL if it is already relative.
 * @note It returns `undefined` if the input URL is invalid or not provided.
 */
export function getRelativeUrl(url: string | undefined): string | undefined {
  try {
    if (typeof url === 'string') {
      if (isAbsoluteUrl(url)) {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      } else return url;
    }
  } catch (e) { return; }
}

/**
 * Extracts the hostname from a given URL, removing 'www.' if present.
 *
 * @param {string | undefined} url - The URL from which to extract the hostname.
 * @returns {string | undefined} The hostname without 'www.' or undefined if the URL is invalid.
 */
export function getHostFromUrl(url: string | undefined): string | undefined {
  try {
    if (typeof url === 'string') {
      return new URL(url).hostname.replace('www.', '');
    }
  } catch (e) { return; }
}

/**
 * Retrieves the MIME type from a given URL.
 *
 * @param {string | undefined} url - The URL from which to extract the MIME type.
 * @returns {string | undefined} The MIME type of the URL, or undefined if it cannot be determined.
 */
export function getMimeTypeFromUrl(url: string | undefined): string | undefined {
  if (typeof url === 'string') return mime.getType(url) ?? undefined;
}

/**
 * Retrieves the file extension from a given URL.
 *
 * @param {string | undefined} url - The URL from which to extract the file extension.
 * @returns {string | undefined} The file extension of the URL, or undefined if it cannot be determined.
 */
export function getExtensionFromUrl(url: string | undefined): string | undefined {
  if (typeof url === 'string') return mime.getExtension(url) ?? undefined;
}

/**
 * Constructs the full URL for a given page slug, optionally relative to a root page.
 *
 * @param {string | undefined} pageSlug - The slug of the page. Should not be an absolute URL.
 * @param {string | undefined} [rootPage] - The root page to which the slug is relative. Should not be an absolute URL.
 * @returns {string | undefined} The fully constructed URL for the given page slug.
 * @note If either `pageSlug` or `rootPage` is an absolute URL, it returns `undefined`.
 */
export function getPageUrl(pageSlug: string | undefined, rootPage?: string | undefined): string | undefined {
  if (typeof pageSlug === 'string' && !isAbsoluteUrl(pageSlug)) {
    if (typeof rootPage === 'string' && !isAbsoluteUrl(rootPage)) {
      return new URL(path.join(rootPage, pageSlug), getFrontEndURL()).href;
    }
    return new URL(pageSlug, getFrontEndURL()).href;
  }
}

/**
 * Constructs the full URL for an article based on its creation date and slug.
 *
 * @param {string | Date | undefined} created - The creation date of the article, in ISO format or as a Date object.
 * @param {string | undefined} slug - The slug of the article.
 * @returns {string | undefined} The fully constructed URL for the given article. Returns `undefined` if the `created` date or `slug` is invalid or missing.
 */
export function getArticleUrl(created: string | Date | undefined, slug: string | undefined): string | undefined {
  if (typeof created !== 'undefined' && typeof slug !== 'undefined') {
    const dateTimeSchema = val.string().datetime();

    if (dateTimeSchema.safeParse(created).success && typeof slug === 'string') {
      const articlePath = path.join('/articles', convertToUnixTime(created), slug);
      return new URL(articlePath, getFrontEndURL()).href;
    }
  }
}

/**
 * Constructs the full URL for a given file path based on its source (frontend or backend).
 *
 * @param {string | undefined} url - The relative URL path of the file.
 * @param {'frontend' | 'backend'} [source='backend'] - The source of the URL, either 'frontend' or 'backend'. Defaults to 'backend'.
 * @returns {string | undefined} The fully constructed URL for the given file. Returns `undefined` if the `url` is invalid or not provided.
 */
export function getFileURL(url: string | undefined, source: 'frontend' | 'backend' = 'backend'): string | undefined {
  const relativeUrlRegex = /^\/(?!\/|[a-zA-Z0-9_-]+:).*\.[a-z]+$/i;

  if (typeof url === 'string' && typeof source === 'string' && relativeUrlRegex.test(url)) {
    if (source === 'frontend') return new URL(url, getFrontEndURL()).href;
    return new URL(url, getBackEndURL()).href;
  }
}

/**
 * Extracts the slug and page number from an array of strings based on the presence of the `page` keyword.
 *
 * The function looks for the keyword `page` in the provided array. If found, it considers the element immediately
 * before `page` as the slug and the element immediately after `page` as the page number. If `page` is not present,
 * the function assumes the last element of the array to be the slug and returns `null` for the page number.
 *
 * @param {string[]} slugArray - An array of strings containing potential slug and page number information.
 * @returns {{ slug: string | null, pageNumber: number | null }} An object with two properties:
 *   - `slug`: The extracted slug, or `null` if no valid slug is found.
 *   - `pageNumber`: The extracted page number as a number, or `null` if no valid page number is found.
 *
 * @example
 * // Example 1: Array with `page` keyword.
 * extractSlugAndPage(['example-slug', 'page', '2']); // Output: { slug: 'example-slug', pageNumber: 2 }
 *
 * // Example 2: Array without `page` keyword.
 * extractSlugAndPage(['example-slug']); // Output: { slug: 'example-slug', pageNumber: null }
 *
 * // Example 3: Array with `page` keyword but no page number.
 * extractSlugAndPage(['example-slug', 'page']); // Output: { slug: 'example-slug', pageNumber: null }
 */
export function extractSlugAndPage(slugArray: string[]): { slug: string | null; pageNumber: number | null; } {
  let slug = null;
  let pageNumber = null;

  if (Array.isArray(slugArray)) {
      // Check if the array contains `page`.
      const pageIndex = slugArray.indexOf('page');

      if (pageIndex !== -1) {
          // Extract the slug (element before `page`), only if it's a valid index.
          if (pageIndex > 0) {
              slug = slugArray[pageIndex - 1];
          }

          // Extract the page number (element after `page`) only if it exists.
          if (pageIndex + 1 < slugArray.length) {
              const extractedNumber = Number(slugArray[pageIndex + 1]);
              pageNumber = (!isNaN(extractedNumber)) ? extractedNumber : null;
          }
      } else if (slugArray.length > 0) {
          // If `page` is not present, the last element is considered the slug.
          slug = slugArray[slugArray.length - 1];
      }
  }

  return { slug, pageNumber };
}

/**
 * Validates the slug array and redirects to a proper URL if the slug array is invalid.
 *
 * - If the slug array contains exactly two segments and the second segment is 'page', it redirects to the root page with the first segment.
 * - If the slug array contains one segment which is 'page', it redirects to the root page.
 * - If the slug array is invalid and does not match the above cases, it triggers a 'not found' response.
 *
 * The function supports a testing mode where redirections are simulated via the `redirect` function instead of actual permanent redirection.
 *
 * @param {string[]} slugArray - The array of slug segments to validate and process.
 * @param {string} rootPage - The root page URL to be used for redirection.
 * @param {boolean} [test=false] - A flag to simulate redirection instead of performing a permanent redirect. Defaults to `false`.
 *
 * @returns {void} Redirects or triggers a 'not found' response if the slug array is invalid.
 *
 * @example
 * // Example 1: Invalid slug array with two segments.
 * checkSlugAndRedirect(['example-slug', 'page'], '/authors');
 * // Redirects to /authors/example-slug.
 *
 * // Example 2: Invalid slug array with one segment.
 * checkSlugAndRedirect(['page'], '/authors');
 * // Redirects to /authors.
 *
 * // Example 3: Valid slug array, no redirection.
 * checkSlugAndRedirect(['example-slug'], '/authors');
 * // No redirection, returns undefined.
 *
 * // Example 4: Test mode enabled.
 * checkSlugAndRedirect(['example-slug', 'page'], '/authors', true);
 * // Simulates redirection without performing a permanent redirect.
 */
export function checkSlugAndRedirect(slugArray: string[], rootPage: string, test: boolean = false): void {
  if (!isSlugArrayValid(slugArray)) {
    if (slugArray.length === 2 && slugArray[1] === 'page') {
      if (test) redirect(path.join(rootPage, slugArray[0]), RedirectType.replace);
      else permanentRedirect(path.join(rootPage, slugArray[0]), RedirectType.replace);
    }

    if (slugArray.length === 1 && slugArray[0] === 'page') {
      if (test) redirect(path.join(rootPage), RedirectType.replace);
      else permanentRedirect(path.join(rootPage), RedirectType.replace);
    }

    return notFound();
  }
}

/**
 * Redirects to the first page of a paginated resource if the provided page number is 1, in order to avoid page duplicates for SEO purposes.
 *
 * // TODO: Pass query params to the redirect, so that we can maintain sort params.
 *
 * - If `pageNumber` equals 1, the function redirects to the root page or a specific slug.
 * - This redirection is important for SEO optimization, preventing duplicate content issues caused by URLs like `/page/1`.
 * - If a `slug` is provided, the redirection path will include the slug.
 * - The function supports a test mode where the redirection is simulated instead of performing a permanent redirect.
 *
 * @param {string | null | undefined} slug - The slug for the resource. If not provided, the redirection will be to the root page.
 * @param {string | number | null | undefined} pageNumber - The page number to check. If it equals 1, a redirect will occur.
 * @param {string | null | undefined} rootPage - The root page URL for the redirection. If not provided, defaults to '/'.
 * @param {boolean} [test=false] - A flag to simulate redirection instead of performing a permanent redirect. Defaults to `false`.
 *
 * @returns {void} Redirects to the appropriate URL if the page number is 1.
 *
 * @example
 * // Example 1: Redirect to the slug path for the first page (SEO optimization).
 * firstPageRedirect('example-slug', 1, '/authors');
 * // Redirects to /authors/example-slug.
 *
 * // Example 2: Redirect to the root page for the first page.
 * firstPageRedirect(null, 1, '/authors');
 * // Redirects to /authors.
 *
 * // Example 3: Test mode enabled.
 * firstPageRedirect('example-slug', 1, '/authors', true);
 * // Simulates redirection without performing a permanent redirect.
 */
export function firstPageRedirect(
  slug: string | null | undefined,
  pageNumber: string | number | null | undefined,
  rootPage: string | null | undefined,
  test: boolean = false
): void {
  if (Number(pageNumber) === 1) {
    const rootPath = (typeof rootPage === 'string') ? rootPage : '/';
    const redirectPath = (typeof slug === 'string') ? path.join(rootPath, slug) : path.join(rootPath);
    if (test) redirect(redirectPath, RedirectType.replace);
    else permanentRedirect(redirectPath, RedirectType.replace);
  }
}

/**
 * Redirects to a 404 Not Found page if the requested page number exceeds the total page count, or if there is no data available for the current page.
 *
 * - This function checks whether the requested `pageNumber` is out of bounds by comparing it to the total `pageCount`.
 * - If the `dataLength` is 0 and `pageNumber` exceeds `pageCount`, a 404 error is triggered to avoid accessing non-existent pages.
 *
 * @param {number | null | undefined} pageNumber - The current page number to validate.
 * @param {number | null | undefined} pageCount - The total number of pages available for the resource.
 * @param {number} dataLength - The amount of data available for the current page. A value of `0` indicates no data.
 *
 * @returns {void} Triggers a 404 Not Found response if the page number is out of bounds.
 */
export function outOfBoundsRedirect(
  pageNumber: number | null | undefined,
  pageCount: number | null | undefined,
  dataLength: number
): void {
  if (Number(dataLength) === 0 && Number(pageNumber) > Number(pageCount)) {
    return notFound();
  }
}
