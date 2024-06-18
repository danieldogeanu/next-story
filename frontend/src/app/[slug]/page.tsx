import { Title } from '@mantine/core';
import { getPagesCollection } from '@/data/pages';
import styles from '@/styles/page.module.scss';

export interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({params}: PageProps) {
  const pageData = (await getPagesCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {pageData?.title}
      </Title>
      <p>{pageData?.excerpt}</p>
    </main>
  );
}
