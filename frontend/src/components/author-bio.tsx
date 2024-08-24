import classNames from 'classnames';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { IconUser } from '@tabler/icons-react';
import { Box, BoxProps, Button, Group, Image, Text, Title } from '@mantine/core';
import { ArticleAuthor } from '@/data/articles';
import { AuthorAvatar } from '@/data/authors';
import { StrapiImageFormats } from '@/types/strapi';
import { makeSeoDescription } from '@/utils/client/seo';
import { getFileURL, getPageUrl } from '@/utils/urls';
import { convertToRelativeDate } from '@/utils/date';
import { capitalize } from '@/utils/strings';
import styles from '@/styles/author-bio.module.scss';

export interface AuthorBioProps extends BoxProps {
  data: ArticleAuthor;
}

export default function AuthorBio({data, className, ...other}: AuthorBioProps) {
  const authorUrl = getPageUrl(data.slug, '/authors');
  const authorAvatar = data?.avatar?.data?.attributes as AuthorAvatar;
  const authorAvatarFormats = authorAvatar?.formats as unknown as StrapiImageFormats;
  const authorAvatarUrl = (authorAvatarFormats?.small?.url) ? getFileURL(authorAvatarFormats.small.url) : null;
  const authorLabel = `See ${capitalize(data.fullName)}'s Articles`;
  
  return (
    <Box component='section' className={classNames(styles.container, className)} {...other}>

      <Box className={styles.left}>

        <Box
          className={styles.avatar}
          component={NextLink}
          href={authorUrl || ''}
          title={authorLabel}>
          {(authorAvatar && authorAvatarUrl)
            ? <Image
                className={styles.image}
                component={NextImage}
                src={authorAvatarUrl}
                width={authorAvatarFormats.small?.width}
                height={authorAvatarFormats.small?.height}
                alt={authorAvatar?.alternativeText || ''} />
            : <Box className={styles.default}>
                <IconUser size={60} stroke={1.25} />
              </Box>}
        </Box>

        <Text className={styles.joined} title='Date Joined'>
          Joined {capitalize(convertToRelativeDate(data.publishedAt))}
        </Text>

      </Box>

      <Box className={styles.right}>

        <Title className={styles.name} order={2}>
          <NextLink href={authorUrl || ''} title={authorLabel}>
            {capitalize(data?.fullName)}
          </NextLink>
        </Title>
        
        <Text className={styles.biography}>
          {makeSeoDescription(data.biography, 320)}
        </Text>

        <Group className={styles.socials}>

          <Button
            className={styles.more}
            component={NextLink}
            href={authorUrl || ''}
            title={authorLabel}
            variant='light'
            color='dark'
            radius='xl'>
            Read Full Bio
          </Button>

        </Group>

      </Box>
      
    </Box>
  );
}
