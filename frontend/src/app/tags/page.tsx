import type { Metadata } from 'next';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import { getSinglePageSettings, getSiteSettings, PageRobots, SiteRobots, SiteSettings } from '@/data/settings';
import { capitalize } from '@/utils/strings';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;

  const tagsPageSettings = await getSinglePageSettings('tags');
  const tagsPageRobots = tagsPageSettings?.robots as PageRobots;

  return {
    title: capitalize(tagsPageSettings?.title.trim() as string),
    description: tagsPageSettings?.description?.trim().substring(0, 160),
    keywords: tagsPageSettings?.keywords,
    robots: {
      index: (siteRobots.indexAllowed === false) ? false : tagsPageRobots.indexAllowed,
      follow: (siteRobots.followAllowed === false) ? false : tagsPageRobots.followAllowed,
      nocache: (siteRobots.cacheAllowed === false) ? true : !tagsPageRobots.cacheAllowed,
    }
  };
}

export default async function TagsPage() {
  const tagsCollection = await getTagsCollection({populate: '*'});
  const tagsPageSettings = await getSinglePageSettings('tags');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(tagsPageSettings?.title.trim() as string)}
      </Title>
      <section className={styles.grid}>
        {tagsCollection.data.map((tag) => {
          return (<TagCard key={tag.id} data={tag.attributes} />);
        })}
      </section>
    </main>
  );
}
