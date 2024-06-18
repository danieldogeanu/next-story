import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import styles from '@/styles/page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string;
  };
}

export default async function AuthorPage({params}: AuthorPageProps) {
  const authorData = (await getAuthorsCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;

  if (!authorData) return notFound();

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        Author: {authorData?.fullName}
      </Title>
      <p>{authorData?.biography}</p>
    </main>
  );
}
