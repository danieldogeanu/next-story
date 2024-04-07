'use client';

import { Anchor, Stack, Checkbox, Group, PasswordInput, TextInput, Button, Divider } from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { GoogleLogo } from './svgs';
import Link from 'next/link';
import styles from '@/styles/login-form.module.scss';

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  return (
    <Stack className={styles.loginContents}>

      <form 
        className={styles.loginForm}
        onSubmit={form.onSubmit((values) => console.log(values))}
        id='login-form' name='login-form'>

        <TextInput
          size='md'
          type='email'
          name='email'
          label='Email'
          data-autofocus
          required
          withAsterisk={false}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          size='md'
          name='password'
          label='Password'
          required
          withAsterisk={false}
          {...form.getInputProps('password')}
        />

        <Group justify='space-between'>
          <Checkbox
            label='Remember Me'
            {...form.getInputProps('remember', {type: 'checkbox'})}
          />
          <Anchor
            component={Link}
            size='sm' href='/password-reset'
          >Reset Password</Anchor>
        </Group>

        <Button
          size='md' type='submit'
          rightSection={<IconLogin2 size={20} stroke={2} />}
        >Login</Button>

      </form>

      <Divider label='or' labelPosition='center' />

      <Button
        className={styles.loginWith}
        size='md' variant='light' color='dark'
        leftSection={<GoogleLogo />}
      >Login with Google</Button>

    </Stack>
  );
}
