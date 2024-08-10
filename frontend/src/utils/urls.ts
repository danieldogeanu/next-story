import mime from 'mime';
import path from 'path';
import { getFrontEndURL, getHostname } from "@/utils/client/env";


/**
 * Checks if a given URL is an absolute URL.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is absolute, otherwise false.
 */
export function isAbsoluteUrl(url: string): boolean {
  return url.toLowerCase().startsWith('http') || url.toLowerCase().startsWith('https');
}

/**
 * Checks if a given URL is a relative URL.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is relative, otherwise false.
 */
export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url) && url.toLowerCase().startsWith('/');
}

/**
 * Determines if a given URL is external compared to the current hostname.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is external, otherwise false.
 */
export function isExternalUrl(url: string): boolean {
  const currentHostname = getHostname();

  try {
    const parsedHostname = new URL(url).hostname.replace('www.', '');
    return parsedHostname !== currentHostname;
  } catch (e) {
    return false;
  }
}

/**
 * Extracts the hostname from a given URL, removing 'www.' if present.
 *
 * @param {string} url - The URL from which to extract the hostname.
 * @returns {string | null} The hostname without 'www.' or null if the URL is invalid.
 */
export function getHostFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves the MIME type from a given URL.
 *
 * @param {string} url - The URL from which to extract the MIME type.
 * @returns {string | null} The MIME type of the URL, or null if it cannot be determined.
 */
export function getMimeTypeFromUrl(url: string): string | null {
  return mime.getType(url);
}

/**
 * Retrieves the file extension from a given URL.
 *
 * @param {string} url - The URL from which to extract the file extension.
 * @returns {string | null} The file extension of the URL, or null if it cannot be determined.
 */
export function getExtensionFromUrl(url: string): string | null {
  return mime.getExtension(url);
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

