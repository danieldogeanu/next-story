import { Attribute } from "@strapi/strapi";

/**
 * Converts an ISO date string to Unix time.
 *
 * @param {Attribute.DateTimeValue | undefined} isoDate - The ISO date string to convert.
 * @returns {number} The Unix time in milliseconds.
 *
 * @example
 * // Convert an ISO date to Unix time.
 * convertToUnixTime('2024-06-07T10:20:30Z');
 */
export function convertToUnixTime(isoDate: Attribute.DateTimeValue | undefined): number {
  return (new Date(isoDate?.toString() as string)).getTime();
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
