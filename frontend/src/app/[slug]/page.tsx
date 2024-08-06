import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getPagesCollection, PageContent, PageCover, PageMetaSocialEntry, PageMetaSocial, PageRobots, PageSEO } from '@/data/pages';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getFrontEndURL } from '@/utils/client/env';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';
import ContentRenderer from '@/components/content-renderer';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const pageData = (await getPagesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      cover: { populate: '*' },
      seo: { populate: {
        metaImage: { populate: '*' },
        metaSocial: { populate: '*' },
      } },
      robots: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const pageCover = pageData?.cover?.data?.attributes as PageCover;
  const pageRobots = pageData?.robots as PageRobots;
  const pageSEO = pageData?.seo as PageSEO;
  const pageMetaImage = pageSEO.metaImage?.data?.attributes as PageCover;
  const pageMetaSocials = pageSEO.metaSocial as PageMetaSocial;
  const pageMetaFacebook = pageMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const pageMetaFacebookImage = pageMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
    description: makeSeoDescription(pageSEO?.metaDescription || pageData?.excerpt),
    keywords: makeSeoKeywords(pageSEO?.keywords),
    robots: await generateRobotsObject(pageRobots),
    openGraph: {
      ...parentData.openGraph,
      title: makeSeoTitle(pageMetaFacebook?.title || pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
      description: makeSeoDescription(pageMetaFacebook?.description || pageSEO?.metaDescription || pageData?.excerpt, 65),
      url: new URL((pageSEO?.canonicalURL || pageData?.slug || '') , getFrontEndURL()).href,
      images: await generateCoverImageObject(pageMetaFacebookImage || pageMetaImage || pageCover),
    },
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
