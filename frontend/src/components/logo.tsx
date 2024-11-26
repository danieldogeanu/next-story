import Link from 'next/link';
import { NextStoryLogo } from '@/components/svgs';
import styles from '@/styles/logo.module.scss';

export default function SiteLogo() {
  return (
    <Link
      className={styles.link}
      data-event-name='Site Logo'
      href='/'>
      <NextStoryLogo />
    </Link>
  );
}
