import type { Metadata, ResolvingMetadata } from 'next';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { getPageUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import AuthorCard from '@/components/author-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const authorPageSettings = await getSinglePageSettings('authors');
  const authorPageRobots = authorPageSettings?.robots as PageRobots;
  const authorCover = authorPageSettings?.cover?.data?.attributes as PageCover;
  const authorMetaSocials = authorPageSettings?.metaSocial as PageMetaSocial;
  const authorMetaFacebook = authorMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const authorMetaFacebookImage = authorMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(authorPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(authorPageSettings?.description),
    keywords: makeSeoKeywords(authorPageSettings?.keywords),
    robots: await generateRobotsObject(authorPageRobots),
    alternates: {
      canonical: getPageUrl(authorPageSettings?.canonicalURL || 'authors'),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(authorPageSettings?.canonicalURL || 'authors'),
      title: makeSeoTitle((authorMetaFacebook?.title || authorPageSettings?.title), parentData.applicationName),
      description: makeSeoDescription(authorMetaFacebook?.description || authorPageSettings?.description, 65),
      images: await generateCoverImageObject(authorMetaFacebookImage || authorCover),
    },
  };
}

export default async function AuthorsPage() {
  const authorsCollection = await getAuthorsCollection({populate: '*'});
  const authorPageSettings = await getSinglePageSettings('authors');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(authorPageSettings?.title.trim())}
      </Title>
      <section className={styles.grid}>
        {authorsCollection.data.map((author) => {
          return (<AuthorCard key={author.id} data={author.attributes} />);
        })}
      </section>
    </main>
  );
}
