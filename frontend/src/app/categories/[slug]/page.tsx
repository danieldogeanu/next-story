import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import styles from '@/styles/page.module.scss';

export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({params}: CategoryPageProps) {
  const categoryData = (await getCategoriesCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;

  if (!categoryData) return notFound();

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        Category: {categoryData?.name}
      </Title>
      <p>{categoryData?.description}</p>
    </main>
  );
}
