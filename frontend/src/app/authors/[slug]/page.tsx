import NextImage from 'next/image';
import classNames from 'classnames';
import path from 'node:path';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { IconUser } from '@tabler/icons-react';
import { Box, Group, Image, Text, Title } from '@mantine/core';
import {
  AuthorArticles, AuthorAvatar, AuthorMetaSocial, AuthorMetaSocialEntry, AuthorRobots,
  AuthorSEO, AuthorSocialEntry, getAuthorsCollection
} from '@/data/authors';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';
import { capitalize } from '@/utils/strings';
import { getFrontEndURL } from '@/utils/client/env';
import { convertToRelativeDate } from '@/utils/date';
import ArticleCard from '@/components/article-card';
import SocialIcon from '@/components/social-icon';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({params}: AuthorPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const authorData = (await getAuthorsCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      avatar: { populate: '*' },
      seo: { populate: {
        metaImage: { populate: '*' },
        metaSocial: { populate: '*' },
      } },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const authorAvatar = authorData?.avatar?.data?.attributes as AuthorAvatar;
  const authorRobots = authorData?.robots as AuthorRobots;
  const authorSEO = authorData?.seo as AuthorSEO;
  const authorHref = path.join('/authors', (authorSEO?.canonicalURL || authorData?.slug || ''));
  const authorMetaImage = authorSEO.metaImage?.data?.attributes as AuthorAvatar;
  const authorMetaSocials = authorSEO.metaSocial as AuthorMetaSocial;
  const authorMetaFacebook = authorMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as AuthorMetaSocialEntry;
  const authorMetaFacebookImage = authorMetaFacebook?.image?.data?.attributes as AuthorAvatar;

  return {
    title: makeSeoTitle((authorSEO?.metaTitle || authorData?.fullName) + '\'s Articles', parentData.applicationName),
    description: makeSeoDescription(authorSEO?.metaDescription || authorData?.biography),
    keywords: makeSeoKeywords(authorSEO?.keywords),
    authors: [{name: capitalize(authorData?.fullName as string), url: authorHref}],
    robots: await generateRobotsObject(authorRobots),
    openGraph: {
      ...parentData.openGraph,
      title: makeSeoTitle((authorMetaFacebook?.title || authorSEO?.metaTitle || authorData?.fullName) + '\'s Articles', parentData.applicationName),
      description: makeSeoDescription(authorMetaFacebook?.description || authorSEO?.metaDescription || authorData?.biography, 65),
      url: new URL(authorHref, getFrontEndURL()).href,
      images: await generateCoverImageObject(authorMetaFacebookImage || authorMetaImage || authorAvatar),
    },
  };
}

export default async function AuthorPage({params}: AuthorPageProps) {
  const authorData = (await getAuthorsCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      avatar: { populate: '*' },
      socialNetworks: { populate: '*' },
      articles: { populate: '*' },
      seo: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const authorAvatar = authorData?.avatar?.data?.attributes as AuthorAvatar;
  const authorAvatarFormats = authorAvatar?.formats as unknown as StrapiImageFormats;
  const authorAvatarUrl = (authorAvatarFormats?.small?.url) ? getFileURL(authorAvatarFormats.small.url) : null;
  const authorSocials = authorData?.socialNetworks as unknown as AuthorSocialEntry[];
  const authorArticles = authorData?.articles?.data as AuthorArticles;
  const authorArticlesNumber = (authorArticles && authorArticles.length) ? authorArticles.length : 0;

  if (!authorData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, authorStyles.intro)}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(authorData?.fullName) + '\'s'} Articles
        </Title>

        <Box className={authorStyles.author}>

          <Box className={authorStyles.left}>

            <Box className={authorStyles.avatar}>
              {(authorAvatar && authorAvatarUrl) ?
                <Image
                  className={authorStyles.image}
                  component={NextImage}
                  src={authorAvatarUrl}
                  width={authorAvatarFormats.small?.width}
                  height={authorAvatarFormats.small?.height}
                  alt={authorAvatar?.alternativeText || ''} />
                :  
                <Box className={authorStyles.default}>
                  <IconUser size={100} stroke={1} />
                </Box>
              }
            </Box>

            <Text className={authorStyles.joined} title='Date Joined'>
              Joined {capitalize(convertToRelativeDate(authorData.publishedAt))}
            </Text>

            <Group className={authorStyles.socials} justify='center'>
              {(authorSocials && authorSocials.length > 0) && authorSocials.map((social) => (
                <SocialIcon
                  key={social.id}
                  href={social.link}
                  label={social.label}
                  icon={social.icon || 'IconCircleX'}
                  className={authorStyles.icon}
                  color='dark' />
              ))}
            </Group>

            <Text className={authorStyles.total} title='Total Articles'>
              Written {authorArticlesNumber} {(authorArticlesNumber === 1) ? 'Article' : 'Articles'}
            </Text>

          </Box>

          <Box className={authorStyles.right}>

            <Title className={authorStyles.name} order={2}>
              {capitalize(authorData?.fullName)}
            </Title>

            <Box className={authorStyles.biography}>
              {authorData?.biography.split('\n\n').map((paragraph, index) => {
                return <Text key={index}>{paragraph.trim()}</Text>;
              })}
            </Box>

          </Box>

        </Box>

      </section>

      <section className={pageStyles.grid}>
        {authorArticles?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />
        })}
      </section>

    </main>
  );
}
