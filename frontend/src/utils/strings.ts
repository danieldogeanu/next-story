

/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param {string | undefined} text - The text to be processed.
 * @returns {string} - The capitalized text, or an empty string if input is undefined.
 */
export function capitalize(text: string | undefined): string {
  if (typeof text === 'string') {
    const textArr = text.split(' ');
    const processedStrArr = textArr.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return processedStrArr.join(' ');
  } else return '';
}
