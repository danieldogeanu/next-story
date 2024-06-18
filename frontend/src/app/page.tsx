import { Title } from '@mantine/core';
import styles from '@/styles/page.module.scss';

export default async function Home() {
  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Home</Title>
    </main>
  );
}
