import { capitalize } from "@/utils/strings";


/**
 * Generates an SEO-friendly title by capitalizing the input title and truncating it to the specified limit.
 * If a site name is provided, it is accounted for in the character limit.
 *
 * @param {string | undefined} title - The title to be formatted.
 * @param {string | null | undefined} [siteName] - The name of the site to be included in the title, if any.
 * @param {number} [limit=60] - The character limit for the title. Defaults to 60.
 * @returns {string | undefined} The formatted SEO title.
 */
export function makeSeoTitle(title: string | undefined, siteName?: string | null | undefined, limit: number = 60): string | undefined {
  if (typeof title === 'string') {
    if (typeof siteName === 'string' && siteName !== '') {
      const remainingLimit = limit - (siteName.length + 3);
      const processedTitle = (title?.length > remainingLimit)
        ? title?.trim().substring(0, remainingLimit - 3) + '...'
        : title?.trim().substring(0, remainingLimit);
      return capitalize(processedTitle);
    } else return capitalize(title?.trim().substring(0, limit));
  }
}

/**
 * Generates an SEO-friendly description by trimming and truncating the input description to the specified limit.
 * Ensures the description ends with an ellipsis if it is truncated.
 *
 * @param {string | undefined} description - The description to be formatted.
 * @param {number} [limit=160] - The character limit for the description. Defaults to 160.
 * @returns {string | undefined} The formatted SEO description.
 */
export function makeSeoDescription(description: string | undefined, limit: number = 160): string | undefined {
  if (typeof description === 'string') {
    const processedDescription = (description?.endsWith('...')) ? description.replace('...', '') : description;
    return processedDescription?.trim().substring(0, limit - 3) + '...';
  }
}

/**
 * Generates an SEO-friendly keywords string by trimming and truncating the input keywords to the specified limit.
 *
 * @param {string | string[] | null | undefined} keywords - The keywords to be formatted, can be a string or an array of strings.
 * @param {number} [limit=10] - The number of keywords to include in the result. Defaults to 10.
 * @returns {string | undefined} The formatted SEO keywords string.
 */
export function makeSeoKeywords(keywords: string | string[] | null | undefined, limit: number = 10): string | undefined {
  if (Array.isArray(keywords)) {
    return keywords?.slice(0, limit).map(keyword => keyword.trim()).join(', ');
  }

  if (typeof keywords === 'string') {
    return keywords?.split(',').slice(0, limit).map(keyword => keyword.trim()).join(', ');
  }
}

/**
 * Generates an array of SEO-friendly tags for Open Graph, from a string or array of keywords,
 * truncating the result to the specified limit.
 *
 * @param {string | string[] | null | undefined} keywords - The keywords to be formatted, either as a string or an array.
 * @param {number} [limit=10] - The maximum number of tags to include. Defaults to 10.
 * @returns {string[] | undefined} The formatted array of SEO tags.
 */
export function makeSeoTags(keywords: string | string[] | null | undefined, limit: number = 10): string[] | undefined {
  if (Array.isArray(keywords)) {
    return keywords?.slice(0, limit).map(keyword => keyword.trim());
  }

  if (typeof keywords === 'string') {
    return keywords?.split(',').slice(0, limit).map(keyword => keyword.trim());
  }
}

/**
 * Generates SEO-related components (slug, title, description, keyword) for a specific page number.
 *
 * - This function helps create SEO-friendly values related to a given `pageNumber`, which can be used in URLs, titles, meta descriptions, and keywords.
 * - If the `pageNumber` is not a number, the function returns empty strings for all components.
 *
 * @param {number | null | undefined} pageNumber - The current page number for which SEO components are generated.
 *
 * @returns {{pageNumberSlug: string, pageNumberTitle: string, pageNumberDescription: string, pageNumberKeyword: string}}
 * An object containing SEO-friendly components for the page number:
 *   - `pageNumberSlug`: The URL segment for the page number (e.g., `/page/2`).
 *   - `pageNumberTitle`: The title prefix (e.g., `Page 2 > `).
 *   - `pageNumberDescription`: The meta description prefix (e.g., `Page 2: `).
 *   - `pageNumberKeyword`: The keyword for SEO (e.g., `page 2,`).
 */
export function makeSeoPageNumber(pageNumber: number | null | undefined): {
  pageNumberSlug: string; pageNumberTitle: string; pageNumberDescription: string; pageNumberKeyword: string;
} {
  const pageNumberSlug = (typeof pageNumber === 'number') ? `/page/${pageNumber}` : '';
  const pageNumberTitle = (typeof pageNumber === 'number') ? `Page ${pageNumber} > ` : '';
  const pageNumberDescription = (typeof pageNumber === 'number') ? `Page ${pageNumber}: ` : '';
  const pageNumberKeyword = (typeof pageNumber === 'number') ? `page ${pageNumber},` : '';

  return {pageNumberSlug, pageNumberTitle, pageNumberDescription, pageNumberKeyword};
}
