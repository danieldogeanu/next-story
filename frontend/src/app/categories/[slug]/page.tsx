import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import { capitalize } from '@/utils/strings';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';

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
    <main className={pageStyles.main}>
      <section className={pageStyles.container}>
        <Title className={pageStyles.pageTitle}>
          {capitalize(categoryData?.name)} Category
        </Title>
        <p>{categoryData?.description}</p>
      </section>
    </main>
  );
}
