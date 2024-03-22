import Link from 'next/link';
import { NextStoryLogo } from '@/components/svgs';
import styles from '@/styles/logo.module.scss';

export default function SiteLogo() {
  return (
    <Link href='/' className={styles.link}>
      <NextStoryLogo />
    </Link>
  );
}
