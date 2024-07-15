import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getPagesCollection, PageCover } from '@/data/pages';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({params}: PageProps) {
  const pageData = (await getPagesCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;
  const pageCover = pageData?.cover?.data?.attributes as PageCover;
  const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
  const pageCoverUrl = (pageCoverFormats?.large?.url) ? getFileURL(pageCoverFormats.large.url) : '';

  if (!pageData) return notFound();

  return (
    <main className={styles.main}>

      <article className={styles.container}>

        <header className={styles.intro}>

          <Title className={styles.pageTitle}>
            {pageData?.title}
          </Title>

          <Box className={styles.cover}>
            <Image
              className={styles.image}
              component={NextImage}
              src={pageCoverUrl}
              width={pageCoverFormats?.large?.width}
              height={pageCoverFormats?.large?.height}
              alt={pageCover?.alternativeText || ''}
              priority={true} />
          </Box>

        </header>

        <section className={styles.content}>
          <p>{pageData?.excerpt}</p>
        </section>

      </article>
      
    </main>
  );
}
