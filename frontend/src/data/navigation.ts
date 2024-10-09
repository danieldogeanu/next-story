import path from 'node:path';
import { StrapiRequestParams } from 'strapi-sdk-js';
import { IconKeys } from '@/components/dynamic-icon';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';
import { GetValues } from '@/types/strapi';

// TODO: Refactor and rename Navigation types and functions.

// Rename and extend Strapi types to make it more clear what we're working with.
export interface NavDataResponse extends GetValues<'plugin::navigation.navigation'> {}
export interface SingleNavResponse extends GetValues<'plugin::navigation.navigation-item'> {
  items: SingleNavResponse[];
  icon?: IconKeys | '';
}
export interface SingleNavRequestParams extends StrapiRequestParams {
  type?: 'FLAT' | 'TREE' | 'RFR';
  orderBy?: string;
  orderDirection?: string;
}

// Navigation specific types.
export type SingleNavSlug = 'main-navigation' | 'legal-navigation';

/**
 * Fetches data for a specific navigation item from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {SingleNavSlug} nav - The slug of the navigation item to fetch.
 * @param {SingleNavRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to an array of navigation item data.
 *
 * @example
 * // Fetch the data for the Main Navigation.
 * await getSingleNavData('main-navigation', { populate: '*', type: 'TREE' });
 */
export async function getSingleNavData(nav: SingleNavSlug, params?: SingleNavRequestParams): Promise<SingleNavResponse[]> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    // Please note that we return a collection here because it's an array of menu items.
    if (await isBuildTime()) return emptyStrapiResponse.plugin.collection as unknown as SingleNavResponse[];

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const navRequestPath = path.join('navigation', 'render', nav);
    const navRequestParams: SingleNavRequestParams = {type: 'TREE', orderBy: 'order', ...params};
    const strapiResponse = await strapiInstance.find(navRequestPath, navRequestParams) as unknown as SingleNavResponse[];
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as SingleNavResponse[];
  }
}

/**
 * Fetches navigation data from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @returns A promise that resolves to an array of navigation data.
 *
 * @example
 * // Fetch the navigation data.
 * await getNavData();
 */
export async function getNavData(): Promise<NavDataResponse[]> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.plugin.collection as unknown as NavDataResponse[];

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('navigation') as unknown as NavDataResponse[];
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as NavDataResponse[];
  }
}
