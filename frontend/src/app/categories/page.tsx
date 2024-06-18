import path from 'node:path';
import Link from 'next/link';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import styles from '@/styles/page.module.scss';

export default async function CategoriesPage() {
  const categoriesCollection = await getCategoriesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Categories</Title>
      <ul>{categoriesCollection.data.map((category) => {
        const categoryData = category.attributes;
        const categoryHref = path.join('categories', categoryData.slug);
        return (<li key={category.id}>
          <Link href={categoryHref}>{categoryData.name}</Link>
        </li>);
      })}</ul>
    </main>
  );
}
