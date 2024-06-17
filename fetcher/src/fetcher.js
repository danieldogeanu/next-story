import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { getNodeEnv, getAPIKey, getBackEndURL } from './utils.js';
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
  {endpoint: 'navigation/render/main-navigation', keyFor: 'frontend', params: {populate: '*', type: 'TREE', orderBy: 'order'}},
  {endpoint: 'navigation/render/legal-navigation', keyFor: 'frontend', params: {populate: '*', type: 'TREE', orderBy: 'order'}},
  {endpoint: 'site-setting', keyFor: 'frontend', params: {populate: '*'}},
];
const DATA_DIR = '/data';

// Load the environment variables from .env file if we're not in a Docker container.
if (getNodeEnv() === 'localhost') {
  dotenv.config({
    path: path.resolve(process.cwd(), '..', 'prod.env'),
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
 */
function saveData(endpoint, data) {
  try {
    const fileName = String(endpoint).split('/').pop() + '.json';
    const filePath = path.join(process.cwd(), DATA_DIR, fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`Data saved to ${filePath}.`);
  } catch (error) {
    console.error(`Failed to save data:`, error.message);
  }
}

/**
 * Continuously checks the availability of the Strapi backend and fetches data from predefined endpoints once available.
 *
 * This function will log the progress and retry fetching from Strapi every 5 seconds until it becomes available. Once available,
 * it fetches data from the defined endpoints and saves it locally.
 *
 * @returns {Promise<void>} A promise that resolves once all data is fetched and saved.
 * @throws {Error} Logs errors related to fetching data from Strapi or saving data locally.
 */
async function fetcher() {
  console.log('Waiting for Strapi...');
  let strapiAvailable = false;
  while (!strapiAvailable) {
    try {
      const strapiResponse = await fetch(getBackEndURL());
      if (strapiResponse.status === 200) strapiAvailable = true;
    } catch (error) {
      console.log('Strapi is not available yet, retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Strapi is up! Fetching data...');
  for (const endpoint of ENDPOINTS) {
    const data = await getData(endpoint);
    saveData(endpoint.endpoint, data);
  }
  console.log('Data fetching completed.');
}

// Fetch the data from Strapi or log the error and exit the process.
fetcher().catch((error) => {
  console.error('Fetcher Error:', error);
  process.exit(1);
});
