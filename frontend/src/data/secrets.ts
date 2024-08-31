import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, APIResponseData } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { strapiSDK } from '@/data/strapi';

// Rename Strapi types to make it more clear what we're working with.
export interface FrontendSecretsData extends APIResponseData<'api::frontend-secret.frontend-secret'> {}
export interface BackendSecretsData extends APIResponseData<'api::backend-secret.backend-secret'> {}
export interface FrontendSecretsResponse extends APIResponse<'api::frontend-secret.frontend-secret'> {}
export interface BackendSecretsResponse extends APIResponse<'api::backend-secret.backend-secret'> {}

// Secrets specific types.
export type SiteSecretsType = 'frontend' | 'backend';

export interface SecretEntry {
  id: number;
  name: string;
  value: string;
}

/**
 * Fetches site secrets from the Strapi backend based on the type of secrets chosen.
 *
 * @param {SiteSecretsType} secretsType - The type of secrets to fetch ('frontend' or 'backend').
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the secrets data or null.
 * @throws {Error} Throws an error if no site secrets are found for the provided secrets type.
 *
 * @example
 * // Fetch frontend secrets.
 * await getSiteSecrets('frontend');
 */
export async function getSiteSecrets(
  secretsType: SiteSecretsType, params?: StrapiRequestParams
): Promise<FrontendSecretsResponse | BackendSecretsResponse | null> {
  const strapiInstance = await strapiSDK(await getAPIKey(secretsType));
  const strapiRequestParams: StrapiRequestParams = {populate: '*', ...params};

  // At build time we return null, because we don't want to expose
  // our secrets to static and unsecure JSON files.
  if (await isBuildTime()) return null;

  if (secretsType === 'frontend') {
    return await strapiInstance.find('frontend-secret', strapiRequestParams) as FrontendSecretsResponse;
  }

  if (secretsType === 'backend') {
    return await strapiInstance.find('backend-secret', strapiRequestParams) as BackendSecretsResponse;
  }

  throw new Error('No site secrets found for the provided secrets type.');
}

/**
 * Fetches a single site secret from the Strapi API by its name.
 *
 * @param {SiteSecretsType} secretType - The type of secret ('frontend' or 'backend').
 * @param {string} secretName - The name of the secret to fetch.
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the secret entry if found, otherwise undefined.
 * @throws {Error} Throws an error if fetching site secrets fails.
 *
 * @example
 * // Fetch a single backend secret by name.
 * await getSingleSiteSecret('backend', 'mySecretName');
 */
export async function getSingleSiteSecret(
  secretType: SiteSecretsType, secretName: string, params?: StrapiRequestParams
): Promise<SecretEntry | undefined> {
  const siteSecrets = await getSiteSecrets(secretType, params);
  if (siteSecrets) return siteSecrets.data.attributes.secretEntries?.filter(
    (item) => (item.name === secretName)
  ).pop() as SecretEntry;
}
