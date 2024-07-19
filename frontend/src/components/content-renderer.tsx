'use client';

import NextImage from 'next/image';
import { Image, TypographyStylesProvider } from '@mantine/core';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';

export interface ContentRendererProps {
  readonly content: BlocksContent;
}

export default function ContentRenderer({content}: ContentRendererProps) {
  if (!content) return null;
  
  return (
    <TypographyStylesProvider>
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({image}) => {
            const imageFormats = image.formats as StrapiImageFormats;
            const imageUrl = (imageFormats?.large?.url) ? getFileURL(imageFormats.large.url) : '';

            // TODO: Handle the case where image has a caption.
            // TODO: Open the full resolution in a full screen modal, on click.
            // TODO: Handle the `srcset` prop, so that we can have the right image for the right resolution.

            return (
              <Image
                className='full-width'
                component={NextImage}
                src={imageUrl}
                width={imageFormats?.large?.width}
                height={imageFormats?.large?.height}
                alt={image.alternativeText || ''}
                radius='md' />
            );
          },
        }}
      />
    </TypographyStylesProvider>
  );
}
