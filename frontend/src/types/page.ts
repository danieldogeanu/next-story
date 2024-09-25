

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
 * Represents the route parameters for an article.
 *
 * Contains information about the article, such as its creation date (in Unix Time) and unique slug identifier.
 *
 * @interface ArticleParams
 * @property {string} created - The date the article was created, represented as a Unix Time string (seconds since the Unix epoch).
 * @property {string} slug - The unique slug for the article, used to generate its URL.
 */
export interface ArticleParams {
  created: string;
  slug: string;
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

/**
 * Defines the properties passed to an article page component.
 *
 * Combines route parameters and search query parameters provided when navigating to an article.
 *
 * @interface ArticleProps
 * @property {ArticleParams} params - The route parameters for the article, including `created` and `slug`.
 * @property {SearchParams} searchParams - The search query parameters from the URL.
 */
export interface ArticleProps {
  params: ArticleParams;
  searchParams: SearchParams;
}
