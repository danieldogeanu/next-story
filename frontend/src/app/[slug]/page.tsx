import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getPagesCollection, PageContent, PageCover, PageMetaSocialEntry, PageMetaSocial, PageRobots, PageSEO, SinglePage } from '@/data/pages';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { getPageUrl, getFileURL } from '@/utils/urls';
import ContentRenderer from '@/components/content-renderer';
import defaultCover from '@/assets/imgs/default-cover.webp';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

// TODO: Add undefined and not found guards for all pages.
// TODO: Try to refactor collection pages to merge them into a single page with optional params.
// TODO: Add pagination to the merged optional params pages.

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
    pagination: { start: 0, limit: 1 },
  })).data.pop()?.attributes as SinglePage;

  if (typeof pageData === 'undefined') return {};

  const pageCover = pageData?.cover?.data?.attributes as PageCover;
  const pageRobots = pageData?.robots as PageRobots;
  const pageSEO = pageData?.seo as PageSEO;
  const pageMetaImage = pageSEO?.metaImage?.data?.attributes as PageCover;
  const pageMetaSocials = pageSEO?.metaSocial as PageMetaSocial;
  const pageMetaFacebook = pageMetaSocials?.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const pageMetaFacebookImage = pageMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
    description: makeSeoDescription(pageSEO?.metaDescription || pageData?.excerpt),
    keywords: makeSeoKeywords(pageSEO?.keywords),
    robots: await generateRobotsObject(pageRobots),
    alternates: {
      canonical: getPageUrl(pageSEO?.canonicalURL || pageData?.slug),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(pageSEO?.canonicalURL || pageData?.slug),
      title: makeSeoTitle(pageMetaFacebook?.title || pageSEO?.metaTitle || pageData?.title, parentData.applicationName),
      description: makeSeoDescription(pageMetaFacebook?.description || pageSEO?.metaDescription || pageData?.excerpt, 65),
      images: await generateCoverImageObject(pageMetaFacebookImage || pageMetaImage || pageCover),
    },
  };
}

export default async function Page({params}: PageProps) {
  if (params.slug === 'page') return permanentRedirect('/', RedirectType.replace);

  const pageData = (await getPagesCollection({
    populate: '*', filters: { slug: { $eq: params.slug } },
    pagination: { start: 0, limit: 1 },
  })).data.pop()?.attributes as SinglePage;

  if (!pageData) return notFound();

  const pageCover = pageData?.cover?.data?.attributes as PageCover;
  const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
  const pageCoverUrl = (pageCoverFormats?.large?.url)
    ? getFileURL(pageCoverFormats.large.url) : getFileURL(defaultCover.src, 'frontend');
  const pageContent = pageData?.content as PageContent;

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
              width={pageCoverFormats?.large?.width ?? defaultCover.width}
              height={pageCoverFormats?.large?.height ?? defaultCover.height}
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
