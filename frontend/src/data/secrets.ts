import { StrapiRequestParams } from 'strapi-sdk-js';
import { APIResponse, IDProperty } from '@/types/strapi';
import { getAPIKey, isBuildTime } from '@/utils/server/env';
import { emptyStrapiResponse, strapiSDK } from '@/data/strapi';

// TODO: Move Secrets to a separate secrets manager app for proper security.

// Rename Strapi interfaces to make it more clear what we're working with.
export interface FrontendSecretsResponse extends APIResponse<'api::frontend-secret.frontend-secret'> {}
export interface BackendSecretsResponse extends APIResponse<'api::backend-secret.backend-secret'> {}

// Merge Strapi interfaces of the same type.
export type SecretsResponse = FrontendSecretsResponse & BackendSecretsResponse;

// Secrets specific types.
export type SecretType = 'frontend' | 'backend';
export type SecretEntry = IDProperty & NonNullable<SecretsResponse['data']['attributes']['secretEntries']>[number];

/**
 * Fetches site secrets from the Strapi backend based on the type of secrets chosen.
 *
 * At build time, it will return an empty response.
 *
 * @param {SecretType} secretsType - The type of secrets to fetch ('frontend' or 'backend').
 * @param {StrapiRequestParams} [params] - Optional parameters for the request.
 * @returns A promise that resolves to the secrets data.
 * @throws {Error} Throws an error if no site secrets are found for the provided secrets type.
 *
 * @example
 * // Fetch frontend secrets.
 * await getSiteSecrets('frontend');
 */
export async function getSiteSecrets(
  secretsType: SecretType, params?: StrapiRequestParams
): Promise<SecretsResponse> {
  try {
    // At build time we return an empty response, because we don't have
    // networking available to make requests directly to Strapi backend.
    // Please note that we return `single` here because it's single type, not a collection.
    if (await isBuildTime()) return emptyStrapiResponse.api.single as unknown as SecretsResponse;

    // Make sure the secrets type exists, otherwise throw an error.
    if (typeof secretsType !== 'string' || !['frontend', 'backend'].includes(secretsType)) {
      throw new Error('No site secrets found for the provided secrets type.');
    }

    // Otherwise we just make the requests to the live Strapi backend.
    const strapiInstance = await strapiSDK(await getAPIKey(secretsType));
    const strapiRequestParams: StrapiRequestParams = {populate: '*', ...params};
    return await strapiInstance.find(`${secretsType}-secret`, strapiRequestParams) as SecretsResponse;
  } catch (e) {
    console.error('Error:', (e instanceof Error) ? e.message : e);
    return emptyStrapiResponse.api.single as unknown as SecretsResponse;
  }
}

/**
 * Fetches a single site secret from the Strapi API by its name.
 *
 * @param {SecretType} secretType - The type of secret ('frontend' or 'backend').
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
  secretType: SecretType, secretName: string, params?: StrapiRequestParams
): Promise<SecretEntry | undefined> {
  const siteSecrets = await getSiteSecrets(secretType, params);
  if (siteSecrets) return siteSecrets.data?.attributes?.secretEntries?.filter(
    (item) => (item.name === secretName)
  ).pop() as SecretEntry;
}
