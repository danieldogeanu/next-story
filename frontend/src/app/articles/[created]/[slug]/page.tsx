import NextImage from 'next/image';
import Link from 'next/link';
import path from 'node:path';
import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Anchor, Box, Group, Image, Title } from '@mantine/core';
import { IconCalendar, IconCategory, IconUser } from '@tabler/icons-react';
import { ArticleAuthor, ArticleCategory, ArticleCover, getArticlesCollection } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { convertToISODate, convertToReadableDate } from '@/utils/date';
import { capitalize } from '@/utils/strings';
import { getFileURL } from '@/data/files';
import pageStyles from '@/styles/page.module.scss';
import articleStyles from '@/styles/article-page.module.scss';

export interface ArticlePageProps {
  params: {
    created: string;
    slug: string;
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
  const articleCoverUrl = (articleCoverFormats?.large?.url) ? getFileURL(articleCoverFormats.large.url) : '';
  const articleAuthor = articleData?.author?.data?.attributes as ArticleAuthor;
  const articleAuthorHref = path.join('/authors', articleAuthor.slug);
  const articleCategory = articleData?.category?.data?.attributes as ArticleCategory;
  const articleCategoryHref = path.join('/categories', articleCategory.slug);

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
              component={Link} href={articleAuthorHref} title='Article Author' underline='never'>
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
              component={Link} href={articleCategoryHref} title='Article Category' underline='never'>
              <IconCategory size={24} stroke={1.5} />
              {capitalize(articleCategory?.name)}
            </Anchor>

          </Group>

          <Box className={pageStyles.cover}>
            <Image
              className={pageStyles.image}
              component={NextImage}
              src={articleCoverUrl}
              width={articleCoverFormats?.large?.width}
              height={articleCoverFormats?.large?.height}
              alt={articleCover?.alternativeText || ''}
              priority={true} />
          </Box>

        </header>

        <section className={pageStyles.content}>
          <p>{articleData?.excerpt}</p>
        </section>

      </article>
      
    </main>
  );
}
