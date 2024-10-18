import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues, IDProperty } from '@/types/strapi';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/server/env';

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
 * @param {string | number} id - The ID of the page to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the page data.
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
  try {
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('pages', id, params) as SinglePageResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SinglePageResponse;
  }
}

/**
 * Fetches a collection of pages from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of pages.
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
  try {
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('pages', params) as unknown as PagesCollectionResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as PagesCollectionResponse;
  }
}
