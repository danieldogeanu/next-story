'use client';

import classNames from 'classnames';
import { Box, BoxProps } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconShare } from '@tabler/icons-react';
import SupportButtons from '@/components/support-buttons';
import SocialButton from '@/components/social-button';
import styles from '@/styles/action-bar.module.scss';

export interface ActionBarProps extends BoxProps {}

export default function ActionBar({className, ...other}: ActionBarProps) {
  // TODO: Replace likes and shares props from Article schema with relationships.
  // TODO: Get the number of comments for the comments button and link to the comment section.
  // TODO: Add modal or dropdown for the Share button with social networks options.
  
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
          className={styles.commentButton}
          icon={IconMessageCircle}
          labels={{
            default: '6 Comments',
            hover: 'Leave a Comment',
          }} />

      </div>

      <SupportButtons className={styles.supportActions} />

    </Box>
  );
}
