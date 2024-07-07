import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import AuthorCard from '@/components/author-card';
import styles from '@/styles/page.module.scss';

export default async function AuthorsPage() {
  const authorsCollection = await getAuthorsCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Authors</Title>
      <section className={styles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>
    </main>
  );
}
