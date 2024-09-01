import type { Metadata, ResolvingMetadata } from 'next';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getArticlesCollection } from '@/data/articles';
import { makeSeoTitle } from '@/utils/client/seo';
import { getFrontEndURL } from '@/utils/client/env';
import ArticleCard from '@/components/article-card';
import PagePagination from '@/components/page-pagination';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
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

export default async function Home() {
  const articlesCollection = await getArticlesCollection({
    populate: '*', sort: 'id:desc',
    pagination: { page: 1, pageSize: 4 },
  });
  const articlesPagination = articlesCollection.meta.pagination;

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
