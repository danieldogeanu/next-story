import { StrapiRequestParams } from "strapi-sdk-js";
import { APIResponseArray, GetValues } from "@/types/strapi";
import { getAPIKey, getBackEndURL } from "@/utils/env";
import { strapiSDK } from "@/data/strapi";

export interface FilesResponse extends APIResponseArray<'plugin::upload.file'> {}

export interface SingleFileResponse extends GetValues<'plugin::upload.file'> {}

export interface ExtendedStrapiRequestParams extends StrapiRequestParams {
  start: number;
  limit: number;
}

/**
 * Fetches a collection of files from the Strapi backend.
 *
 * @param {ExtendedStrapiRequestParams} [params] - Optional parameters for the request, including pagination.
 * @returns A promise that resolves to the files data.
 *
 * @example
 * // Fetch files using using custom params.
 * await getFiles({ start: 0, limit: 10 });
 */
export async function getFiles(params?: ExtendedStrapiRequestParams): Promise<FilesResponse> {
  const strapiInstance = await strapiSDK(await getAPIKey('frontend'));
  const strapiResponse = await strapiInstance.find('upload/files', params) as unknown as FilesResponse;
  return strapiResponse;
}

/**
 * Fetches a single file by its ID from the Strapi backend.
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
  const fileUrl = new URL(url, getBackEndURL());
  return fileUrl.href;
}
