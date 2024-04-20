import SiteLogo from '@/components/logo';
import SiteNav from '@/components/sitenav';
import ActionMenu from '@/components/action-menu';
import styles from '@/styles/header.module.scss';

export default function SiteHeader() {
  return (
    <header className={styles.container}>

      <div className={styles.branding}>
        <SiteLogo />
      </div>

      <div className={styles.navigation}>
        <SiteNav />
      </div>

      <div className={styles.actions}>
        <ActionMenu />
      </div>

    </header>
  );
}
