import NextImage from 'next/image';
import Link from 'next/link';
import { Box, Button, Card, CardSection, Group, Image, Text, Title } from '@mantine/core';
import { IconArrowNarrowRight, IconEyeFilled, IconUser } from '@tabler/icons-react';
import { AuthorArticles, AuthorAvatar, AuthorSocialEntry, SingleAuthor } from '@/data/authors';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL, getPageUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import { convertToRelativeDate } from '@/utils/date';
import SocialIcon from '@/components/social-icon';
import styles from '@/styles/author-card.module.scss';

export interface AuthorCardProps {
  data: SingleAuthor;
}

export default function AuthorCard({data}: AuthorCardProps) {
  const authorUrl = getPageUrl(data.slug, '/authors');
  const authorAvatar = data?.avatar?.data?.attributes as AuthorAvatar;
  const authorAvatarFormats = authorAvatar?.formats as unknown as StrapiImageFormats;
  const authorAvatarUrl = (authorAvatarFormats?.small?.url) ? getFileURL(authorAvatarFormats.small.url) : null;
  const authorSocials = data.socialNetworks as unknown as AuthorSocialEntry[];
  const authorArticles = data.articles?.data as AuthorArticles;
  const authorArticlesNumber = (authorArticles && authorArticles.length) ? authorArticles.length : 0;
  const authorLabel = `See ${capitalize(data.fullName)}'s Articles`;

  return (
    <Card
      className={styles.card}
      padding='xs'
      radius='md'>
      
      <CardSection className={styles.cover}>
        <Box
          className={styles.avatar}
          component={Link}
          href={authorUrl || ''}
          title={authorLabel}
          data-event-name='Author Card - Avatar'>
          <IconEyeFilled className={styles.preview} size={60} />
          {(authorAvatar && authorAvatarUrl) ?
            <Image
              className={styles.image}
              component={NextImage}
              src={authorAvatarUrl}
              width={authorAvatarFormats.small?.width}
              height={authorAvatarFormats.small?.height}
              alt={authorAvatar?.alternativeText || ''} />
            :  
            <Box className={styles.default}>
              <IconUser size={80} stroke={1.25} />
            </Box>
          }
        </Box>
      </CardSection>

      <Link href={authorUrl || ''}
        title={capitalize(data.fullName)}
        data-event-name='Author Card - Title'>
        <Title className={styles.name} order={2}>
          {capitalize(data.fullName.substring(0, 60))}
        </Title>
      </Link>

      <Text className={styles.joined} title='Date Joined'>
        Joined {capitalize(convertToRelativeDate(data.publishedAt))}
      </Text>

      <Group className={styles.socials} justify='center'>
        {(authorSocials && authorSocials.length > 0) && authorSocials.slice(0, 4).map((social) => (
          <SocialIcon
            key={social.id}
            href={social.link}
            label={social.label}
            icon={social.icon || 'IconCircleX'}
            className={styles.icon}
            color='dark' />
        ))}
      </Group>

      <Group className={styles.articles} justify='center'>
        <Button
          className={styles.button}
          component={Link}
          href={authorUrl || ''}
          title={authorLabel}
          variant='subtle'
          color='dark'
          size='md'
          radius='xl'
          rightSection={<IconArrowNarrowRight size={24} stroke={1.5} />}
          data-event-name='Author Card - Articles'>
          {authorArticlesNumber} {(authorArticlesNumber === 1) ? 'Article' : 'Articles'}
        </Button>
      </Group>

    </Card>
  );
}
