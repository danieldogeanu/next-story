import { getAPIKey, getBackEndURL } from '@/utils/env';
import StrapiSDK from 'strapi-sdk-js';

/**
 * Initializes and returns an instance of the StrapiSDK with the appropriate configuration.
 *
 * @returns A promise that resolves to an instance of StrapiSDK configured with the backend URL and API key.
 * @throws {Error} Throws an error if fetching the API key fails.
 *
 * @example
 * // Initialize the Strapi SDK and fetch some articles.
 * const strapiInstance = await strapiSDK();
 * const articles = await strapiInstance.find<APIResponseCollection<'api::article.article'>>('articles');
 */
export const strapiSDK = async (): Promise<StrapiSDK> => {
  const apiKey = await getAPIKey('frontend');
  const backendUrl = getBackEndURL();

  return new StrapiSDK({
    url: backendUrl,
    axiosOptions: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    },
  });
};
