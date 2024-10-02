'use client';

import { Anchor, Stack, Checkbox, PasswordInput, TextInput, Button, Divider, Text } from '@mantine/core';
import { showNotImplemented } from '@/utils/react';
import { IconKey } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { GoogleLogo } from './svgs';
import Link from 'next/link';
import styles from '@/styles/register-form.module.scss';

export default function RegisterForm() {
  const form = useForm({
    initialValues: {
      email: '',
      passwordOriginal: '',
      passwordConfirm: '',
      terms: false,
    },
  });

  return (
    <Stack className={styles.registerContents}>

      <form 
        className={styles.registerForm}
        onSubmit={form.onSubmit((values) => console.log(values))}
        id='register-form' name='register-form'>

        <TextInput
          size='md'
          type='email'
          name='email'
          label='Email Address'
          required
          withAsterisk={false}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          size='md'
          name='passwordOriginal'
          label='Choose Password'
          required
          withAsterisk={false}
          {...form.getInputProps('passwordOriginal')}
        />

        <PasswordInput
          size='md'
          name='passwordConfirm'
          label='Confirm Password'
          required
          withAsterisk={false}
          {...form.getInputProps('passwordConfirm')}
        />

        <Checkbox label={
          <Text size='sm'>
            I agree with the{' '}
            <Anchor component={Link} size='sm' href='/legal-terms' target='_blank'>Legal Terms</Anchor>
            {' '}and{' '}
            <Anchor component={Link} size='sm' href='/privacy-policy' target='_blank'>Privacy Policy</Anchor>
            {' '}for this site.
          </Text>
        } {...form.getInputProps('terms', {type: 'checkbox'})} />

        <Button
          size='md' type='submit' id='submit-register'
          rightSection={<IconKey size={20} stroke={2} />}
          onClick={() => {
            showNotImplemented();
            form.reset();
          }}
        >Register</Button>

      </form>

      <Divider label='or' labelPosition='center' />

      <Button
        id='register-with-google'
        className={styles.registerWith}
        size='md' variant='light' color='dark'
        leftSection={<GoogleLogo />}
        onClick={showNotImplemented}
      >Register with Google</Button>

    </Stack>
  );
}
