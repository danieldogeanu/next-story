'use server';

import NavEntry from '@/components/nav-entry';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  return (
    <nav className={styles.container}>
      <NavEntry href='/'>Home</NavEntry>
      <NavEntry href='/about'>About</NavEntry>
      <NavEntry href='/services'>Services</NavEntry>
      <NavEntry href='/contact'>Contact</NavEntry>
    </nav>
  );
}
