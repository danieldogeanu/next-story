import { StrapiRequestParams } from 'strapi-sdk-js';
import { strapiSDK } from '@/data/strapi';
import { GetValues } from '@/types/strapi';
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
};

/**
 * Fetches navigation data from the Strapi backend.
 *
 * @returns A promise that resolves to an array of navigation data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the navigation data.
 * await getNavData() as NavDataResponse[];
 */
export async function getNavData(): Promise<NavDataResponse[]> {
  const strapiInstance = await strapiSDK();
  const strapiResponse = await strapiInstance.find('navigation') as unknown as NavDataResponse[];
  return strapiResponse;
}

/**
 * Fetches data for a specific navigation item from the Strapi backend.
 *
 * @param {SingleNavSlug} nav - The slug of the navigation item to fetch.
 * @param {SingleNavRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to an array of navigation item data.
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // Fetch the data for the Main Navigation.
 * await getSingleNavData('main-navigation', { populate: '*', type: 'TREE' }) as SingleNavResponse[];
 */
export default async function getSingleNavData(nav: SingleNavSlug, params?: SingleNavRequestParams): Promise<SingleNavResponse[]> {
  const strapiInstance = await strapiSDK();
  const navRequestPath = path.join('navigation', 'render', nav);
  const navRequestParams: SingleNavRequestParams = {type: 'TREE', orderBy: 'order', ...params};
  const strapiResponse = await strapiInstance.find(navRequestPath, navRequestParams) as unknown as SingleNavResponse[];
  return strapiResponse;
}
