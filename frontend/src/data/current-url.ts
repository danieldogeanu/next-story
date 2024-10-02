

/**
 * Singleton class to manage the current URL for the application dynamically.
 *
 * @warning This class is only for local development environment, it's not meant to be used in production!
 */
class CurrentURLSingleton {
  private static instance: CurrentURLSingleton;
  private url: URL | null = null;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {}

  /**
   * Gets the Singleton instance of the CurrentURLSingleton.
   * @returns {CurrentURLSingleton} The singleton instance.
   */
  public static getInstance(): CurrentURLSingleton {
    if (!CurrentURLSingleton.instance) {
      CurrentURLSingleton.instance = new CurrentURLSingleton();
    }
    return CurrentURLSingleton.instance;
  }

  /**
   * Sets the current URL.
   *
   * This method allows external code to update the URL stored in this singleton.
   * If the URL is set, it will be accessible via the `getURL` method.
   *
   * @param {URL} url - The URL to set as the current URL.
   */
  public setURL(url: URL): void {
    if (url instanceof URL) this.url = url;
  }

  /**
   * Gets the current URL.
   *
   * This method retrieves the URL previously set by the `setURL` method.
   * If no URL has been set, it returns null.
   *
   * @returns {URL | null} The current URL if set, otherwise null.
   */
  public getURL(): URL | null {
    return this.url;
  }
}

/**
 * The singleton instance of CurrentURLSingleton for external usage.
 *
 * @warning This class is only for local development environment, it's not meant to be used in production!
 */
export const CurrentURL = CurrentURLSingleton.getInstance();
