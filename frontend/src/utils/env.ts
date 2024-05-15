// Utility functions for environment variables.

/**
 * Retrieves the current Node environment.
 *
 * @returns The current Node environment. Defaults to `development` if not set.
 */
export function getNodeEnv() {
  return (process.env.NODE_ENV || 'development');
}

/**
 * Retrieves the site's language setting.
 *
 * @returns The site's language setting. Defaults to 'en' if not set.
 */
export function getSiteLang() {
  return (process.env.NEXT_PUBLIC_LANG || 'en');
}

/**
 * Retrieves the backend URL based on the current Node environment.
 *
 * @returns The backend URL for the current environment. Defaults to a specific URL based on the environment if not set.
 */
export function getBackEndURL() {
  switch(getNodeEnv()) {
    case 'development': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-dev:1337');
    case 'production': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-prod:1337');
    case 'test': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-dev:1337');
    default: return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
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
  'use server';

  switch(keyFor) {
    case 'frontend': return (process.env.NEXT_STRAPI_FE_APIKEY || '');
    case 'backend': return (process.env.NEXT_STRAPI_BE_APIKEY || '');
    default: throw new Error('The API key type was either not specified or not found.');
  }
}
