import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';

// Rename Strapi types to make it more clear what we're working with.
export interface SingleTag extends GetValues<'api::tag.tag'> {}
export interface SingleTagData extends APIResponseData<'api::tag.tag'> {}
export interface SingleTagResponse extends APIResponse<'api::tag.tag'> {}
export interface TagsCollectionResponse extends APIResponseCollection<'api::tag.tag'> {}

// Extract smaller subtypes that can be used to further work with data.
export type TagArticles = NonNullable<SingleTag['articles']>['data'];

/**
 * Fetches a single tag from the Strapi backend by their ID.
 *
 * At build time, it will return an empty response.
 *
 * @param {string | number} id - The ID of the tag to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the tag data.
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
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as SingleTagResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('tags', id, params) as SingleTagResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SingleTagResponse;
  }
}

/**
 * Fetches a collection of tags from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of tags.
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
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.api.collection as unknown as TagsCollectionResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('tags', params) as unknown as TagsCollectionResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as TagsCollectionResponse;
  }
}
