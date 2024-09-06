import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { IconCoin, IconMailPlus, IconUser } from '@tabler/icons-react';
import { Box, Button, Group, Image, Text, Title } from '@mantine/core';
import {
  AuthorArticles, AuthorAvatar, AuthorMetaSocial, AuthorMetaSocialEntry, AuthorRobots,
  AuthorSEO, AuthorSocialEntry, getAuthorsCollection, SingleAuthor
} from '@/data/authors';
import { checkSlugAndRedirect, extractSlugAndPage, getFileURL, getPageUrl } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { convertToRelativeDate } from '@/utils/date';
import { isSlugArrayValid } from '@/validation/urls';
import ArticleCard from '@/components/article-card';
import SocialIcon from '@/components/social-icon';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string[];
  },
}

export async function generateMetadata({params}: AuthorPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  if (!isSlugArrayValid(params.slug)) return {};
  
  const parentData = await parent;

  return {

  };
}

export default async function AuthorsPage({params}: AuthorPageProps) {
  // Check if the slug array is a valid path and if not, return a 404.
  // If the slug array contains a `page` keyword, but no page number, redirect to the slug, or root page.
  checkSlugAndRedirect(params.slug, '/authors-refactor');

  // If the slug array is valid, proceed to extract the slug and page number if they're present.
  const {slug, pageNumber} = extractSlugAndPage(params.slug);

  // If it's the first page, we need to redirect to avoid page duplicates.
  if (Number(pageNumber) === 1) redirect(
    (typeof slug === 'string') ? `/authors-refactor/${slug}` : `/authors-refactor`,
    RedirectType.replace
  );

  return (
    <main className={pageStyles.main}>

      <Title className={pageStyles.pageTitle}>
        Authors
      </Title>

    </main>
  );
}
