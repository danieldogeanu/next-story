import Link from 'next/link';
import path from 'node:path';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import styles from '@/styles/page.module.scss';

export default async function AuthorsPage() {
  const authorsCollection = await getAuthorsCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Authors</Title>
      <ul>{authorsCollection.data.map((author) => {
        const authorData = author.attributes;
        const authorHref = path.join('authors', authorData.slug);
        return (<li key={author.id}>
          <Link href={authorHref}>{authorData.fullName}</Link>
        </li>);
      })}</ul>
    </main>
  );
}
