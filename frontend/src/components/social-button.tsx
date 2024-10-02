'use client';

import classNames from 'classnames';
import { ActionIcon, ActionIconProps, Box, BoxProps, ElementProps, Text } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { useId, useViewportSize } from '@mantine/hooks';
import styles from '@/styles/social-button.module.scss';


export interface SocialButtonProps extends ActionIconProps, 
  ElementProps<'button', keyof ActionIconProps> {
  labels: {
    default: string;
    hover: string;
  };
  icon: React.FC<TablerIconsProps>;
  iconProps?: TablerIconsProps;
  wrapperProps?: BoxProps;
}

export default function SocialButton({
  icon, iconProps, labels, className, wrapperProps, ...actionIconProps
}: SocialButtonProps) {
  const {width} = useViewportSize();
  const uuid = useId();
  const TablerIcon = icon;

  return (
    <Box 
      component='label' htmlFor={uuid}
      className={classNames(styles.wrapper, wrapperProps?.className, className)}
      {...wrapperProps}>

      <ActionIcon
        className={styles.button} id={uuid}
        size={(width > 360) ? 'xl' : 'lg'}
        aria-label={labels.hover} title={labels.hover}
        variant='subtle' color='dark' radius='xl'
        {...actionIconProps}>
        <TablerIcon size={(width > 360) ? 24 : 20} stroke={1.5} {...iconProps} />
      </ActionIcon>

      <Text component='div' className={styles.labels}>
        <span className={styles.default}>{labels.default}</span>
        <span className={styles.hover}>{labels.hover}</span>
      </Text>

    </Box>
  );
}
