'use server';

import SiteLogo from './logo';
import SiteNav from './sitenav';
import styles from '@/styles/header.module.scss';

export default async function SiteHeader() {
  return (
    <header className={styles.container}>

      <div className={styles.branding}>
        <SiteLogo />
      </div>

      <div className={styles.navigation}>
        <SiteNav />
      </div>

      <div className={styles.actions}>
      </div>

    </header>
  );
}
