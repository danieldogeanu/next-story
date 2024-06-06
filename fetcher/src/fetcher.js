import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { getNodeEnv } from './utils.js';

/**
 * List of endpoint objects to fetch data from. The endpoints should shave the following shape:
 * {{endpoint: string, for: 'frontend' | 'backend', query: Object}[]}
 */
const ENDPOINTS = [
  {endpoint: 'articles', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'authors', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'categories', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'categories', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'pages', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'tags', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'upload/files', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'navigation', for: 'frontend', query: {populate: '*'}},
  {endpoint: 'site-setting', for: 'frontend', query: {populate: '*'}},
];
const DATA_DIR = '../data';

// Load the environment variables from .env file if we're not in a Docker container.
if (getNodeEnv() === 'localhost') {
  dotenv.config({
    path: path.resolve(process.cwd(), '..', '.env'),
  });
}


