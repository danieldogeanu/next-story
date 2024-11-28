import { getSiteLang } from '@/utils/client/env';


/**
 * Converts a given date to its UTC timestamp (in Unix time).
 *
 * This function takes a `Date` object and returns the UTC timestamp in milliseconds (Unix time).
 * If no date is provided, it returns 0.
 *
 * @param {Date | undefined} date - The date to convert to UTC. If undefined, defaults to 0.
 * @returns {number} The UTC timestamp in milliseconds, or 0 if the date is undefined.
 */
export function convertDateToUTC(date: Date | undefined): number {
  // We do it this way to ensure consistency on both the server and client.
  if (typeof date === 'undefined') return 0;
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

/**
 * Converts an ISO date string to Unix time string.
 *
 * @param {string | Date | undefined} isoDate - The ISO date string to convert.
 * @returns {string} The Unix time in milliseconds as a string.
 *
 * @example
 * // Convert an ISO date to Unix time.
 * convertToUnixTime('2024-06-07T10:20:30Z');
 */
export function convertToUnixTime(isoDate: string | Date | undefined): string {
  if (typeof isoDate === 'undefined') return '';
  const date = new Date(isoDate?.toString() as string);
  return convertDateToUTC(date).toString();
}

/**
 * Converts a Unix time string to an ISO date string.
 *
 * @param {number | string | undefined} unixDate - The Unix time to convert.
 * @returns {string} The ISO date string.
 *
 * @example
 * // Convert a Unix time to ISO date.
 * convertToISODate('1715100030000');
 */
export function convertToISODate(unixDate: number | string | undefined): string {
  if (typeof unixDate === 'undefined') return '';
  const date = new Date(parseInt(unixDate.toString(), 10));
  return date.toISOString();
}

/**
 * Converts an ISO date string to a readable date string in either long or short format.
 *
 * @param {string | Date | undefined} isoDate - The ISO date string to convert.
 * @param {'long' | 'short'} [format] - The desired date format. Defaults to 'long'.
 * @returns {string} A readable date string in the specified format.
 *
 * @example
 * // Convert an ISO date to a long readable date string.
 * convertToReadableDate('2024-06-07T10:20:30Z'); // Fri Jun 07, 2024
 *
 * @example
 * // Convert an ISO date to a short readable date string.
 * convertToReadableDate('2024-06-07T10:20:30Z', 'short'); // 06/07/2024
 */
export function convertToReadableDate(isoDate: string | Date | undefined, format?: 'long' | 'short'): string {
  if (typeof isoDate === 'undefined') return '';
  const date = new Date(isoDate?.toString() as string);
  const longDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(date);
  const shortDate = new Intl.DateTimeFormat('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(date);
  return (format && format === 'short') ? shortDate : longDate;
}

/**
 * Converts an ISO date string to a human-readable relative time format (e.g., '3 days ago').
 *
 * @param {string | Date | undefined} isoDate - The ISO date string to convert.
 * @returns {string} A string representing the relative time from the given date to now.
 *
 * @example
 * // Convert an ISO date to a relative date.
 * convertToRelativeDate('2023-06-01T12:00:00Z'); // 3 days ago
 */
export function convertToRelativeDate(isoDate: string | Date | undefined): string {
  if (typeof isoDate === 'undefined') return '';

  // Extract a usable date from the isoDate.
  const date = new Date(isoDate?.toString() as string);

  // Convert the date in UTC milliseconds and calculate the difference in seconds.
  const utcUnixTime = convertDateToUTC(date);
  const deltaSeconds = Math.round((utcUnixTime - Date.now()) / 1000);

  // Define cutoffs and units for relative time.
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  // Find the appropriate time unit for the relative time.
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Format the relative time and return it.
  const rtf = new Intl.RelativeTimeFormat(getSiteLang(), {numeric: 'auto'});
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
