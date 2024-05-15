import { APIResponseCollection } from '@/types/strapi';
import { fetchMany } from '@/data/strapi';
import styles from '@/styles/page.module.scss';

export default async function Home() {
  const data = (await fetchMany('api::article.article')) as APIResponseCollection<'api::article.article'>;
  console.log(data);

  return (
    <main className={styles.main}>

    </main>
  );
}
