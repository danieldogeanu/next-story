import LegalLink, { LegalLinkProps } from '@/components/legal-link';
import { getSingleNav } from '@/data/navigation';
import styles from '@/styles/legalnav.module.scss';

export default async function LegalNav() {
  // Make request to server to get legal navigation.
  const navData = await getSingleNav('legal-navigation');

  // Map the Strapi response to match the SingleNavResponse props shape.
  const legalNavEntries = navData.map((item) => ({
    label: item.title, href: item.path,
  })) as LegalLinkProps[];

  return (
    <nav className={styles.container}>
      {legalNavEntries && legalNavEntries.map((link, index) => (
        <LegalLink key={index} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}
