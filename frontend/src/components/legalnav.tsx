'use server';

import LegalLink, { LegalLinkProps } from '@/components/legal-link';
import styles from '@/styles/legalnav.module.scss';

export default async function LegalNav() {
  const legalLinks: LegalLinkProps[] = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookies' },
    { href: '/legal-terms', label: 'Legal Terms' },
    { href: '/acceptable-use', label: 'Acceptable Use' },
  ];

  return (
    <nav className={styles.container}>
      {legalLinks && legalLinks.map((link, index) => (
        <LegalLink key={index} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}
