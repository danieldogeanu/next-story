import { StrapiRequestParams } from 'strapi-sdk-js';
import { IconKeys } from '@/components/dynamic-icon';
import { strapiSDK } from '@/data/strapi';
import { GetValues } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import buildTimeNavData from '@build-data/navigation.json';
import buildTimeMainNavData from '@build-data/main-navigation.json';
import buildTimeLegalNavData from '@build-data/legal-navigation.json';
import path from 'node:path';

export type NavDataResponse = GetValues<'plugin::navigation.navigation'>;

export type SingleNavSlug = 'main-navigation' | 'legal-navigation';

export interface SingleNavRequestParams extends StrapiRequestParams {
  type?: 'FLAT' | 'TREE' | 'RFR';
  orderBy?: string;
  orderDirection?: string;
}

export type SingleNavResponse = GetValues<'plugin::navigation.navigation-item'> & {
  items: SingleNavResponse[];
  icon?: IconKeys | '';
};

/**
 * Fetches navigation data from the Strapi backend.
 *
 * At build time, it will return navigation data from a static JSON file.
 *
 * @returns A promise that resolves to an array of navigation data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the navigation data.
 * await getNavData();
 */
export async function getNavData(): Promise<NavDataResponse[]> {
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeNavData as unknown as NavDataResponse[];

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('navigation') as unknown as NavDataResponse[];
  return strapiResponse;
}

/**
 * Fetches data for a specific navigation item from the Strapi backend.
 *
 * At build time, it will return navigation data from a static JSON file.
 *
 * @param {SingleNavSlug} nav - The slug of the navigation item to fetch.
 * @param {SingleNavRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to an array of navigation item data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the data for the Main Navigation.
 * await getSingleNavData('main-navigation', { populate: '*', type: 'TREE' });
 */
export async function getSingleNavData(nav: SingleNavSlug, params?: SingleNavRequestParams): Promise<SingleNavResponse[]> {
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime() && nav === 'main-navigation') return buildTimeMainNavData as unknown as SingleNavResponse[];
  if (await isBuildTime() && nav === 'legal-navigation') return buildTimeLegalNavData as unknown as SingleNavResponse[];

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const navRequestPath = path.join('navigation', 'render', nav);
  const navRequestParams: SingleNavRequestParams = {type: 'TREE', orderBy: 'order', ...params};
  const strapiResponse = await strapiInstance.find(navRequestPath, navRequestParams) as unknown as SingleNavResponse[];
  return strapiResponse;
}
