'use client';

import { TypographyStylesProvider } from '@mantine/core';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export interface ContentRendererProps {
  readonly content: BlocksContent;
}

// TODO: Replace `image` and `link` components with Next.js/Mantine components.

export default function ContentRenderer({content}: ContentRendererProps) {
  if (!content) return null;
  
  return (
    <TypographyStylesProvider>
      <BlocksRenderer
        content={content}
      />
    </TypographyStylesProvider>
  );
}
