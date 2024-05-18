import { APIResponseCollection } from '@/types/strapi';
import { strapiSDK } from '@/data/strapi-sdk';
import styles from '@/styles/page.module.scss';

export default async function Home() {
  // Temporary request to Strapi to test things out.
  const strapiInstance = await strapiSDK();
  const articles = await strapiInstance.find<APIResponseCollection<'api::article.article'>>('articles');
  console.log(articles);

  return (
    <main className={styles.main}>

    </main>
  );
}
