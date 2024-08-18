'use client';

import classNames from 'classnames';
import { Box, BoxProps, Button } from '@mantine/core';
import { IconCoin, IconHeart, IconMailPlus, IconMessageCircle, IconShare } from '@tabler/icons-react';
import SocialButton from '@/components/social-button';
import styles from '@/styles/action-bar.module.scss';

export interface ActionBarProps extends BoxProps {}

export default function ActionBar({className, ...other}: ActionBarProps) {
  
  return (
    <Box className={classNames(styles.container, className)} {...other}>

      <div className={styles.socials}>

        <SocialButton
          className={styles.likeButton}
          icon={IconHeart}
          labels={{
            default: '46 Likes',
            hover: 'Like Article',
          }} />

        <SocialButton
          className={styles.shareButton}
          icon={IconShare}
          labels={{
            default: '23 Shares',
            hover: 'Share Article',
          }} />

        <SocialButton
          className={styles.likeButton}
          icon={IconMessageCircle}
          labels={{
            default: '6 Comments',
            hover: 'Leave a Comment',
          }} />

      </div>

      <div className={styles.actions}>

        <Button
          className={styles.subscribeButton}
          leftSection={<IconMailPlus size={24} stroke={1.5} />}
          color='blue' variant='filled' size='md'>Subscribe</Button>

        <Button
          className={styles.sponsorButton}
          leftSection={<IconCoin size={24} stroke={1.5} />}
          variant='filled' size='md'>Sponsor</Button>

      </div>

    </Box>
  );
}
