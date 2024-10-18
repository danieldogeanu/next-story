import path from 'node:path';
import { StrapiRequestParams } from 'strapi-sdk-js';
import { IconKeys } from '@/components/dynamic-icon';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';
import { getAPIKey } from '@/utils/server/env';
import { GetValues } from '@/types/strapi';

// Rename and extend Strapi types to make it more clear what we're working with.
export interface NavCollectionResponse extends GetValues<'plugin::navigation.navigation'> {}
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
 * @param {SingleNavSlug} nav - The slug of the navigation item to fetch.
 * @param {SingleNavRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to an array of navigation item data.
 *
 * @example
 * // Fetch the data for the Main Navigation.
 * await getSingleNav('main-navigation', { populate: '*', type: 'TREE' });
 */
export async function getSingleNav(nav: SingleNavSlug, params?: SingleNavRequestParams): Promise<SingleNavResponse[]> {
  try {
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
 * @returns A promise that resolves to an array of navigation data.
 *
 * @example
 * // Fetch the navigation data.
 * await getNavCollection();
 */
export async function getNavCollection(): Promise<NavCollectionResponse[]> {
  try {
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('navigation') as unknown as NavCollectionResponse[];
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.collection as unknown as NavCollectionResponse[];
  }
}
