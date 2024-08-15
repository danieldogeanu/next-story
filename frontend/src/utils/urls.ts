import mime from 'mime';
import path from 'path';
import { z as val } from 'zod';
import { getBackEndURL, getFrontEndURL, getHostname } from '@/utils/client/env';
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
