import { Attribute } from "@strapi/strapi";

/**
 * Converts an ISO date string to Unix time string.
 *
 * @param {Attribute.DateTimeValue | undefined} isoDate - The ISO date string to convert.
 * @returns {string} The Unix time in milliseconds as a string.
 *
 * @example
 * // Convert an ISO date to Unix time.
 * convertToUnixTime('2024-06-07T10:20:30Z');
 */
export function convertToUnixTime(isoDate: Attribute.DateTimeValue | undefined): string {
  return (new Date(isoDate?.toString() as string)).getTime().toString();
}

/**
 * Converts a Unix time string to an ISO date string.
 *
 * @param {string} unixDate - The Unix time string to convert.
 * @returns {string} The ISO date string.
 *
 * @example
 * // Convert a Unix time to ISO date.
 * convertToISODate('1715100030000');
 */
export function convertToISODate(unixDate: string): string {
  return (new Date(parseInt(unixDate))).toISOString();
}

/**
 * Converts an ISO date string to a readable date string.
 *
 * @param {Attribute.DateTimeValue | undefined} isoDate - The ISO date string to convert.
 * @returns {string} A readable date string.
 *
 * @example
 * // Convert an ISO date to a readable date string.
 * convertToReadableDate('2024-06-07T10:20:30Z');
 */
export function convertToReadableDate(isoDate: Attribute.DateTimeValue | undefined): string {
  return (new Date(isoDate?.toString() as string)).toDateString();
}
