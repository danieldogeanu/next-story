import { z as val } from 'zod';

/**
 * Validates an API key to ensure it meets specific criteria.
 *
 * @param {string | undefined} apiKey - The API key to validate.
 * @returns {boolean} Returns true if the API key is valid, otherwise false.
 * @throws {Error} Logs a validation error if the API key does not meet the criteria.
 */
export function validateApiKey(apiKey) {
  // Define the schema for the API key.
  const apiKeyLength = 256;
  const apiKeyPattern = new RegExp(`^[a-zA-Z0-9]{${apiKeyLength}}$`);
  const apiKeySchema = val.string({
    message: 'API key must be a string.'
  }).length(apiKeyLength, {
    message: `API key must be exactly ${apiKeyLength} characters long.`
  }).regex(apiKeyPattern, {
    message: 'API key must be alphanumeric.'
});

  try {
    apiKeySchema.parse(apiKey);
    return true;
  } catch (error) {
    if (error instanceof val.ZodError) {
      console.error('Validation Error:', error.errors);
    }
    return false;
  }
}
