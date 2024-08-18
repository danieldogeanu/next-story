import NextImage from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Anchor, Box, Divider, Group, Image, Title } from '@mantine/core';
import { IconCalendar, IconCategory, IconUser } from '@tabler/icons-react';
import {
  ArticleAuthor, ArticleCategory, ArticleContent, ArticleCover, ArticleMetaSocial, 
  ArticleMetaSocialEntry, ArticleRobots, ArticleSEO, ArticleTags, getArticlesCollection
} from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { convertToISODate, convertToReadableDate } from '@/utils/date';
import { makeSeoDescription, makeSeoKeywords, makeSeoTags, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getArticleUrl, getPageUrl, getFileURL } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import ContentRenderer from '@/components/content-renderer';
import ActionBar from '@/components/action-bar';
import Tag from '@/components/tag';
import defaultCover from '@/assets/imgs/default-cover.webp';
import pageStyles from '@/styles/page.module.scss';
import articleStyles from '@/styles/article-page.module.scss';

export interface ArticlePageProps {
  params: {
    created: string;
    slug: string;
  };
}

export async function generateMetadata({params}: ArticlePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const articleData = (await getArticlesCollection({
    filters: {
      createdAt: { $eq: convertToISODate(params.created) },
      slug: { $eq: params.slug },
    },
    populate: {
      author: { fields: ['slug', 'fullName'] },
      cover: { populate: '*' },
      category: { fields: ['name'] },
      seo: { populate: {
        metaImage: { populate: '*' },
        metaSocial: { populate: '*' },
      } },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const articleAuthor = articleData?.author?.data?.attributes as ArticleAuthor;
  const articleCover = articleData?.cover?.data?.attributes as ArticleCover;
  const articleCategory = articleData?.category?.data?.attributes as ArticleCategory;
  const articleRobots = articleData?.robots as ArticleRobots;
  const articleSEO = articleData?.seo as ArticleSEO;
  const articleMetaImage = articleSEO.metaImage?.data?.attributes as ArticleCover;
  const articleMetaSocials = articleSEO.metaSocial as ArticleMetaSocial;
  const articleMetaFacebook = articleMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as ArticleMetaSocialEntry;
  const articleMetaFacebookImage = articleMetaFacebook?.image?.data?.attributes as ArticleCover;

  return {
    title: makeSeoTitle(articleSEO?.metaTitle || articleData?.title, parentData.applicationName),
    description: makeSeoDescription(articleSEO?.metaDescription || articleData?.excerpt),
    keywords: makeSeoKeywords(articleSEO?.keywords),
    authors: [{name: makeSeoTitle(articleAuthor?.fullName), url: getPageUrl(articleAuthor?.slug, '/authors')}],
    category: makeSeoTitle(articleCategory?.name),
    robots: await generateRobotsObject(articleRobots),
    alternates: {
      canonical: getArticleUrl(articleData?.createdAt, (articleSEO?.canonicalURL || articleData?.slug)),
    },
    openGraph: {
      ...parentData.openGraph, type: 'article',
      url: getArticleUrl(articleData?.createdAt, (articleSEO?.canonicalURL || articleData?.slug)),
      title: makeSeoTitle(articleMetaFacebook?.title || articleSEO?.metaTitle || articleData?.title, parentData.applicationName),
      description: makeSeoDescription(articleMetaFacebook?.description || articleSEO?.metaDescription || articleData?.excerpt, 65),
      images: await generateCoverImageObject(articleMetaFacebookImage || articleMetaImage || articleCover),
      authors: makeSeoTitle(articleAuthor?.fullName),
      section: makeSeoTitle(articleCategory?.name),
      tags: makeSeoTags(articleSEO?.keywords)?.map((tag) => capitalize(tag)),
      publishedTime: articleData?.publishedAt?.toString(),
      modifiedTime: articleData?.updatedAt?.toString(),
    },
  };
}

export default async function ArticlePage({params}: ArticlePageProps) {
  // Filters must match both createdAt and slug fields.
  const articleData = (await getArticlesCollection({
    populate: '*', filters: {
      createdAt: { $eq: convertToISODate(params.created) },
      slug: { $eq: params.slug },
    }
  })).data.pop()?.attributes;
  const articleCover = articleData?.cover?.data?.attributes as ArticleCover;
  const articleCoverFormats = articleCover?.formats as unknown as StrapiImageFormats;
  const articleCoverUrl = (articleCoverFormats?.large?.url)
    ? getFileURL(articleCoverFormats.large.url) : getFileURL(defaultCover.src, 'frontend');
  const articleAuthor = articleData?.author?.data?.attributes as ArticleAuthor;
  const articleAuthorUrl = getPageUrl(articleAuthor?.slug, '/authors');
  const articleCategory = articleData?.category?.data?.attributes as ArticleCategory;
  const articleCategoryUrl = getPageUrl(articleCategory?.slug, '/categories');
  const articleContent = articleData?.content as ArticleContent;
  const articleTags = articleData?.tags?.data as ArticleTags;

  if (!articleData) return notFound();

  return (
    <main className={pageStyles.main}>

      <article className={pageStyles.container}>

        <header className={pageStyles.intro}>

          <Title className={articleStyles.articleTitle}>
            {articleData?.title}
          </Title>

          <Group className={articleStyles.meta} justify='center'>

            <Anchor
              className={classNames(articleStyles.entry, articleStyles.author)}
              component={Link} href={articleAuthorUrl || ''} title='Article Author' underline='never'>
              <IconUser size={24} stroke={1.5} />
              {capitalize(articleAuthor?.fullName)}
            </Anchor>

            <Anchor
              className={classNames(articleStyles.entry, articleStyles.date)}
              component='div' title='Publication Date' underline='never'>
              <IconCalendar size={24} stroke={1.5} />
              {convertToReadableDate(articleData.publishedAt, 'long')}
            </Anchor>

            <Anchor
              className={classNames(articleStyles.entry, articleStyles.category)}
              component={Link} href={articleCategoryUrl || ''} title='Article Category' underline='never'>
              <IconCategory size={24} stroke={1.5} />
              {capitalize(articleCategory?.name)}
            </Anchor>

          </Group>

          <Box className={pageStyles.cover}>
            <Image
              className={pageStyles.image}
              component={NextImage}
              src={articleCoverUrl}
              width={articleCoverFormats?.large?.width ?? defaultCover.width}
              height={articleCoverFormats?.large?.height ?? defaultCover.height}
              alt={articleCover?.alternativeText || ''}
              priority={true} />
          </Box>

        </header>

        <section className={pageStyles.content}>
          <ContentRenderer content={articleContent} />
        </section>

        <footer className={pageStyles.outro}>

          <nav className={articleStyles.tags}>
            {articleTags?.map((tag) => {
              return <Tag key={tag.id} data={tag.attributes} />;
            })}
          </nav>

          <Divider className={articleStyles.divider} />

          <ActionBar className={articleStyles.actionBar} />

        </footer>

      </article>
      
    </main>
  );
}
