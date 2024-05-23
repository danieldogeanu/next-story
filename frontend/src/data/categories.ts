import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/env';

export interface SingleCategoryResponse extends APIResponse<'api::category.category'> {}

export interface CategoriesCollectionResponse extends APIResponseCollection<'api::category.category'> {}

/**
 * Fetches a single category from the Strapi backend by their ID.
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
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('categories', id, params) as SingleCategoryResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of categories from the Strapi backend.
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
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('categories', params) as unknown as CategoriesCollectionResponse;
  return strapiResponse;
}
