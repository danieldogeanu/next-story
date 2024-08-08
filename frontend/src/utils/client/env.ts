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
 * Retrieves the site's language setting in the specified format.
 *
 * @note IETF format outputs: `en-US`. This is the default for HTML and JavaScript.
 * @note POSIX format outputs: `en_US`. This is the default for Open Graph and Unix/Linux systems.
 * @note The `NEXT_PUBLIC_LANG` env variable should be set in POSIX format, because it might be used in Docker and other places, at the OS level.
 *
 * @param {'ietf' | 'posix'} [format='ietf'] - The format of the language setting. Can be 'ietf' (default) or 'posix'.
 * @returns The site's language setting in the specified format. Defaults to 'en' if not set.
 */
export function getSiteLang(format: 'ietf' | 'posix' = 'ietf') {
  const publicLang = (process.env.NEXT_PUBLIC_LANG || 'en');
  if (format === 'posix') return publicLang.replace('-', '_');
  return publicLang.replace('_', '-');
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
 * Retrieves the front-end URL from environment variables.
 *
 * @returns The front-end URL. Defaults to 'http://localhost:3000' if not specified in environment variables.
 */
export function getFrontEndURL() {
  return (process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
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

/**
 * Retrieves the port number from environment variables.
 *
 * @returns The port number. Defaults to 3000 if not specified in environment variables.
 */
export function getPort() {
  return Number(process.env.NEXT_PORT || '3000');
}
