import type { Metadata, ResolvingMetadata } from 'next';
import { Title } from '@mantine/core';
import { getCategoriesCollection } from '@/data/categories';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { capitalize } from '@/utils/strings';
import { getPageUrl } from '@/utils/urls';
import CategoryCard from '@/components/category-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const categoriesPageSettings = await getSinglePageSettings('categories');
  const categoriesPageRobots = categoriesPageSettings?.robots as PageRobots;
  const categoriesCover = categoriesPageSettings?.cover?.data?.attributes as PageCover;
  const categoriesMetaSocials = categoriesPageSettings?.metaSocial as PageMetaSocial;
  const categoriesMetaFacebook = categoriesMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const categoriesMetaFacebookImage = categoriesMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(categoriesPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(categoriesPageSettings?.description),
    keywords: makeSeoKeywords(categoriesPageSettings?.keywords),
    robots: await generateRobotsObject(categoriesPageRobots),
    alternates: {
      canonical: getPageUrl(categoriesPageSettings?.canonicalURL || 'categories'),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(categoriesPageSettings?.canonicalURL || 'categories'),
      title: makeSeoTitle((categoriesMetaFacebook?.title || categoriesPageSettings?.title), parentData.applicationName),
      description: makeSeoDescription(categoriesMetaFacebook?.description || categoriesPageSettings?.description, 65),
      images: await generateCoverImageObject(categoriesMetaFacebookImage || categoriesCover),
    },
  };
}

export default async function CategoriesPage() {
  const categoriesCollection = await getCategoriesCollection({populate: '*'});
  const categoriesPageSettings = await getSinglePageSettings('categories');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(categoriesPageSettings?.title.trim())}
      </Title>
      <section className={styles.grid}>
        {categoriesCollection.data.map((category) => {
          return (<CategoryCard key={category.id} data={category.attributes} />);
        })}
      </section>
    </main>
  );
}
