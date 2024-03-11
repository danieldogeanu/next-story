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
  primaryColor: 'strawberry-pink',
  primaryShade: { light: 4, dark: 5 },
  colors: {
    'strawberry-pink': [
      "#ffe7f3",
      "#ffcee1",
      "#ff9bbd",
      "#ff6399",
      "#ff4081", // 4: Light Primary Shade
      "#ff1867", // 5: Dark Primary Shade
      "#ff015d",
      "#e5004c",
      "#cc0044",
      "#b40039"
    ],
  },
  cursorType: 'pointer',
});
