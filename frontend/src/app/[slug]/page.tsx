import NextImage from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getSiteSettings, SiteRobots, SiteSettings } from '@/data/settings';
import { getPagesCollection, PageContent, PageCover, PageRobots, PageSEO } from '@/data/pages';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';
import ContentRenderer from '@/components/content-renderer';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;
  
  const pageData = (await getPagesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      seo: { populate: '*' },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const pageRobots = pageData?.robots as PageRobots;
  const pageSEO = pageData?.seo as PageSEO;

  return {
    title: pageSEO?.metaTitle.trim() || pageData?.title.trim(),
    description: pageSEO?.metaDescription.trim() || (pageData?.excerpt?.substring(0, 160 - 4) + '...').trim(),
    keywords: pageSEO?.keywords,
    robots: {
      index: (siteRobots.indexAllowed === false) ? false : pageRobots.indexAllowed,
      follow: (siteRobots.followAllowed === false) ? false : pageRobots.followAllowed,
      nocache: (siteRobots.cacheAllowed === false) ? true : !pageRobots.cacheAllowed,
    }
  };
}

export default async function Page({params}: PageProps) {
  const pageData = (await getPagesCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;
  const pageCover = pageData?.cover?.data?.attributes as PageCover;
  const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
  const pageCoverUrl = (pageCoverFormats?.large?.url) ? getFileURL(pageCoverFormats.large.url) : '';
  const pageContent = pageData?.content as PageContent;

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
          <ContentRenderer content={pageContent} />
        </section>

      </article>
      
    </main>
  );
}
