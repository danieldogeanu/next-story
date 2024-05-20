import LegalLink, { LegalLinkProps } from '@/components/legal-link';
import getSingleNavData, { SingleNavResponse } from '@/data/nav';
import styles from '@/styles/legalnav.module.scss';

export default async function LegalNav() {
  // Make request to server to get legal navigation.
  const strapiResponse = await getSingleNavData('legal-navigation') as SingleNavResponse[];

  // Map the Strapi response to match the NavEntry props shape.
  const legalNavEntries = strapiResponse.map((item) => ({
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
