import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getArticlesCollection } from '@/data/articles';
import { addPageNumber, makeSeoTitle } from '@/utils/client/seo';
import { firstPageRedirect, getPageUrl, outOfBoundsRedirect } from '@/utils/urls';
import ArticleCard from '@/components/article-card';
import PagePagination from '@/components/page-pagination';
import styles from '@/styles/page.module.scss';

export interface HomeProps {
  params: {
    number: string;
  };
}

export async function generateMetadata({params}: Readonly<HomeProps>, parent: ResolvingMetadata): Promise<Metadata> {
  if (isNaN(Number(params.number))) return {};

  const parentData = await parent;
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;

  if (typeof siteSettingsResponse === 'undefined') return {};

  return {
    title: {
      absolute: makeSeoTitle(addPageNumber(
        `${siteSettings?.siteName} > ${siteSettings?.siteTagline}`,
        Number(params.number), 'title')) as string,
    },
    alternates: {
      canonical: getPageUrl(addPageNumber('', Number(params.number), 'slug')),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(addPageNumber('', Number(params.number), 'slug')),
      title: makeSeoTitle(addPageNumber(siteSettings?.siteTagline, Number(params.number), 'title')),
    },
  };
}

export default async function Home({params}: Readonly<HomeProps>) {
  if (isNaN(Number(params.number))) return notFound();

  // If it's the first page, we need to redirect to avoid page duplicates.
  firstPageRedirect(null, Number(params.number), null);

  const articlesCollection = await getArticlesCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: Number(params.number), pageSize: 24 },
  });
  const articlesPagination = articlesCollection?.meta?.pagination;
  
  // If the page number is beyond of the page count, we return a 404.
  outOfBoundsRedirect(Number(params.number), articlesPagination.pageCount, articlesCollection.data.length);

  return (
    <main className={styles.main}>

      <section className={styles.grid}>
        {articlesCollection.data.map((article) => {
          return (<ArticleCard key={article.id} data={article.attributes} />);
        })}
      </section>

      <PagePagination data={articlesPagination} />

    </main>
  );
}
