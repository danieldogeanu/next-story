'use client';

import classNames from 'classnames';
import { ActionIcon, Box, BoxProps, Text } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { useId, useViewportSize } from '@mantine/hooks';
import styles from '@/styles/social-button.module.scss';

export interface SocialButtonProps extends BoxProps {
  icon: React.FC<TablerIconsProps>;
  labels: {
    default: string;
    hover: string;
  };
}

export default function SocialButton({icon, labels, className, ...other}: SocialButtonProps) {
  const {width} = useViewportSize();
  const uuid = useId();
  const TablerIcon = icon;
  
  return (
    <Box className={classNames(styles.wrapper, className)} {...other}>

      <ActionIcon
        className={styles.button} id={uuid}
        size={(width > 360) ? 'xl' : 'lg'}
        variant='subtle' color='dark' radius='xl'
        aria-label={labels.hover} title={labels.hover}>
        <TablerIcon size={24} stroke={1.5} />
      </ActionIcon>

      <Text className={styles.labels}>
        <label htmlFor={uuid} className={styles.default}>{labels.default}</label>
        <label htmlFor={uuid} className={styles.hover}>{labels.hover}</label>
      </Text>

    </Box>
  );
}
