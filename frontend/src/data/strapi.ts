import { getBackEndURL } from '@/utils/env';
import StrapiSDK, { StrapiOptions } from 'strapi-sdk-js';

/**
 * Initializes and returns an instance of the StrapiSDK with the appropriate configuration.
 *
 * @param {string} [apiKey] - Optional API key to use for authentication.
 * @returns A promise that resolves to an instance of StrapiSDK.
 * @throws {Error} Throws an error if the backend URL or the API key is not valid.
 *
 * @example
 * // Initialize the Strapi SDK and fetch some articles from your public Strapi API.
 * const strapiInstance = await strapiSDK();
 * const articles = await strapiInstance.find<APIResponseCollection<'api::article.article'>>('articles');
 *
 * @example
 * // Initialize the Strapi SDK and fetch some articles using your Strapi API key.
 * const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
 * const articles = await strapiInstance.find<APIResponseCollection<'api::article.article'>>('articles');
 */
export const strapiSDK = async (apiKey?: string): Promise<StrapiSDK> => {
  const backendUrl = new URL(getBackEndURL());
  const strapiOptions: StrapiOptions = {
    url: backendUrl.href,
    store: {
      key: "strapi_jwt",
      useLocalStorage: false,
      cookieOptions: { domain: backendUrl.hostname, path: "/" },
    },
    axiosOptions: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  // Check if there's an apiKey and add Authorization header.
  // TODO: Add proper validation for JWT API token.
  if (typeof apiKey === 'string' && apiKey !== '' && strapiOptions.axiosOptions?.headers) {
    strapiOptions.axiosOptions.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
  }

  return new StrapiSDK(strapiOptions);
};
