import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import styles from '@/styles/page.module.scss';

export interface CategoriesPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoriesPage({params}: CategoriesPageProps) {
  const categoriesResponse = await getCategoriesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Categories</Title>
      <ul>{categoriesResponse.data.map((category) => {
        const categoryData = category.attributes;
        return (<li key={category.id}>
          <h4>{categoryData.name}</h4>
          <p>{categoryData.description}</p>
        </li>);
      })}</ul>
    </main>
  );
}
