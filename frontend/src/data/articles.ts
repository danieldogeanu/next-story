import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, GetValues, IDProperty } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import buildTimeArticles from '@build-data/articles.json';

export interface SingleArticle extends GetValues<'api::article.article'> {}

export interface SingleArticleResponse extends APIResponse<'api::article.article'> {}

export interface ArticlesCollectionResponse extends APIResponseCollection<'api::article.article'> {}

// Extract smaller subtypes that can be used to further work with data.
// TODO: Figure out `comments` subtype for articles data type.
export type ArticleContent = NonNullable<SingleArticle['content']>;
export type ArticleCommentsSettings = NonNullable<SingleArticle['comments']>;
export type ArticleCover = NonNullable<SingleArticle['cover']>['data']['attributes'];
export type ArticleCategory = NonNullable<SingleArticle['category']>['data']['attributes'];
export type ArticleTags = NonNullable<SingleArticle['tags']>['data'];
export type ArticleAuthor = NonNullable<SingleArticle['author']>['data']['attributes'];
export type ArticleRobots = NonNullable<SingleArticle['robots']>;
export type ArticleSEO = NonNullable<SingleArticle['seo']>;
export type ArticleMetaSocial = NonNullable<ArticleSEO['metaSocial']>;
export type ArticleMetaSocialEntry = ArticleMetaSocial[number] & IDProperty;

/**
 * Fetches a single article from the Strapi backend by its ID.
 *
 * At build time, it will return a single article from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeArticles.data.filter(
    (article) => (article.id === Number(id))
  ).pop() as unknown as SingleArticleResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('articles', id, params) as SingleArticleResponse;
  return strapiResponse;
}

/**
 * Fetches a collection of articles from the Strapi backend.
 *
 * At build time, it will return a collection of articles from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeArticles as unknown as ArticlesCollectionResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('articles', params) as unknown as ArticlesCollectionResponse;
  return strapiResponse;
}
