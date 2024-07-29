import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import buildTimeSettingsData from '@build-data/site-setting.json';

export interface SiteSettingsResponse extends APIResponse<'api::site-setting.site-setting'> {}

// Extract smaller subtypes that can be used to further work with data.
export type SiteSettings = NonNullable<SiteSettingsResponse['data']>['attributes'];
export type SiteCover = NonNullable<SiteSettings['siteCover']>['data']['attributes'];
export type SiteLogo = NonNullable<SiteSettings['siteLogo']>['data']['attributes'];
export type SiteLogoLight = NonNullable<SiteSettings['siteLogoLight']>['data']['attributes'];
export type SiteLogoDark = NonNullable<SiteSettings['siteLogoDark']>['data']['attributes'];
export type SiteSocialNetworks = NonNullable<SiteSettings['socialNetworks']>;
export type SiteRobots = NonNullable<SiteSettings['siteRobots']>;

/**
 * Fetches site settings from the Strapi backend.
 *
 * At build time, it will return site settings from a static JSON file.
 *
 * @param {StrapiRequestParams} [params] - Optional Strapi request parameters.
 * @returns A promise that resolves to the site settings data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the site settings with default parameters.
 * await getSiteSettings();
 */
export async function getSiteSettings(params?: StrapiRequestParams): Promise<SiteSettingsResponse> {
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeSettingsData as unknown as SiteSettingsResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiRequestParams: StrapiRequestParams = {populate: '*', ...params};
  const strapiResponse = await strapiInstance.find('site-setting', strapiRequestParams) as SiteSettingsResponse;
  return strapiResponse;
}
