import { getHostname } from "@/utils/client/env";


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

