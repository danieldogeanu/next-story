import { getArticlesCollection } from '@/data/articles';
import ArticleCard from '@/components/article-card';
import styles from '@/styles/page.module.scss';

export default async function Home() {
  const articlesCollection = await getArticlesCollection({populate: '*'});

  return (
    <main className={styles.main}>
      <section className={styles.grid}>
        {articlesCollection.data.map((article) => {
          return (<ArticleCard key={article.id} data={article.attributes} />);
        })}
      </section>
    </main>
  );
}
