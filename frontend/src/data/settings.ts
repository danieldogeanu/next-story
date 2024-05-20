import { StrapiRequestParams } from "strapi-sdk-js";
import { APIResponse } from "@/types/strapi";
import { strapiSDK } from "@/data/strapi";

export interface SiteSettingsResponse extends APIResponse<'api::site-setting.site-setting'> {}

/**
 * Fetches site settings from the Strapi backend.
 *
 * @param {StrapiRequestParams} [params] - Optional Strapi request parameters.
 * @returns A promise that resolves to the site settings data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the site settings with default parameters.
 * await getSiteSettings() as SiteSettingsResponse;
 */
export async function getSiteSettings(params?: StrapiRequestParams): Promise<SiteSettingsResponse> {
  const strapiInstance = await strapiSDK();
  const strapiRequestParams: StrapiRequestParams = {populate: '*', ...params};
  const strapiResponse = await strapiInstance.find('site-setting', strapiRequestParams) as SiteSettingsResponse;
  return strapiResponse;
}
