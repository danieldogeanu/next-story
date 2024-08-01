import type { Metadata } from 'next';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import { getSinglePageSettings, getSiteSettings, PageRobots, SiteRobots, SiteSettings } from '@/data/settings';
import { capitalize } from '@/utils/strings';
import CategoryCard from '@/components/category-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;

  const categoriesPageSettings = await getSinglePageSettings('categories');
  const categoriesPageRobots = categoriesPageSettings?.robots as PageRobots;

  return {
    title: capitalize(categoriesPageSettings?.title.trim() as string),
    description: categoriesPageSettings?.description?.trim().substring(0, 160),
    keywords: categoriesPageSettings?.keywords,
    robots: {
      index: (siteRobots.indexAllowed === false) ? false : categoriesPageRobots.indexAllowed,
      follow: (siteRobots.followAllowed === false) ? false : categoriesPageRobots.followAllowed,
      nocache: (siteRobots.cacheAllowed === false) ? true : !categoriesPageRobots.cacheAllowed,
    }
  };
}

export default async function CategoriesPage() {
  const categoriesCollection = await getCategoriesCollection({populate: '*'});
  const categoriesPageSettings = await getSinglePageSettings('categories');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(categoriesPageSettings?.title.trim() as string)}
      </Title>
      <section className={styles.grid}>
        {categoriesCollection.data.map((category) => {
          return (<CategoryCard key={category.id} data={category.attributes} />);
        })}
      </section>
    </main>
  );
}
