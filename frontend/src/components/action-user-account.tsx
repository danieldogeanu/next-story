'use client';

import { ModalBaseCloseButtonProps, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import ActionEntry from '@/components/action-entry';
import SiteDrawer from '@/components/site-drawer';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import styles from '@/styles/action-user-account.module.scss';


// Add extra property for the modal close button.
type ModalExtraCloseButtonProps = ModalBaseCloseButtonProps & { 'data-event-name'?: string };

// TODO: Handle authentication and replace login/register forms with submenu if authenticated.
// TODO: Replace user account icon with profile avatar when authenticated.

export default function ActionUserAccount({...otherProps}) {
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <ActionEntry 
        label='User Account'
        icon={IconUser}
        variant={opened ? 'light' : 'subtle'}
        onClick={open}
        {...otherProps}
      />

      <SiteDrawer
        title='User Account'
        size={400}
        opened={opened}
        onClose={close}
        closeButtonProps={{
          'data-event-name': 'Site Drawer - Close',
        } as ModalExtraCloseButtonProps}>

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

      </SiteDrawer>
    </>
  );
}
