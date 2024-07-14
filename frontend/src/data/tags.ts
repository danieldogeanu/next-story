import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, GetValues } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey, isBuildTime } from '@/utils/env';
import buildTimeTags from '@build-data/tags.json';

export interface SingleTag extends GetValues<'api::tag.tag'> {}

export interface SingleTagResponse extends APIResponse<'api::tag.tag'> {}

export interface TagsCollectionResponse extends APIResponseCollection<'api::tag.tag'> {}

// Extract smaller subtypes that can be used to further work with data.
export type TagArticles = NonNullable<SingleTag['articles']>['data'];

/**
 * Fetches a single tag from the Strapi backend by their ID.
 *
 * At build time, it will return a single tag from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (isBuildTime()) return buildTimeTags.data.filter(
    (tag) => (tag.id === Number(id))
  ).pop() as unknown as SingleTagResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('tags', id, params) as SingleTagResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of tags from the Strapi backend.
 *
 * At build time, it will return a collection of tags from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (isBuildTime()) return buildTimeTags as unknown as TagsCollectionResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('tags', params) as unknown as TagsCollectionResponse;
  return strapiResponse;
}
