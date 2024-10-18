import ActionSearch from '@/components/action-search';
import ActionThemeSwitcher from '@/components/action-theme-switcher';
import ActionUserAccount from '@/components/action-user-account';
import ActionMobileNav from '@/components/action-mobile-nav';
import { getSingleNav } from '@/data/navigation';
import styles from '@/styles/action-menu.module.scss';

export default async function ActionMenu() {
  // Make request to server to get main navigation.
  // We do this here, because ActionMobileNav is a client component.
  const navData = await getSingleNav('main-navigation');

  return (
    <div className={styles.container}>
      <ActionSearch />
      <ActionThemeSwitcher className={styles.hideSmallMobile} />
      <ActionUserAccount className={styles.hideSmallMobile} />
      <ActionMobileNav className={styles.mobileNav} data={navData} />
    </div>
  );
}
