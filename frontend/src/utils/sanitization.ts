import DOMPurify from 'dompurify';

// We initialize a fake DOM, because we don't have `window` object in Node.
// DOMPurify requires a `window` object to do its magic.
let purify: ReturnType<typeof DOMPurify>;
if (typeof window === 'undefined') {
  // Server-Side DOMPurify setup uses JSDOM to get the `window` object.
  // We use require to avoid bundling it in the client.
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  purify = DOMPurify(window);
} else {
  // Client-Side DOMPurify uses the actual `window` object.
  purify = DOMPurify(window);
}

/**
 * Sanitizes a string using the DOMPurify library.
 *
 * @param {string | undefined} dirty - The string to sanitize.
 * @returns {string | undefined} - The sanitized string, or `undefined` if input is not a string.
 */
export function sanitizeString(dirty: string | undefined): string | undefined {
  if (typeof dirty === 'string') return purify.sanitize(dirty as string);
}

/**
 * Sanitizes an array of strings, filtering out undefined or empty values.
 *
 * @param {string[] | undefined} dirty - The array of strings to sanitize.
 * @returns {string[] | undefined} - The sanitized array, or `undefined` if input is not valid.
 */
export function sanitizeStringArray(dirty: string[] | undefined): string[] | undefined {
  if (Array.isArray(dirty) && dirty.length !== 0) {
    return dirty.map(sanitizeString).filter(
      (item): item is string => (typeof item === 'string' && item !== '')
    );
  }
}

/**
 * Sanitizes a DOM node using the DOMPurify library.
 *
 * @param {Node | undefined} dirty - The DOM node to sanitize.
 * @returns {Node | undefined} - The sanitized DOM node, or `undefined` if input is not a valid node.
 */
export function sanitizeNode(dirty: Node | undefined): Node | undefined {
  if (typeof dirty === 'object' && dirty instanceof Node) {
    return purify.sanitize(dirty as Node, { RETURN_DOM: true });
  }
}

/**
 * Sanitizes an array of DOM nodes, filtering out undefined values.
 *
 * @param {Node[] | undefined} dirty - The array of DOM nodes to sanitize.
 * @returns {Node[] | undefined} - The sanitized array, or `undefined` if input is not valid.
 */
export function sanitizeNodeArray(dirty: Node[] | undefined): Node[] | undefined {
  if (Array.isArray(dirty) && dirty.length !== 0) {
    return dirty.map(sanitizeNode).filter((item): item is Node => (typeof item !== 'undefined'));
  }
}

