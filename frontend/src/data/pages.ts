import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues, IDProperty } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { strapiSDK } from '@/data/strapi';
import buildTimePages from '@build-data/pages.json';

// Rename Strapi types to make it more clear what we're working with.
export interface SinglePage extends GetValues<'api::page.page'> {}
export interface SinglePageData extends APIResponseData<'api::page.page'> {}
export interface SinglePageResponse extends APIResponse<'api::page.page'> {}
export interface PagesCollectionResponse extends APIResponseCollection<'api::page.page'> {}

// Extract smaller subtypes that can be used to further work with data.
export type PageContent = NonNullable<SinglePage['content']>;
export type PageCover = NonNullable<SinglePage['cover']>['data']['attributes'];
export type PageParent = NonNullable<SinglePage['parent']>['data']['attributes'];
export type PageChildren = NonNullable<SinglePage['children']>['data'];
export type PageRobots = NonNullable<SinglePage['robots']>;
export type PageSEO = NonNullable<SinglePage['seo']>;
export type PageMetaSocial = NonNullable<PageSEO['metaSocial']>;
export type PageMetaSocialEntry = PageMetaSocial[number] & IDProperty;

/**
 * Fetches a single page from the Strapi backend by their ID.
 *
 * At build time, it will return a single page from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimePages.data.filter(
    (page) => (page.id === Number(id))
  ).pop() as unknown as SinglePageResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('pages', id, params) as SinglePageResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of pages from the Strapi backend.
 *
 * At build time, it will return a collection of pages from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimePages as unknown as PagesCollectionResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('pages', params) as unknown as PagesCollectionResponse;
  return strapiResponse;
}
