

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

/**
 * Trims a string to a specified length and appends an ellipsis if it exceeds the limit.
 *
 * If the string ends with an ellipsis (`...`), it removes it before processing. The function ensures
 * that the resulting string, including the ellipsis (if added), does not exceed the specified limit.
 *
 * @param {string | undefined} text - The text to limit. If undefined, the function returns `undefined`.
 * @param {number} [limit=160] - The maximum length of the resulting string, including the ellipsis. Defaults to 160.
 * @returns {string} The trimmed string with an ellipsis if it exceeds the limit, or the original string if within the limit. \
 *    Returns an empty string if the input is not a string.
 */
export function limitText(text: string | undefined, limit: number = 160): string {
  if (typeof text === 'string') {
    const processedText = (text?.endsWith('...')) ? text.replace('...', '') : text;

    if (processedText.length > limit - 3) {
      return processedText.trim().substring(0, limit - 3) + '...';
    } else return processedText.trim();
  } else return '';
}
