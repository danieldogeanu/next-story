import ActionSearch from '@/components/action-search';
import ActionThemeSwitcher from '@/components/action-theme-switcher';
import ActionUserAccount from '@/components/action-user-account';
import ActionMobileNav from '@/components/action-mobile-nav';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionSearch />
      <ActionThemeSwitcher className={styles.hideSmallMobile} />
      <ActionUserAccount className={styles.hideSmallMobile} />
      <ActionMobileNav className={styles.mobileNav} />
    </div>
  );
}
