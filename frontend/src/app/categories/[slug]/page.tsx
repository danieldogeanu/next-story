import NextImage from 'next/image';
import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Title, Image, Box, Text } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import { capitalize } from '@/utils/strings';
import { getFileURL } from '@/data/files';
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
  const categoryCover = categoryData?.cover?.data.attributes;
  const categoryCoverFormats = JSON.parse(JSON.stringify(categoryCover?.formats));
  const categoryCoverUrl = getFileURL(categoryCover?.url as string);
  const articlesData = categoryData?.articles?.data;

  console.log(categoryCover);

  if (!categoryData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, categoryStyles.intro)}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(categoryData?.name)} Category
        </Title>

        <Box className={categoryStyles.hero}>
          <Box className={categoryStyles.description}>
            <Text>{categoryData?.description}</Text>
          </Box>
          <Image
            className={categoryStyles.cover}
            component={NextImage}
            src={categoryCoverUrl}
            width={categoryCover?.width}
            height={categoryCover?.height}
            alt={categoryCover?.alternativeText || ''}
            h={300} radius='lg' />
        </Box>

      </section>

      <section className={pageStyles.grid}>
        {articlesData?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />;
        })}
      </section>

    </main>
  );
}
