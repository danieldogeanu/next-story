import SiteLogo from './logo';
import styles from '@/styles/header.module.scss';

export default function SiteHeader() {
  return (
    <header className={styles.container}>
      <div className={styles.branding}>
        <SiteLogo />
      </div>
    </header>
  );
}
