'use client';

import ActionSearch from '@/components/action-search';
import ActionThemeSwitcher from '@/components/action-theme-switcher';
import ActionUserDropdown from '@/components/action-user-dropdown';
import ActionMobileNav from '@/components/action-mobile-nav';
import styles from '@/styles/action-menu.module.scss';

export default function ActionMenu() {
  return (
    <div className={styles.container}>
      <ActionSearch />
      <ActionThemeSwitcher className={styles.hideSmallMobile} />
      <ActionUserDropdown className={styles.hideSmallMobile} />
      <ActionMobileNav className={styles.mobileNav} />
    </div>
  );
}
