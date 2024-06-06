import StrapiSDK from 'strapi-sdk-js';
import { validateApiKey } from './validation.js';
import { getBackEndURL } from './utils.js';


/**
 * Initializes and returns an instance of the StrapiSDK with the appropriate configuration.
 *
 * @param {string | undefined} [apiKey] - Optional API key to use for authentication.
 * @returns {Promise<StrapiSDK>} A promise that resolves to an instance of StrapiSDK.
 * @throws {Error} Throws an error if the backend URL or the API key is not valid.
 *
 * @example
 * // Initialize the Strapi SDK and fetch some articles from your public Strapi API.
 * const strapiInstance = await strapiSDK();
 * const articles = await strapiInstance.find('articles');
 *
 * @example
 * // Initialize the Strapi SDK and fetch some articles using your Strapi API key.
 * const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
 * const articles = await strapiInstance.find('articles');
 */
export const strapiSDK = async (apiKey) => {
  const backendUrl = new URL(getBackEndURL());
  const strapiOptions = {
    url: backendUrl.href,
    axiosOptions: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  // Check if there's a valid API key and add Authorization header.
  if (validateApiKey(apiKey) && strapiOptions.axiosOptions?.headers) {
    strapiOptions.axiosOptions.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
  }

  return new StrapiSDK(strapiOptions);
};
