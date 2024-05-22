import { getArticlesCollection, getSingleArticle } from '@/data/articles';
import styles from '@/styles/page.module.scss';

export default async function Home() {

  // const strapiResponse = await getArticlesCollection({pagination: {page: 1, pageSize: 2}});

  // console.log(strapiResponse);

  // strapiResponse.data.map((article) => {
  //   console.log(article);
  // });


  const strapiResponse = await getSingleArticle(5, {fields: ['title', 'slug', 'excerpt']});

  console.log(strapiResponse);

  return (
    <main className={styles.main}>

    </main>
  );
}
