import NavEntry, { NavEntryProps } from '@/components/nav-entry';
import { StrapiRequestParams } from 'strapi-sdk-js';
import { strapiSDK } from '@/data/strapi';
import { GetValues } from '@/types/strapi';
import styles from '@/styles/sitenav.module.scss';

export interface StrapiNavRequestParams extends StrapiRequestParams {
  type?: 'FLAT' | 'TREE' | 'RFR';
  orderBy?: string;
  orderDirection?: string;
}

export type StrapiNavResponse = GetValues<'plugin::navigation.navigation-item'> & {
  items: StrapiNavResponse[];
};

export default async function SiteNav() {

  // Make request to server to get main navigation.
  const strapiInstance = await strapiSDK();
  const navRequestParams: StrapiNavRequestParams = {type: 'TREE', orderBy: 'order'};
  const strapiResponse = await strapiInstance.find(
    'navigation/render/main-navigation', navRequestParams
  ) as unknown as StrapiNavResponse[];

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
