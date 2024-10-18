import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues, IDProperty } from '@/types/strapi';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/server/env';

// Rename Strapi types to make it more clear what we're working with.
export interface SingleAuthor extends GetValues<'api::author.author'> {}
export interface SingleAuthorData extends APIResponseData<'api::author.author'> {}
export interface SingleAuthorResponse extends APIResponse<'api::author.author'> {}
export interface AuthorsCollectionResponse extends APIResponseCollection<'api::author.author'> {}

// Extract smaller subtypes that can be used to further work with data.
export type AuthorAvatar = NonNullable<SingleAuthor['avatar']>['data']['attributes'];
export type AuthorSocials = NonNullable<SingleAuthor['socialNetworks']>;
export type AuthorSocialEntry = AuthorSocials[number] & IDProperty;
export type AuthorArticles = NonNullable<SingleAuthor['articles']>['data'];
export type AuthorRobots = NonNullable<SingleAuthor['robots']>;
export type AuthorSEO = NonNullable<SingleAuthor['seo']>;
export type AuthorMetaSocial = NonNullable<AuthorSEO['metaSocial']>;
export type AuthorMetaSocialEntry = AuthorMetaSocial[number] & IDProperty;

/**
 * Fetches a single author from the Strapi backend by their ID.
 *
 * @param {string | number} id - The ID of the author to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the author data.
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
  try {
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('authors', id, params) as SingleAuthorResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SingleAuthorResponse;
  }
}

/**
 * Fetches a collection of authors from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of authors.
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
  try {
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('authors', params) as unknown as AuthorsCollectionResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as AuthorsCollectionResponse;
  }
}
