'use client';

import SocialIcon from '@/components/social-icon';
import { IconBrandDribbble, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';
import styles from '@/styles/socialnav.module.scss';

export default function SocialNav() {
  return (
    <nav className={styles.container}>
      <SocialIcon icon={IconBrandLinkedin} label='LinkedIn' href='https://linkedin.com/in/danieldogeanu' />
      <SocialIcon icon={IconBrandGithub} label='GitHub' href='https://github.com/danieldogeanu' />
      <SocialIcon icon={IconBrandDribbble} label='Dribbble' href='https://dribbble.com/danieldogeanu' />
      <SocialIcon icon={IconBrandInstagram} label='Instagram' href='https://instagram.com/danieldogeanu' />
    </nav>
  );
}
