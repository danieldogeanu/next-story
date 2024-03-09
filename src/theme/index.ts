import { createTheme } from '@mantine/core';
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
});
