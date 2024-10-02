'use client';

import classNames from 'classnames';
import { Button, ButtonProps, Group, GroupProps } from '@mantine/core';
import { IconCoin, IconMailPlus } from '@tabler/icons-react';
import { showNotImplemented } from '@/utils/react';
import styles from '@/styles/support-buttons.module.scss';


export interface SupportButtonsProps extends GroupProps {
  subscribeProps?: ButtonProps;
  sponsorProps?: ButtonProps;
}

export default function SupportButtons({subscribeProps, sponsorProps, className, ...otherProps}: SupportButtonsProps) {
  const {className: subscribeClassName, ...otherSubscribeProps} = subscribeProps ?? {} as ButtonProps;
  const {className: sponsorClassName, ...otherSponsorProps} = sponsorProps ?? {} as ButtonProps;
  
  return (
    <Group className={classNames(styles.container, className)} {...otherProps}>

      <Button
        className={classNames(styles.subscribeButton, subscribeClassName)}
        leftSection={<IconMailPlus size={24} stroke={1.5} />}
        onClick={showNotImplemented}
        color='blue' variant='filled' size='md'
        {...otherSubscribeProps}>Subscribe</Button>

      <Button
        className={classNames(styles.sponsorButton, sponsorClassName)}
        leftSection={<IconCoin size={24} stroke={1.5} />}
        onClick={showNotImplemented}
        variant='filled' size='md'
        {...otherSponsorProps}>Sponsor</Button>

    </Group>
  );
}
