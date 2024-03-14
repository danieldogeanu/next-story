'use server';

import LegalLink from '@/components/legal-link';
import styles from '@/styles/legalnav.module.scss';

export default async function LegalNav() {
  return (
    <nav className={styles.container}>
      <LegalLink href='/privacy-policy'>Privacy Policy</LegalLink>
      <LegalLink href='/cookies'>Cookies</LegalLink>
      <LegalLink href='/legal-terms'>Legal Terms</LegalLink>
      <LegalLink href='/acceptable-use'>Acceptable Use</LegalLink>
    </nav>
  );
}
