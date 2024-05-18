import { mockSocialNavEntries } from '@/data/mock';
import SocialIcon, { SocialIconProps } from '@/components/social-icon';
import styles from '@/styles/socialnav.module.scss';

export default function SocialNav() {
  // TODO: Replace mockup data with entries from the server.
  const socialNavEntries: SocialIconProps[] = mockSocialNavEntries;

  return (
    <nav className={styles.container}>
      {socialNavEntries && socialNavEntries.map((socialIcon, index) => (
        <SocialIcon key={index} {...socialIcon} />
      ))}
    </nav>
  );
}
