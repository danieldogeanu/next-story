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
import { checkSlugAndRedirect, extractSlugAndPage, firstPageRedirect, getFileURL, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { convertToRelativeDate } from '@/utils/date';
import { isSlugArrayValid } from '@/validation/urls';
import { getSinglePageSettings } from '@/data/settings';
import PagePagination from '@/components/page-pagination';
import ArticleCard from '@/components/article-card';
import AuthorCard from '@/components/author-card';
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
  firstPageRedirect(slug, pageNumber, '/authors-refactor');

  // If there's no slug, we're on the root `authors` page. 
  const authorsCollection = await getAuthorsCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: pageNumber || 1, pageSize: 12 },
  });
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPagination = authorsCollection?.meta?.pagination;

  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(pageNumber, authorPagination?.pageCount, authorsCollection?.data?.length);

  return (
    <main className={pageStyles.main}>

      <Title className={pageStyles.pageTitle}>
        {capitalize(authorPageSettings?.title.trim() || 'Authors')}
      </Title>

      <section className={pageStyles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>

      <PagePagination data={authorPagination} />

    </main>
  );
}
