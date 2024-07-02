import { z as val } from 'zod';

/**
 * Capitalizes the first letter of each word in a given text string.
 *
 * @param {string} text - The text string to capitalize.
 * @returns {string} The capitalized text string. Returns an empty string if the input is not valid.
 */
export function capitalize(text: string): string {
  const textSchema = val.string();
  const parsedText = textSchema.safeParse(text);
  if (!parsedText.success) {
    console.error('Capitalization Error:', parsedText.error.errors[0].message);
    return '';
  }

  const textArr = text.split(' ');
  const processedStrArr = textArr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return processedStrArr.join(' ');
}
