import Link from 'next/link';
import LegalNav from '@/components/legalnav';
import SocialNav from '@/components/socialnav';
import styles from '@/styles/footer.module.scss';

export default function SiteFooter() {
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
          <SocialNav />
        </div>
        
      </div>
    </footer>
  );
}
