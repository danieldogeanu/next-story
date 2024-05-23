import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/env';

export interface SingleArticleResponse extends APIResponse<'api::article.article'> {}

export interface ArticlesCollectionResponse extends APIResponseCollection<'api::article.article'> {}

/**
 * Fetches a single article from the Strapi backend by its ID.
 *
 * @param {string | number} id - The ID of the article to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the article data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a single article by ID.
 * await getSingleArticle(3);
 *
 * @example
 * // Fetch a single article by ID with custom parameters.
 * await getSingleArticle(3, {fields: ['title', 'slug', 'excerpt']});
 */
export async function getSingleArticle(id: string | number, params?: StrapiRequestParams): Promise<SingleArticleResponse> {
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('articles', id, params) as SingleArticleResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of articles from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of articles.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch a collection of articles.
 * await getArticlesCollection();
 *
 * @example
 * // Fetch a collection of articles with custom parameters.
 * await getArticlesCollection({pagination: {page: 1, pageSize: 2}});
 */
export async function getArticlesCollection(params?: StrapiRequestParams): Promise<ArticlesCollectionResponse> {
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('articles', params) as unknown as ArticlesCollectionResponse;
  return strapiResponse;
}
