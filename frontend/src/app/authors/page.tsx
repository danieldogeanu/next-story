import type { Metadata, ResolvingMetadata } from 'next';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import { getSinglePageSettings, PageRobots } from '@/data/settings';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateRobotsObject } from '@/utils/server/seo';
import { capitalize } from '@/utils/strings';
import AuthorCard from '@/components/author-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPageRobots = authorPageSettings?.robots as PageRobots;

  return {
    title: makeSeoTitle(authorPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(authorPageSettings?.description),
    keywords: makeSeoKeywords(authorPageSettings?.keywords),
    robots: await generateRobotsObject(authorPageRobots),
  };
}

export default async function AuthorsPage() {
  const authorsCollection = await getAuthorsCollection({populate: '*'});
  const authorPageSettings = await getSinglePageSettings('authors');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(authorPageSettings?.title.trim() as string)}
      </Title>
      <section className={styles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>
    </main>
  );
}
