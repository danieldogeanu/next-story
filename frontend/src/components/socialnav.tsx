'use client';

import SocialIcon, { SocialIconProps } from '@/components/social-icon';
import { IconBrandDribbble, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';
import styles from '@/styles/socialnav.module.scss';

export default function SocialNav() {
  const socialIcons: SocialIconProps[] = [
    { icon: IconBrandLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/danieldogeanu' },
    { icon: IconBrandGithub, label: 'GitHub', href: 'https://github.com/danieldogeanu' },
    { icon: IconBrandDribbble, label: 'Dribbble', href: 'https://dribbble.com/danieldogeanu' },
    { icon: IconBrandInstagram, label: 'Instagram', href: 'https://instagram.com/danieldogeanu' },
  ];

  return (
    <nav className={styles.container}>
      {socialIcons && socialIcons.map((socialIcon, index) => (
        <SocialIcon key={index} icon={socialIcon.icon} label={socialIcon.label} href={socialIcon.href} />
      ))}
    </nav>
  );
}
