'use client';

import NextImage from 'next/image';
import NextLink from 'next/link';
import { Image, TypographyStylesProvider } from '@mantine/core';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiImageFormats } from '@/types/strapi';
import { isExternalUrl } from '@/utils/urls';
import { getFileURL } from '@/data/files';
import styles from '@/styles/content-renderer.module.scss';

export interface ContentRendererProps {
  readonly content: BlocksContent;
}

export default function ContentRenderer({content}: ContentRendererProps) {
  if (!content) return null;
  
  return (
    <TypographyStylesProvider className={styles.typography}>
      <BlocksRenderer
        content={content}
        blocks={{

          image: ({image}) => {
            const imageFormats = image.formats as StrapiImageFormats;
            const imageUrl = (imageFormats?.large?.url) ? getFileURL(imageFormats.large.url) : '';

            // TODO: Open the full resolution in a full screen modal, on click.
            // TODO: Handle the `srcset` prop, so that we can have the right image for the right resolution.

            return (
              <figure className='full-width'>
                <Image
                  component={NextImage}
                  src={imageUrl}
                  width={imageFormats?.large?.width}
                  height={imageFormats?.large?.height}
                  alt={image.alternativeText || ''}
                  radius='md' />
                {(image.caption && image.caption !== '') &&
                  <figcaption title='Image Caption'>{image.caption}</figcaption>}
              </figure>
            );
          },

          link: ({children, url}) => {
            return (
              isExternalUrl(url)
                ? <a className='external' href={url} target='_blank' referrerPolicy='no-referrer'>{children}</a>
                : <NextLink className='internal' href={url}>{children}</NextLink>
            );
          },

        }}
      />
    </TypographyStylesProvider>
  );
}
