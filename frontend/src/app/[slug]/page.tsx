import { Title } from '@mantine/core';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({params}: PageProps) {
  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {params.slug.replace('-', ' ')}
      </Title>
    </main>
  );
}
