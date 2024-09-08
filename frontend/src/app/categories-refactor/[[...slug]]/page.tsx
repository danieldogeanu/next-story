import NextImage from 'next/image';
import classNames from 'classnames';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import {
  CategoryArticles, CategoryCover, CategoryMetaSocial, CategoryMetaSocialEntry, CategoryRobots, 
  CategorySEO, getCategoriesCollection, SingleCategory
} from '@/data/categories';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { StrapiImageFormats } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import { getFileURL, getPageUrl } from '@/utils/urls';
import ArticleCard from '@/components/article-card';
import defaultCover from '@/assets/imgs/default-cover.webp';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';


export interface CategoriesPageProps {
  params: {
    slug: string[];
  };
}

const rootPageSlug = '/categories-refactor';

export async function generateMetadata({params}: CategoriesPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  
  return {};
}

export default async function CategoriesPage({params}: CategoriesPageProps) {
  
  return (
    <main className={pageStyles.main}>

      <Title className={pageStyles.pageTitle}>
        Categories Refactor
      </Title>

    </main>
  );
}
