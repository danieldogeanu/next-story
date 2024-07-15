import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { ArticleCover, getArticlesCollection } from '@/data/articles';
import { StrapiImageFormats } from '@/types/strapi';
import { convertToISODate } from '@/utils/date';
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

  if (!articleData) return notFound();

  return (
    <main className={pageStyles.main}>

      <article className={pageStyles.container}>

        <header className={pageStyles.intro}>

          <Title className={pageStyles.pageTitle}>
            {articleData?.title}
          </Title>

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
