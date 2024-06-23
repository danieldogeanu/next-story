import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import { capitalize } from '@/utils/strings';
import ArticleCard from '@/components/article-card';
import pageStyles from '@/styles/page.module.scss';
import categoryStyles from '@/styles/category-page.module.scss';

export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({params}: CategoryPageProps) {
  const categoryData = (await getCategoriesCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      cover: { populate: '*' },
      seo: { populate: '*' },
      articles: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const articlesData = categoryData?.articles?.data;

  if (!categoryData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, categoryStyles.intro)}>
        <Title className={pageStyles.pageTitle}>
          {capitalize(categoryData?.name)} Category
        </Title>
        <p>{categoryData?.description}</p>
      </section>

      <section className={pageStyles.grid}>
        {articlesData?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />;
        })}
      </section>
      
    </main>
  );
}
