'use client';

import { Popover, Tabs } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import ActionEntry from '@/components/action-entry';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import styles from '@/styles/action-user-dropdown.module.scss';

// TODO: Handle authentication and replace login/register forms with submenu if authenticated.
// TODO: Replace user account icon with profile avatar when authenticated.

export default function ActionUserDropdown({...props}) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      width={340}
      position='bottom-end'
      shadow='md'
      opened={opened}
      onChange={setOpened}
      withArrow
      arrowPosition='side'
      arrowSize={12}
      arrowOffset={16}
      closeOnClickOutside
      trapFocus>

      <Popover.Target>
        <ActionEntry 
          label='User Account'
          icon={IconUser}
          variant={opened ? 'light' : 'subtle'}
          onClick={() => setOpened(o => !o)}
          {...props}
        />
      </Popover.Target>

      <Popover.Dropdown>
        
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

      </Popover.Dropdown>

    </Popover>
  );
}
