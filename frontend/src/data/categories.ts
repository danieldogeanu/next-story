import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues, IDProperty } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';

// Rename Strapi types to make it more clear what we're working with.
export interface SingleCategory extends GetValues<'api::category.category'> {}
export interface SingleCategoryData extends APIResponseData<'api::category.category'> {}
export interface SingleCategoryResponse extends APIResponse<'api::category.category'> {}
export interface CategoriesCollectionResponse extends APIResponseCollection<'api::category.category'> {}

// Extract smaller subtypes that can be used to further work with data.
export type CategoryCover = NonNullable<SingleCategory['cover']>['data']['attributes'];
export type CategoryArticles = NonNullable<SingleCategory['articles']>['data'];
export type CategoryRobots = NonNullable<SingleCategory['robots']>;
export type CategorySEO = NonNullable<SingleCategory['seo']>;
export type CategoryMetaSocial = NonNullable<CategorySEO['metaSocial']>;
export type CategoryMetaSocialEntry = CategoryMetaSocial[number] & IDProperty;

/**
 * Fetches a single category from the Strapi backend by their ID.
 *
 * At build time, it will return an empty response.
 *
 * @param {string | number} id - The ID of the category to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the category data.
 *
 * @example
 * // Fetch a single category by ID.
 * await getSingleCategory(1);
 *
 * @example
 * // Fetch a single category by ID with custom parameters.
 * await getSingleCategory(1, {fields: ['name', 'slug', 'description']});
 */
export async function getSingleCategory(id: string | number, params?: StrapiRequestParams): Promise<SingleCategoryResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as SingleCategoryResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('categories', id, params) as SingleCategoryResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SingleCategoryResponse;
  }
}

/**
 * Fetches a collection of categories from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of categories.
 *
 * @example
 * // Fetch a collection of categories.
 * await getCategoriesCollection();
 *
 * @example
 * // Fetch a collection of categories with custom parameters.
 * await getCategoriesCollection({pagination: {page: 1, pageSize: 2}});
 */
export async function getCategoriesCollection(params?: StrapiRequestParams): Promise<CategoriesCollectionResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.api.collection as unknown as CategoriesCollectionResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('categories', params) as unknown as CategoriesCollectionResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as CategoriesCollectionResponse;
  }
}
