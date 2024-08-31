import type { Metadata, ResolvingMetadata } from 'next';
import { Title } from '@mantine/core';
import { getTagsCollection } from '@/data/tags';
import { getSinglePageSettings, PageCover, PageMetaSocial, PageMetaSocialEntry, PageRobots } from '@/data/settings';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { capitalize } from '@/utils/strings';
import { getPageUrl } from '@/utils/urls';
import TagCard from '@/components/tag-card';
import styles from '@/styles/page.module.scss';

export async function generateMetadata(props: null, parent: ResolvingMetadata): Promise<Metadata> {
  const parentData = await parent;
  const tagsPageSettings = await getSinglePageSettings('tags');
  const tagsPageRobots = tagsPageSettings?.robots as PageRobots;
  const tagsCover = tagsPageSettings?.cover?.data?.attributes as PageCover;
  const tagsMetaSocials = tagsPageSettings?.metaSocial as PageMetaSocial;
  const tagsMetaFacebook = tagsMetaSocials.filter((social) => (social.socialNetwork === 'Facebook')).pop() as PageMetaSocialEntry;
  const tagsMetaFacebookImage = tagsMetaFacebook?.image?.data?.attributes as PageCover;

  return {
    title: makeSeoTitle(tagsPageSettings?.title, parentData.applicationName),
    description: makeSeoDescription(tagsPageSettings?.description),
    keywords: makeSeoKeywords(tagsPageSettings?.keywords),
    robots: await generateRobotsObject(tagsPageRobots),
    alternates: {
      canonical: getPageUrl(tagsPageSettings?.canonicalURL || 'tags'),
    },
    openGraph: {
      ...parentData.openGraph,
      url: getPageUrl(tagsPageSettings?.canonicalURL || 'tags'),
      title: makeSeoTitle((tagsMetaFacebook?.title || tagsPageSettings?.title), parentData.applicationName),
      description: makeSeoDescription(tagsMetaFacebook?.description || tagsPageSettings?.description, 65),
      images: await generateCoverImageObject(tagsMetaFacebookImage || tagsCover),
    },
  };
}

export default async function TagsPage() {
  const tagsCollection = await getTagsCollection({populate: '*', sort: 'id:desc'});
  const tagsPageSettings = await getSinglePageSettings('tags');

  return (
    <main className={styles.main}>
      <Title className={styles.pageTitle}>
        {capitalize(tagsPageSettings?.title.trim())}
      </Title>
      <section className={styles.grid}>
        {tagsCollection.data.map((tag) => {
          return (<TagCard key={tag.id} data={tag.attributes} />);
        })}
      </section>
    </main>
  );
}
