import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';

export interface SinglePageResponse extends APIResponse<'api::page.page'> {}

export interface PagesCollectionResponse extends APIResponseCollection<'api::page.page'> {}

/**
 * Fetches a single page from the Strapi backend by their ID.
 *
 * @param {string | number} id - The ID of the page to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the page data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a single page by ID.
 * await getSinglePage(1);
 *
 * @example
 * // Fetch a single page by ID with custom parameters.
 * await getSinglePage(1, {fields: ['title', 'slug', 'excerpt']});
 */
export async function getSinglePage(id: string | number, params?: StrapiRequestParams): Promise<SinglePageResponse> {
  const strapiInstance = await strapiSDK();
  const strapiResponse = await strapiInstance.findOne('pages', id, params) as SinglePageResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of pages from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of pages.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a collection of pages.
 * await getPagesCollection();
 *
 * @example
 * // Fetch a collection of pages with custom parameters.
 * await getPagesCollection({pagination: {page: 1, pageSize: 2}});
 */
export async function getPagesCollection(params?: StrapiRequestParams): Promise<PagesCollectionResponse> {
  const strapiInstance = await strapiSDK();
  const strapiResponse = await strapiInstance.find('pages', params) as unknown as PagesCollectionResponse;
  return strapiResponse;
}
