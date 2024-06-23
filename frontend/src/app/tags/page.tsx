import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';

export default async function TagsPage() {
  const tagsCollection = await getTagsCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Tags</Title>
      <section className={styles.grid}>
        {tagsCollection.data.map((tag) => {
          return (<TagCard key={tag.id} data={tag.attributes} />);
        })}
      </section>
    </main>
  );
}
