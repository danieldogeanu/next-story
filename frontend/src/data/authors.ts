import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, GetValues, IDProperty } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server-env';
import buildTimeAuthors from '@build-data/authors.json';

export interface SingleAuthor extends GetValues<'api::author.author'> {}

export interface SingleAuthorResponse extends APIResponse<'api::author.author'> {}

export interface AuthorsCollectionResponse extends APIResponseCollection<'api::author.author'> {}

// Extract smaller subtypes that can be used to further work with data.
export type AuthorAvatar = NonNullable<SingleAuthor['avatar']>['data']['attributes'];
export type AuthorSocials = NonNullable<SingleAuthor['socialNetworks']>;
export type AuthorSocialEntry = AuthorSocials[number] & IDProperty;
export type AuthorArticles = NonNullable<SingleAuthor['articles']>['data'];
export type AuthorSEO = NonNullable<SingleAuthor['seo']>;

/**
 * Fetches a single author from the Strapi backend by their ID.
 *
 * At build time, it will return a single author from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeAuthors.data.filter(
    (author) => (author.id === Number(id))
  ).pop() as unknown as SingleAuthorResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('authors', id, params) as SingleAuthorResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of authors from the Strapi backend.
 *
 * At build time, it will return a collection of authors from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeAuthors as unknown as AuthorsCollectionResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('authors', params) as unknown as AuthorsCollectionResponse;
  return strapiResponse;
}
