import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponseArray, GetValues } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { getBackEndURL } from '@/utils/client/env';
import { strapiSDK } from '@/data/strapi';
import buildTimeFiles from '@build-data/files.json';

export interface FilesResponse extends APIResponseArray<'plugin::upload.file'> {}

export interface SingleFileResponse extends GetValues<'plugin::upload.file'> {}

export interface ExtendedStrapiRequestParams extends StrapiRequestParams {
  start?: number;
  limit?: number;
}

/**
 * Fetches a collection of files from the Strapi backend.
 *
 * At build time, it will return a collection of files from a static JSON file.
 *
 * @param {ExtendedStrapiRequestParams} [params] - Optional parameters for the request, including pagination.
 * @returns A promise that resolves to the files data.
 *
 * @example
 * // Fetch files using using custom params.
 * await getFiles({ start: 0, limit: 10 });
 */
export async function getFiles(params?: ExtendedStrapiRequestParams): Promise<FilesResponse> {
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We only take into account `start` and `limit` optional params, and ignore all the rest.
  if (await isBuildTime()) return buildTimeFiles.slice(
    Number(params?.start || 0), (params?.limit) ? Number(params?.start || 0) + Number(params.limit) : undefined
  ) as unknown as FilesResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('upload/files', params) as unknown as FilesResponse;
  return strapiResponse;
}

/**
 * Fetches a single file by its ID from the Strapi backend.
 *
 * At build time, it will return a single file from a static JSON file.
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
  // At build time we load a static JSON file generated from fetcher container,
  // because we don't have networking available to make requests directly to Strapi backend.
  // We ignore all optional parameters for this one, as we already populated all the fields.
  if (await isBuildTime()) return buildTimeFiles.filter(
    (file) => (file.id === Number(id))
  ).pop() as unknown as SingleFileResponse;

  // Otherwise we just make the requests to the live Strapi backend.
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.findOne('upload/files', id, params) as unknown as SingleFileResponse;
  return strapiResponse;
}

/**
 * Constructs a full URL for a given file path.
 *
 * @param {string} url - The relative URL of the file.
 * @returns {string} The full URL of the file.
 *
 * @example
 * // Get the full URL of a file.
 * const fileUrl = getFileURL('/uploads/myfile.jpg');
 * console.log(fileUrl); // 'https://backend-url.com/uploads/myfile.jpg'
 */
export function getFileURL(url: string): string {
  let fileUrl = new URL('', getBackEndURL());

  if (typeof url !== 'string') {
    console.error('The URL provided is not a string:', JSON.stringify(url));
    return fileUrl.href;
  }

  if (!/^\/(?!\/|[a-zA-Z0-9_-]+:).*\.[a-z]+$/i.test(url)) {
    console.error('The URL provided is not a relative path or doesn\'t have a file extension:', JSON.stringify(url));
    return fileUrl.href;
  }

  fileUrl = new URL(url, getBackEndURL());
  return fileUrl.href;
}
