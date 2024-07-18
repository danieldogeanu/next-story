'use client';

import { TypographyStylesProvider } from '@mantine/core';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export interface ContentRendererProps {
  readonly content: BlocksContent;
}

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
