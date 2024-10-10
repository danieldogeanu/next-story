import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseData, IDProperty } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';

// Rename Strapi types to make it more clear what we're working with.
export interface SiteSettingsData extends APIResponseData<'api::site-setting.site-setting'> {}
export interface PageSettingsData extends APIResponseData<'api::page-setting.page-setting'> {}
export interface SiteSettingsResponse extends APIResponse<'api::site-setting.site-setting'> {}
export interface PageSettingsResponse extends APIResponse<'api::page-setting.page-setting'> {}

// Extract smaller site settings subtypes that can be used to further work with data.
export type SiteSettings = NonNullable<SiteSettingsResponse['data']>['attributes'];
export type SiteCover = NonNullable<SiteSettings['siteCover']>['data']['attributes'];
export type SiteLogo = NonNullable<SiteSettings['siteLogo']>['data']['attributes'];
export type SiteLogoLight = NonNullable<SiteSettings['siteLogoLight']>['data']['attributes'];
export type SiteLogoDark = NonNullable<SiteSettings['siteLogoDark']>['data']['attributes'];
export type SiteSocialNetworks = NonNullable<SiteSettings['socialNetworks']>;
export type SiteRobots = NonNullable<SiteSettings['siteRobots']>;

// Extract smaller page settings subtypes that can be used to further work with data.
export type PageSettings = NonNullable<PageSettingsResponse['data']['attributes']['pageSettings']>;
export type PageSettingsEntry = PageSettings[number] & IDProperty;
export type PageCover = NonNullable<PageSettingsEntry['cover']>['data']['attributes'];
export type PageRobots = NonNullable<PageSettingsEntry['robots']>;
export type PageMetaSocial = NonNullable<PageSettingsEntry['metaSocial']>;
export type PageMetaSocialEntry = PageMetaSocial[number] & IDProperty;

/**
 * Fetches site settings from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {StrapiRequestParams} [params] - Optional Strapi request parameters.
 * @returns A promise that resolves to the site settings data.
 *
 * @example
 * // Fetch the site settings with default parameters.
 * await getSiteSettings();
 */
export async function getSiteSettings(params?: StrapiRequestParams): Promise<SiteSettingsResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    // Please note that we return `single` here because it's single type, not a collection.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as SiteSettingsResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiRequestParams: StrapiRequestParams = {populate: '*', ...params};
    const strapiResponse = await strapiInstance.find('site-setting', strapiRequestParams) as SiteSettingsResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SiteSettingsResponse;
  }
}

/**
 * Fetches page settings from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {StrapiRequestParams} [params] - Optional Strapi request parameters.
 * @returns A promise that resolves to the page settings data.
 *
 * @example
 * // Fetch the page settings with default parameters.
 * await getPageSettings();
 */
export async function getPageSettings(params?: StrapiRequestParams): Promise<PageSettingsResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    // Please note that we return `single` here because it's single type, not a collection.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as PageSettingsResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiRequestParams: StrapiRequestParams = {populate: { pageSettings: { populate: '*' } }, ...params};
    const strapiResponse = await strapiInstance.find('page-setting', strapiRequestParams) as PageSettingsResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as PageSettingsResponse;
  }
}

/**
 * Fetches settings for a single page from Strapi.
 *
 * At build time, it will return an empty response.
 *
 * @note The `page` here refers to top-level pages for collections (like `categories`, for example),
 * that can't have their settings and data saved at collection level in Strapi.
 *
 * @note Homepage settings are covered in the global site settings.
 *
 * @param {string} page - The name of the page to retrieve settings for.
 * @param {StrapiRequestParams} [params] - Optional Strapi request parameters.
 * @returns A promise that resolves to the page settings if found, or undefined if not.
 *
 * @example
 * // Fetch settings for a specific page.
 * getSinglePageSettings('categories');
 */
export async function getSinglePageSettings(page: string, params?: StrapiRequestParams): Promise<PageSettingsEntry | undefined> {
  const pageSettings = await getPageSettings(params);
  if (pageSettings && typeof page === 'string') {
    return pageSettings.data?.attributes?.pageSettings?.filter(
      (pageSetting) => (pageSetting.page === page.toLowerCase())
    ).pop() as PageSettingsEntry;
  }
}
