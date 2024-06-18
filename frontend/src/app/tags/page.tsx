import path from 'node:path';
import Link from 'next/link';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import styles from '@/styles/page.module.scss';

export default async function TagsPage() {
  const tagsCollection = await getTagsCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Tags</Title>
      <ul>{tagsCollection.data.map((tag) => {
        const tagData = tag.attributes;
        const tagHref = path.join('tags', tagData.slug);
        return (<li key={tag.id}>
          <Link href={tagHref}>{tagData.name}</Link>
        </li>);
      })}</ul>
    </main>
  );
}
