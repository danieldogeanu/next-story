import NavEntry, { NavEntryProps } from '@/components/nav-entry';
import { getSingleNavData, SingleNavResponse } from '@/data/nav';
import styles from '@/styles/sitenav.module.scss';

export default async function SiteNav() {
  // Make request to server to get main navigation.
  const strapiResponse = await getSingleNavData('main-navigation') as SingleNavResponse[];

  // Map the Strapi response to match the NavEntry props shape.
  const navEntries = strapiResponse.map((item) => {
    const entry: NavEntryProps = {
      href: item.path || '',
      label: item.title,
    };

    if (item.items) entry.submenu = item.items.map((subItem) => ({
      href: subItem.path || '',
      label: subItem.title,
    }));

    return entry;
  }) as NavEntryProps[];

  return (
    <nav className={styles.container}>
      {navEntries && navEntries.map((entry, index) => (
        <NavEntry key={index} {...entry} />
      ))}
    </nav>
  );
}
