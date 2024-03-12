'use server';

import SiteNavEntry from './sitenav-entry';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  return (
    <nav className={styles.container}>
      <SiteNavEntry href='/'>Home</SiteNavEntry>
      <SiteNavEntry href='/about'>About</SiteNavEntry>
      <SiteNavEntry href='/services'>Services</SiteNavEntry>
      <SiteNavEntry href='/contact'>Contact</SiteNavEntry>
    </nav>
  );
}
