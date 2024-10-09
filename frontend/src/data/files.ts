import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponseArray, GetValues } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';

// Rename Strapi types to make it more clear what we're working with.
export interface FilesResponse extends APIResponseArray<'plugin::upload.file'> {}
export interface SingleFileResponse extends GetValues<'plugin::upload.file'> {}
export interface ExtendedStrapiRequestParams extends StrapiRequestParams {
  start?: number;
  limit?: number;
}

/**
 * Fetches a single file by its ID from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {string | number} id - The ID of the file to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the single file data.
 *
 * @example
 * // Fetch a single file by ID.
 * await getSingleFile(1);
 */
export async function getSingleFile(id: string | number, params?: StrapiRequestParams): Promise<SingleFileResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.plugin.single as unknown as SingleFileResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.findOne('upload/files', id, params) as unknown as SingleFileResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SingleFileResponse;
  }
}

/**
 * Fetches a collection of files from the Strapi backend.
 *
 * At build time, it will return an empty response.
 *
 * @param {ExtendedStrapiRequestParams} [params] - Optional parameters for the request, including pagination.
 * @returns A promise that resolves to the files data.
 *
 * @example
 * // Fetch files using using custom params.
 * await getFilesCollection({ start: 0, limit: 10 });
 */
export async function getFilesCollection(params?: ExtendedStrapiRequestParams): Promise<FilesResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    if (await isBuildTime()) return emptyStrapiResponse.plugin.collection as unknown as FilesResponse;

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
    const strapiResponse = await strapiInstance.find('upload/files', params) as unknown as FilesResponse;
    return strapiResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.plugin.collection as unknown as FilesResponse;
  }
}
