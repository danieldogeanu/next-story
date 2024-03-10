import { NextStoryLogo } from '@/components/svgs';
import styles from '@/styles/page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <NextStoryLogo />
      </div>
    </main>
  );
}
