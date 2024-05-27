import SocialIcon, { SocialIconProps } from '@/components/social-icon';
import { getSiteSettings } from '@/data/settings';
import styles from '@/styles/socialnav.module.scss';

export default async function SocialNav() {
  // Get site settings from Strapi and map social networks to SocialIconProps[].
  const siteSettingsData = await getSiteSettings({populate: ['socialNetworks'], fields: ['siteTitle']});
  const socialNetworksData = siteSettingsData.data.attributes.socialNetworks;
  const socialNavEntries = socialNetworksData?.map((item) => ({
    href: item.link, label: item.label, icon: item.icon,
  })) as SocialIconProps[];

  return (
    <nav className={styles.container}>
      {socialNavEntries && socialNavEntries.map((socialIcon, index) => (
        <SocialIcon key={index} {...socialIcon} />
      ))}
    </nav>
  );
}
