'use server';

// Server side utility functions for environment variables.

/**
 * Retrieves the build status of the frontend container.
 *
 * This is necessary for us to know when we can make requests to the server,
 * over the network, and when we must load data from JSON files,
 * so that Next.js can build in the frontend container without errors.
 * We can't make network requests in a docker container at build time,
 * because networking isn't initiated at that time.
 *
 * @returns Returns `true` if the `BUILD_TIME` environment variable is set to `1`.
 */
export async function isBuildTime() {
  return (Boolean(process.env.BUILD_TIME) || false);
}

/**
 * Retrieves the API key for the specified purpose.
 *
 * `WARNING`: API keys should not be exposed to the client (browser)! Because of this we made
 * this function a server function. API keys can only be retrieved on the server.
 *
 * @param keyFor - Specifies whether the API key is for the frontend or backend.
 * @returns A promise that resolves to the API key. Returns an empty string if the key is not found.
 * @throws Throws an error if the `keyFor` parameter is not specified or is invalid.
 *
 * @example
 * // Retrieve the frontend API key
 * await getAPIKey('frontend');
 */
export async function getAPIKey(keyFor: 'frontend' | 'backend') {
  switch(keyFor) {
    case 'frontend': return (process.env.NEXT_STRAPI_FE_APIKEY || '');
    case 'backend': return (process.env.NEXT_STRAPI_BE_APIKEY || '');
    default: throw new Error('The API key type was either not specified or not found.');
  }
}
