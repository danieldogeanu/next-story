'use client';

import NextImage from 'next/image';
import NextLink from 'next/link';
import { Children } from 'react';
import { IconQuote } from '@tabler/icons-react';
import { Blockquote, Image, TypographyStylesProvider } from '@mantine/core';
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiImageFormats } from '@/types/strapi';
import { extractTextFromNode } from '@/utils/react';
import { getFileURL, isExternalUrl } from '@/utils/urls';
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
            const imageUrl = (imageFormats?.large?.url) ? getFileURL(imageFormats.large.url) : getFileURL(image?.url);

            // TODO: Open the full resolution in a full screen modal, on click.
            // TODO: Handle the `srcset` prop, so that we can have the right image for the right resolution.

            return (
              <figure className='full-width'>
                <Image
                  component={NextImage}
                  src={imageUrl}
                  width={imageFormats?.large?.width ?? image?.width}
                  height={imageFormats?.large?.height ?? image?.height}
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

          quote: ({children}) => {
            const childNode = Children.toArray(children).pop();
            const textArray = extractTextFromNode(childNode).split('-');
            const blockquoteText = (textArray[0]) ? textArray[0].trim() : '';
            const citeAuthor = (textArray[1]) ? '— ' + textArray[1].trim() : '';

            return (
              <Blockquote cite={citeAuthor} icon={<IconQuote size={36} stroke={2} />} iconSize={60}>
                {blockquoteText}
              </Blockquote>
            );
          },

          code: ({plainText}) => {            
            return (
              <div className='code-block'>
                <pre><code>{plainText}</code></pre>
              </div>
            );
          },

        }}
      />
    </TypographyStylesProvider>
  );
}
