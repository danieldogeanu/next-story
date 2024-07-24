// Client side utility functions for environment variables.

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
 * Retrieves the backend URL based on the current environment variable.
 *
 * @returns The backend URL for the current environment. Defaults to localhost if the environment variable is not set.
 */
export function getBackEndURL() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337');
}

/**
 * Retrieves the hostname from the environment variables.
 *
 * This function returns the hostname defined in the `NEXT_PUBLIC_HOSTNAME` environment variable.
 * If the environment variable is not set, it defaults to 'localhost'.
 *
 * @returns The hostname from the environment variables, or 'localhost' if not set.
 */
export function getHostname() {
  return (process.env.NEXT_PUBLIC_HOSTNAME || 'localhost');
}
