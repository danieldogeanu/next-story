import NextImage from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import { Box, Image, Title } from '@mantine/core';
import { getPagesCollection, PageContent, PageCover, PageMetaSocialEntry, PageMetaSocial, PageRobots, PageSEO, SinglePage } from '@/data/pages';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getArticlesCollection } from '@/data/articles';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getPageUrl, getFileURL } from '@/utils/urls';
import { getFrontEndURL } from '@/utils/client/env';
import { StrapiImageFormats } from '@/types/strapi';
import ArticleCard from '@/components/article-card';
import ContentRenderer from '@/components/content-renderer';
import PagePagination from '@/components/page-pagination';
import defaultCover from '@/assets/imgs/default-cover.webp';
import styles from '@/styles/page.module.scss';


export interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({params}: PageProps, parent: ResolvingMetadata): Promise<Metadata> {

  return {};
}


export default async function Page({params}: PageProps) {
  
  return (
    <main className={styles.main}>

      <Title className={styles.pageTitle}>
        Homepage Refactor
      </Title>

    </main>
  );
}
