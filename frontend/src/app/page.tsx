import type { Metadata } from 'next';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { getArticlesCollection } from '@/data/articles';
import { capitalize } from '@/utils/strings';
import ArticleCard from '@/components/article-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;

  return {
    title: `${capitalize(siteSettings.siteName)} > ${capitalize(siteSettings?.siteTagline as string)}`,
  };
}

export default async function Home() {
  const articlesCollection = await getArticlesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <section className={styles.grid}>
        {articlesCollection.data.map((article) => {
          return (<ArticleCard key={article.id} data={article.attributes} />);
        })}
      </section>
    </main>
  );
}
