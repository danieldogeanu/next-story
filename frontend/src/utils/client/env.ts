import { getCurrentUrl } from '@/utils/urls';


/**
 * Retrieves the current Node environment.
 *
 * @returns The current Node environment. Defaults to `development` if not set.
 */
export function getNodeEnv() {
  return (process.env.NODE_ENV || 'development');
}

/**
 * Checks if the application is running in a local environment based on the `LOCAL_ENV` environment variable.
 *
 * @note This environment variable shouldn't be set on the server. We only need it locally so that we can dynamically generate the hostname.
 *
 * @returns Returns `true` if `LOCAL_ENV` is set to a truthy value, otherwise `false`.
 */
export function getLocalEnv() {
  return (String(process.env.LOCAL_ENV).toLowerCase() === 'true');
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
 * Retrieves the front-end URL based on the environment.
 *
 * This function checks if the application is running in a local environment by using `getLocalEnv()`.
 * If running locally, it retrieves the current front-end URL dynamically via `getCurrentUrl()` function.
 * Otherwise, it returns `NEXT_PUBLIC_FRONTEND_URL`. If neither is set, it defaults to 'http://localhost:3000'.
 *
 * @returns The current front-end URL or 'http://localhost:3000' if not set.
 */
export function getFrontEndURL() {
  const currentFrontendUrl = getLocalEnv() ? getCurrentUrl()?.href : process.env.NEXT_PUBLIC_FRONTEND_URL;
  return (currentFrontendUrl || 'http://localhost:3000');
}

/**
 * Retrieves the hostname based on the environment.
 *
 * This function checks if the application is running in a local environment by using `getLocalEnv()`.
 * If running locally, it retrieves the current hostname dynamically via `getCurrentUrl()` function.
 * Otherwise, it returns `NEXT_PUBLIC_HOSTNAME`. If neither is set, it defaults to 'localhost'.
 *
 * @returns The current hostname or 'localhost' if not set.
 */
export function getHostname() {
  const currentHostname = getLocalEnv() ? getCurrentUrl()?.hostname : process.env.NEXT_PUBLIC_HOSTNAME;
  return (currentHostname || 'localhost');
}

/**
 * Retrieves the port number from environment variables.
 *
 * @returns The port number. Defaults to 3000 if not specified in environment variables.
 */
export function getPort() {
  return Number(process.env.NEXT_PORT || '3000');
}
