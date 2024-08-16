import { getSiteLang } from '@/utils/client/env';

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
  return (new Date(isoDate?.toString() as string)).getTime().toString();
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
  return (new Date(parseInt(unixDate?.toString() as string))).toISOString();
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
 * convertToReadableDate('2024-06-07T10:20:30Z', 'short'); // 6/7/2024
 */
export function convertToReadableDate(isoDate: string | Date | undefined, format?: 'long' | 'short'): string {
  const date = new Date(isoDate?.toString() as string);
  const longOptions: Intl.DateTimeFormatOptions = {weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'};
  const longDate = new Intl.DateTimeFormat('en-US', longOptions).format(date);
  const shortDate = date.toLocaleDateString('en-US');
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
  // Extract a usable date from the isoDate.
  const date = new Date(isoDate?.toString() as string);

  // Convert it to milliseconds (Unix time).
  const timeMs = date.getTime();

  // Get the amount of seconds between the given date and now.
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds.
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units.
  const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  // Grab the ideal cutoff unit.
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is 'day' our divisor
  // is one day in seconds, so we can divide our seconds by this to get the number of days.
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Return the formated relative time.
  const rtf = new Intl.RelativeTimeFormat(getSiteLang(), {numeric: 'auto'});
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
