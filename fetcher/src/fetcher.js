import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { getNodeEnv, getAPIKey } from './utils.js';
import { strapiSDK } from './strapi.js';

/**
 * List of endpoint objects to fetch data from. The endpoints should shave the following shape:
 * {{endpoint: string, keyFor: 'frontend' | 'backend', params: Object}[]}
 */
const ENDPOINTS = [
  {endpoint: 'articles', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'authors', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'categories', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'categories', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'pages', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'tags', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'upload/files', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'navigation', keyFor: 'frontend', params: {populate: '*'}},
  {endpoint: 'site-setting', keyFor: 'frontend', params: {populate: '*'}},
];
const DATA_DIR = '/data';

// Load the environment variables from .env file if we're not in a Docker container.
if (getNodeEnv() === 'localhost') {
  dotenv.config({
    path: path.resolve(process.cwd(), '..', '.env'),
  });
}

/**
 * Fetches data from a specified endpoint in the Strapi backend.
 *
 * @param {Object} requestObj - The requestObj object.
 * @param {string} requestObj.endpoint - The Strapi API endpoint to fetch data from.
 * @param {'frontend' | 'backend'} requestObj.keyFor - The type of API key to use ('frontend' or 'backend').
 * @param {Object} [requestObj.params] - Optional parameters for the request.
 * @returns {Promise<Object>} A promise that resolves to the fetched data.
 * @throws {Error} Logs an error if the data fetching fails.
 *
 * @example
 * // Fetch data from a specific endpoint.
 * await getData({
 *   endpoint: 'articles',
 *   keyFor: 'frontend',
 *   params: { populate: '*', sort: 'createdAt:desc' }
 * });
 */
async function getData({endpoint, keyFor, params}) {
  try {
    const strapiInstance = await strapiSDK(await getAPIKey(keyFor));
    const strapiResponse = await strapiInstance.find(endpoint, params);
    return strapiResponse;
  } catch (error) {
    console.error(`Error fetching data from /${endpoint}:`, error.message);
  }
}

/**
 * Saves data to a JSON file in the specified directory.
 *
 * @param {string} endpoint - The endpoint associated with the data. This will be used to name the file.
 * @param {Object} data - The data object to save to save to the file.
 * @throws {Error} Logs an error if the data saving fails.
 *
 * @example
 * // Save data from Strapi to a JSON file.
 * saveData('articles', { id: 1, title: 'My Article' });
 */
function saveData(endpoint, data) {
  try {
    const fileName = String(endpoint).replace('/', '-') + '.json';
    const filePath = path.join(process.cwd(), DATA_DIR, fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`Data saved to ${filePath}.`);
  } catch (error) {
    console.error(`Failed to save data:`, error.message);
  }
}

const data = await getData(
  {endpoint: 'upload/files', keyFor: 'frontend', params: {populate: '*', limit: 4}},
);

saveData('upload/files', data);
