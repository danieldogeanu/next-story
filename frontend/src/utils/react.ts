import { isValidElement, ReactElement, ReactNode } from 'react';

interface TextProps {
  text?: string;
  children?: ReactNode;
}

/**
 * Extracts text content from a ReactNode, including nested nodes.
 *
 * @param {ReactNode} node - The ReactNode from which to extract text.
 * @returns {string} The extracted text content.
 */
export function extractTextFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node.toString();
  }

  if (isValidElement(node)) {
    const { type, props } = node as ReactElement<TextProps>;
    if (typeof type === 'function' && props && props.text) {
      return props.text;
    }

    const children = props.children;
    if (Array.isArray(children)) {
      return children.map(extractTextFromNode).join('');
    }
    return extractTextFromNode(children);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join('');
  }

  // Handling PromiseLikeOfReactNode
  if (node && typeof (node as any).then === 'function') {
    return '';
  }

  return '';
};
