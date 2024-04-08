'use client';

import { Drawer, ScrollArea, Tabs } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import styles from '@/styles/action-user-account.module.scss';
import { useDisclosure } from '@mantine/hooks';

// TODO: Handle authentication and replace login/register forms with submenu if authenticated.
// TODO: Replace user account icon with profile avatar when authenticated.

export default function ActionUserAccount({...props}) {
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <ActionEntry 
        label='User Account'
        icon={IconUser}
        variant={opened ? 'light' : 'subtle'}
        onClick={open}
        {...props}
      />

      <Drawer
        title='User Account'
        position='right'
        size='30%'
        className={styles.drawer}
        opened={opened}
        onClose={close}
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{backgroundOpacity: 0.5, blur: 3}}
        transitionProps={{
          transition: 'slide-left',
          timingFunction: 'ease',
          duration: 150,
        }}
      >

      </Drawer>
    </>
  );
}
