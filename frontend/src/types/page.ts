

/**
 * Represents the route parameters for a page.
 *
 * Dynamic routes are captured as arrays, which are mapped to this `slug` array.
 *
 * @interface PageParams
 * @property {string[]} slug - Array of URL segments used to match dynamic routes.
 */
export interface PageParams {
  slug: string[];
}

/**
 * Represents the search query parameters for a page.
 *
 * This interface supports multiple key-value pairs where values can be strings, arrays of strings, or undefined.
 *
 * @interface SearchParams
 * @property {Record<string, string | string[] | undefined>} - A key-value map of query parameters.
 */
export interface SearchParams extends Record<string, string | string[] | undefined> {}

/**
 * Defines the properties passed to a page component.
 *
 * Combines route parameters and search query parameters that are provided when navigating to a page.
 *
 * @interface PageProps
 * @property {PageParams} params - The dynamic route parameters (such as a slug).
 * @property {SearchParams} searchParams - The search query parameters from the URL.
 */
export interface PageProps {
  params: PageParams;
  searchParams: SearchParams;
}
