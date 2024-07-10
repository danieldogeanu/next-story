import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getAuthorsCollection } from '@/data/authors';
import { capitalize } from '@/utils/strings';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string;
  };
}

export default async function AuthorPage({params}: AuthorPageProps) {
  const authorData = (await getAuthorsCollection({
    populate: '*', filters: { slug: { $eq: params.slug } }
  })).data.pop()?.attributes;

  if (!authorData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, authorStyles.intro)}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(authorData?.fullName) + '\'s'} Articles
        </Title>
        
      </section>

    </main>
  );
}
