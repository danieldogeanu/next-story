import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';

export interface SingleTagResponse extends APIResponse<'api::tag.tag'> {}

export interface TagsCollectionResponse extends APIResponseCollection<'api::tag.tag'> {}

/**
 * Fetches a single tag from the Strapi backend by their ID.
 *
 * @param {string | number} id - The ID of the tag to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the tag data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a single tag by ID.
 * await getSingleTag(1);
 *
 * @example
 * // Fetch a single tag by ID with custom parameters.
 * await getSingleTag(1, {fields: ['name', 'slug']});
 */
export async function getSingleTag(id: string | number, params?: StrapiRequestParams): Promise<SingleTagResponse> {
  const strapiInstance = await strapiSDK();
  const strapiResponse = await strapiInstance.findOne('tags', id, params) as SingleTagResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of tags from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of tags.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a collection of tags.
 * await getTagsCollection();
 *
 * @example
 * // Fetch a collection of tags with custom parameters.
 * await getTagsCollection({pagination: {page: 1, pageSize: 2}});
 */
export async function getTagsCollection(params?: StrapiRequestParams): Promise<TagsCollectionResponse> {
  const strapiInstance = await strapiSDK();
  const strapiResponse = await strapiInstance.find('tags', params) as unknown as TagsCollectionResponse;
  return strapiResponse;
}
