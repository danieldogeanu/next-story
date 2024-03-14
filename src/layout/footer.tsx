'use server';

import Link from 'next/link';
import styles from '@/styles/footer.module.scss';
import LegalNav from '@/components/legalnav';

export default async function SiteFooter() {
  return (
    <footer className={styles.container}>
      <p className={styles.copyright}>
        <span title='Copyright'>&copy;</span> {(new Date()).getFullYear()} <Link href='/'>Next Story</Link>
      </p>
      <div className={styles.navigation}>

        <div className={styles.legal}>
          <LegalNav />
        </div>

        <div className={styles.social}>
          <a>Social</a>
        </div>
        
      </div>
    </footer>
  );
}
