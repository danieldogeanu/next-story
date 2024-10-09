import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseCollection, APIResponseData, GetValues, IDProperty } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';
import buildTimeArticles from '@build-data/articles.json';

// Rename Strapi types to make it more clear what we're working with.
export interface SingleArticle extends GetValues<'api::article.article'> {}
export interface SingleArticleData extends APIResponseData<'api::article.article'> {}
export interface SingleArticleResponse extends APIResponse<'api::article.article'> {}
export interface ArticlesCollectionResponse extends APIResponseCollection<'api::article.article'> {}

// Extract smaller subtypes that can be used to further work with data.
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
 * At build time, it will return an empty response.
 *
 * @param {string | number} id - The ID of the article to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the article data.
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
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as SingleArticleResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('articles', id, params) as SingleArticleResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SingleArticleResponse;
  }
}

/**
 * Fetches a collection of articles from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to a collection of articles.
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
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return buildTimeArticles as unknown as ArticlesCollectionResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('articles', params) as unknown as ArticlesCollectionResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as ArticlesCollectionResponse;
  }
}

/**
 * Retrieves the previous article based on the current article's ID.
 *
 * @param {number | undefined} currentId - The ID of the current article. If `undefined`, no previous article will be retrieved.
 * @param {StrapiRequestParams} [params] - Additional parameters for the Strapi request, such as filters, pagination, and sorting options.
 * @returns {Promise<SingleArticleData | undefined>} A promise that resolves to the data of the previous article if found, or `undefined` if no previous article exists or an error occurs.
 *
 * @example
 * // Fetch the previous article with extra params.
 * await getPreviousArticle(10, { fields: ['title', 'slug', 'publishedAt'] });
 */
export async function getPreviousArticle(currentId: number | undefined, params?: StrapiRequestParams): Promise<SingleArticleData | undefined> {
  try {
    if (typeof currentId === 'number') {
      const previousArticleResponse = await getArticlesCollection({
        filters: { id: { $lt: currentId } },
        pagination: { start: 0, limit: 1 },
        sort: 'id:desc',
        ...params,
      });

      if (previousArticleResponse.data.length > 0) {
        return previousArticleResponse.data.pop();
      }
    }
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
  }
}

/**
 * Retrieves the next article based on the current article's ID.
 *
 * @param {number | undefined} currentId - The ID of the current article. If `undefined`, no next article will be retrieved.
 * @param {StrapiRequestParams} [params] - Additional parameters for the Strapi request, such as filters, pagination, and sorting options.
 * @returns {Promise<SingleArticleData | undefined>} A promise that resolves to the data of the next article if found, or `undefined` if no next article exists or an error occurs.
 *
 * @example
 * // Fetch the next article with extra params.
 * await getNextArticle(10, { fields: ['title', 'slug', 'publishedAt'] });
 */
export async function getNextArticle(currentId: number | undefined, params?: StrapiRequestParams): Promise<SingleArticleData | undefined> {
  try {
    if (typeof currentId === 'number') {
      const nextArticleResponse = await getArticlesCollection({
        filters: { id: { $gt: currentId } },
        pagination: { start: 0, limit: 1 },
        sort: 'id:asc',
        ...params,
      });

      if (nextArticleResponse.data.length > 0) {
        return nextArticleResponse.data.pop();
      }
    }
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
  }
}
