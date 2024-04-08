'use client';

import { Drawer, ScrollArea, Stack, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import styles from '@/styles/action-user-account.module.scss';

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
        size={400}
        className={styles.drawer}
        opened={opened}
        onClose={close}
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{backgroundOpacity: 0.5, blur: 3}}
        transitionProps={{
          transition: 'slide-left',
          timingFunction: 'ease',
          duration: 150,
        }}>

        <Stack className={styles.drawerContent}>

          <Tabs
            className={styles.tabsContent}
            variant='pills' defaultValue='login'>

            <Tabs.List grow>
              <Tabs.Tab size='md' value='login'>
                Login
              </Tabs.Tab>
              <Tabs.Tab size='md' value='register'>
                Register
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='login'>
              <LoginForm />
            </Tabs.Panel>

            <Tabs.Panel value='register'>
              <RegisterForm />
            </Tabs.Panel>

          </Tabs>

        </Stack>

      </Drawer>
    </>
  );
}
