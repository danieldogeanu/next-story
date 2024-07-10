import classNames from 'classnames';
import { notFound } from 'next/navigation';
import { Title } from '@mantine/core';
import { getAuthorsCollection, SingleAuthor } from '@/data/authors';
import { getFileURL } from '@/data/files';
import { capitalize } from '@/utils/strings';
import ArticleCard from '@/components/article-card';
import pageStyles from '@/styles/page.module.scss';
import authorStyles from '@/styles/author-page.module.scss';

export interface AuthorPageProps {
  params: {
    slug: string;
  };
}

// TODO: Fix these types, because they break if a property is undefined.
type AuthorAvatar = NonNullable<SingleAuthor['avatar']>['data']['attributes'];
type AuthorSocials = NonNullable<SingleAuthor['socialNetworks']>;
type AuthorSocialEntry = AuthorSocials[number] & {id: number};
type AuthorArticlesData = NonNullable<SingleAuthor['articles']>['data'];

export default async function AuthorPage({params}: AuthorPageProps) {
  const authorData = (await getAuthorsCollection({
    filters: { slug: { $eq: params.slug } },
    populate: {
      avatar: { populate: '*' },
      socialNetworks: { populate: '*' },
      articles: { populate: '*' },
      seo: { populate: '*' },
    },
  })).data.pop()?.attributes;
  const authorAvatar = authorData?.avatar?.data.attributes as AuthorAvatar;
  const authorAvatarFormats = JSON.parse(JSON.stringify(authorAvatar?.formats));
  const authorAvatarUrl = getFileURL(authorAvatarFormats.small.url);
  const authorSocials = authorData?.socialNetworks as unknown as AuthorSocialEntry[];
  const authorArticlesData = authorData?.articles?.data as AuthorArticlesData;
  const authorArticlesNumber = (authorArticlesData && authorArticlesData.length) ? authorArticlesData.length : 0;

  if (!authorData) return notFound();

  return (
    <main className={pageStyles.main}>

      <section className={classNames(pageStyles.container, authorStyles.intro)}>

        <Title className={pageStyles.pageTitle}>
          {capitalize(authorData?.fullName) + '\'s'} Articles
        </Title>

      </section>

      <section className={pageStyles.grid}>
        {authorArticlesData?.map((article) => {
          return <ArticleCard key={article.id} data={article.attributes} />
        })}
      </section>

    </main>
  );
}
