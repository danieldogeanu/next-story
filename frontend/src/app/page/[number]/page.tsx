import type { Metadata, ResolvingMetadata } from 'next';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getArticlesCollection } from '@/data/articles';
import { makeSeoTitle } from '@/utils/client/seo';
import { getFrontEndURL } from '@/utils/client/env';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import ArticleCard from '@/components/article-card';
import PagePagination from '@/components/page-pagination';
import styles from '@/styles/page.module.scss';

export interface HomeProps {
  params: {
    number: string;
  };
}

export async function generateMetadata({params}: HomeProps, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;

  return {
    title: makeSeoTitle(`${siteSettings?.siteName} > ${siteSettings?.siteTagline}`),
    alternates: {
      canonical: getFrontEndURL(),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getFrontEndURL(),
      title: makeSeoTitle(siteSettings?.siteTagline),
    }
  };
}

export default async function Home({params}: HomeProps) {
  // If it's the first page, we need to redirect to avoid page duplicates.
  if (Number(params.number) === 1) permanentRedirect(getFrontEndURL(), RedirectType.replace);

  const articlesCollection = await getArticlesCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: Number(params.number), pageSize: 4 },
  });
  const articlesPagination = articlesCollection.meta.pagination;
  const isOutOfBounds = Number(params.number) > Number(articlesPagination.pageCount);

  if (articlesCollection.data.length === 0 && isOutOfBounds) return notFound();

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
