import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mantine/core';

// This is just a placeholder for future stories. Please delete!

const meta = {
  title: 'Mantine/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'select',
        labels: {
          xs: 'Tiny',
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
          xl: 'Huge',
        },
      },
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'select',
        labels: {
          xs: 'Tiny',
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
          xl: 'Huge',
        },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Button',
  },
};

export const Light: Story = {
  args: {
    variant: 'light',
    children: 'Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Button',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: 'Button',
  },
};

export const Transparent: Story = {
  args: {
    variant: 'transparent',
    children: 'Button',
  },
};

export const White: Story = {
  args: {
    variant: 'white',
    children: 'Button',
  },
};
