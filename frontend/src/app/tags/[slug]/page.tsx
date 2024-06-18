import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import styles from '@/styles/page.module.scss';

export interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({params}: TagPageProps) {
  const tagData = (await getTagsCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;

  if (!tagData) return notFound();

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        Tag: {tagData?.name}
      </Title>
    </main>
  );
}
