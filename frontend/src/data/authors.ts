import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/env';

export interface SingleAuthorResponse extends APIResponse<'api::author.author'> {}

export interface AuthorsCollectionResponse extends APIResponseCollection<'api::author.author'> {}

/**
 * Fetches a single author from the Strapi backend by their ID.
 *
 * @param {string | number} id - The ID of the author to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the author data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a single author by ID.
 * await getSingleAuthor(1);
 *
 * @example
 * // Fetch a single author by ID with custom parameters.
 * await getSingleAuthor(1, {fields: ['slug', 'biography', 'fullName']});
 */
export async function getSingleAuthor(id: string | number, params?: StrapiRequestParams): Promise<SingleAuthorResponse> {
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('authors', id, params) as SingleAuthorResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of authors from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of authors.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a collection of authors.
 * await getAuthorsCollection();
 *
 * @example
 * // Fetch a collection of authors with custom parameters.
 * await getAuthorsCollection({pagination: {page: 1, pageSize: 2}});
 */
export async function getAuthorsCollection(params?: StrapiRequestParams): Promise<AuthorsCollectionResponse> {
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('authors', params) as unknown as AuthorsCollectionResponse;
  return strapiResponse;
}
