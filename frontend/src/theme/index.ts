import { CSSVariablesResolver, createTheme } from '@mantine/core';
import { DM_Mono, DM_Sans, Inter } from 'next/font/google';

// Google Fonts
const fontInter = Inter({
  subsets: ['latin-ext'],
  display: 'swap',
});
const fontDmSans = DM_Sans({
  subsets: ['latin-ext'],
  display: 'swap',
});
const fontDmMono = DM_Mono({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

export default createTheme({
  fontFamily: fontInter.style.fontFamily,
  fontFamilyMonospace: fontDmMono.style.fontFamily,
  headings: {
    fontFamily: fontDmSans.style.fontFamily,
  },
  primaryColor: 'strawberry-pink',
  primaryShade: { light: 4, dark: 5 },
  colors: {
    'strawberry-pink': [
      '#ffe7f3',
      '#ffcee1',
      '#ff9bbd',
      '#ff6399',
      '#ff4081', // 4: Light Primary Shade
      '#ff1867', // 5: Dark Primary Shade
      '#ff015d',
      '#e5004c',
      '#cc0044',
      '#b40039'
    ],
  },
  cursorType: 'pointer',
  shadows: {
    xs: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)), 0 calc(0.0625rem * var(--mantine-scale)) calc(0.125rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-tertiary))',
    sm: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)), rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)) 0 calc(0.625rem * var(--mantine-scale)) calc(0.9375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, var(--next-story-shadow-opacity-secondary)) 0 calc(0.4375rem * var(--mantine-scale)) calc(0.4375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
    md: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)), rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)) 0 calc(1.25rem * var(--mantine-scale)) calc(1.5625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, var(--next-story-shadow-opacity-secondary)) 0 calc(0.625rem * var(--mantine-scale)) calc(0.625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
    lg: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)), rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)) 0 calc(1.75rem * var(--mantine-scale)) calc(1.4375rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, var(--next-story-shadow-opacity-secondary)) 0 calc(0.75rem * var(--mantine-scale)) calc(0.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
    xl: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)), rgba(0, 0, 0, var(--next-story-shadow-opacity-primary)) 0 calc(2.25rem * var(--mantine-scale)) calc(1.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, var(--next-story-shadow-opacity-secondary)) 0 calc(1.0625rem * var(--mantine-scale)) calc(1.0625rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))'
  }
});
