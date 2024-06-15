
/**
 * Retrieves the current Node environment.
 *
 * @returns {'development' | 'production' | 'test' | 'localhost'} The current Node environment. Defaults to `localhost` if not set.
 */
export function getNodeEnv() {
  return (process.env.NODE_ENV || 'localhost');
}

/**
 * Retrieves the backend URL based on the current Node environment.
 *
 * @returns {string} The backend URL for the current environment. Defaults to a specific URL based on the environment if not set.
 */
export function getBackEndURL() {
  switch(getNodeEnv()) {
    case 'development': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-dev:1337');
    case 'production': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-prod:1337');
    case 'test': return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ns-strapi-dev:1337');
    default: return 'http://localhost:1337';
  }
}

/**
 * Retrieves the API key for the specified purpose.
 *
 * @param {'frontend' | 'backend'} keyFor - Specifies whether the API key is for the frontend or backend.
 * @returns {Promise<string>} A promise that resolves to the API key. Returns an empty string if the key is not found.
 * @throws {Error} Throws an error if the `keyFor` parameter is not specified or is invalid.
 *
 * @example
 * // Retrieve the frontend API key
 * await getAPIKey('frontend');
 */
export async function getAPIKey(keyFor) {
  switch(keyFor) {
    case 'frontend': return (process.env.NEXT_STRAPI_FE_APIKEY || '');
    case 'backend': return (process.env.NEXT_STRAPI_BE_APIKEY || '');
    default: throw new Error('The API key type was either not specified or not found.');
  }
}
