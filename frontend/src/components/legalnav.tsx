import { mockLegalNavEntries } from '@/data/mock';
import LegalLink, { LegalLinkProps } from '@/components/legal-link';
import styles from '@/styles/legalnav.module.scss';

export default function LegalNav() {
  // TODO: Replace mockup data with entries from the server.
  const legalNavEntries: LegalLinkProps[] = mockLegalNavEntries;

  return (
    <nav className={styles.container}>
      {legalNavEntries && legalNavEntries.map((link, index) => (
        <LegalLink key={index} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}
