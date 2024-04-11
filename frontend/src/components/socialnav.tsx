'use client';

import SocialIcon, { SocialIconProps } from '@/components/social-icon';
import { mockSocialNavEntries } from '@/data/mock';
import styles from '@/styles/socialnav.module.scss';

export default function SocialNav() {
  const socialIcons: SocialIconProps[] = mockSocialNavEntries;

  return (
    <nav className={styles.container}>
      {socialIcons && socialIcons.map((socialIcon, index) => (
        <SocialIcon key={index} {...socialIcon} />
      ))}
    </nav>
  );
}
