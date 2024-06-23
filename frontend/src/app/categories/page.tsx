import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import CategoryCard from '@/components/category-card';
import styles from '@/styles/page.module.scss';

export default async function CategoriesPage() {
  const categoriesCollection = await getCategoriesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>Categories</Title>
      <section className={styles.grid}>
        {categoriesCollection.data.map((category) => {
          return (<CategoryCard key={category.id} data={category.attributes} />);
        })}
      </section>
    </main>
  );
}
