import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, GetValues } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import buildTimeCategories from '@build-data/categories.json';

export interface SingleCategory extends GetValues<'api::category.category'> {}

export interface SingleCategoryResponse extends APIResponse<'api::category.category'> {}

export interface CategoriesCollectionResponse extends APIResponseCollection<'api::category.category'> {}

// Extract smaller subtypes that can be used to further work with data.
export type CategoryCover = NonNullable<SingleCategory['cover']>['data']['attributes'];
export type CategoryRobots = NonNullable<SingleCategory['robots']>;
export type CategorySEO = NonNullable<SingleCategory['seo']>;
export type CategoryArticles = NonNullable<SingleCategory['articles']>['data'];

/**
 * Fetches a single category from the Strapi backend by their ID.
 *
 * At build time, it will return a single category from a static JSON file.
 *
 * @param {string | number} id - The ID of the category to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the category data.
 * @throws {Error} Throws an error if the fetch request fails.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeCategories.data.filter(
    (category) => (category.id === Number(id))
  ).pop() as unknown as SingleCategoryResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('categories', id, params) as SingleCategoryResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of categories from the Strapi backend.
 *
 * At build time, it will return a collection of categories from a static JSON file.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of categories.
 * @throws {Error} Throws an error if the fetch request fails.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeCategories as unknown as CategoriesCollectionResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('categories', params) as unknown as CategoriesCollectionResponse;
  return strapiResponse;
}
