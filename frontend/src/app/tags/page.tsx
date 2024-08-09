import type { Metadata, ResolvingMetadata } from 'next';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import { getSinglePageSettings, PageRobots } from '@/data/settings';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateRobotsObject } from '@/utils/server/seo';
import { capitalize } from '@/utils/strings';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const tagsPageSettings = await getSinglePageSettings('tags');
  const tagsPageRobots = tagsPageSettings?.robots as PageRobots;

  return {
    title: makeSeoTitle(tagsPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(tagsPageSettings?.description),
    keywords: makeSeoKeywords(tagsPageSettings?.keywords),
    robots: await generateRobotsObject(tagsPageRobots),
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
