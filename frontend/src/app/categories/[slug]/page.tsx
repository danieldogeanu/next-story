import { Title } from '@mantine/core';
import styles from '@/styles/page.module.scss';

export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({params}: CategoryPageProps) {
  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        Category: {params.slug.replace('-', ' ')}
      </Title>
    </main>
  );
}
