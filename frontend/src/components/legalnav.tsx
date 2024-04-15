'use server';

import LegalLink from '@/components/legal-link';
import { mockLegalNavEntries } from '@/data/mock';
import { NavEntryProps } from '@/data/types';
import styles from '@/styles/legalnav.module.scss';

export default async function LegalNav() {
  // TODO: Replace mockup data with entries from the server.
  const legalNavEntries: NavEntryProps[] = mockLegalNavEntries;

  return (
    <nav className={styles.container}>
      {legalNavEntries && legalNavEntries.map((link, index) => (
        <LegalLink key={index} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}
