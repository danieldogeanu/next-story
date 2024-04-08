'use client';

import { Box, Drawer, DrawerProps, ScrollArea } from '@mantine/core';
import styles from '@/styles/site-drawer.module.scss';

export default function SiteDrawer({children, ...props}: DrawerProps) {
  return (
    <Drawer
      position='right'
      className={styles.drawer}
      scrollAreaComponent={ScrollArea.Autosize}
      overlayProps={{backgroundOpacity: 0.5, blur: 3}}
      transitionProps={{
        transition: 'slide-left',
        timingFunction: 'ease',
        duration: 150,
      }} {...props}>

      <Box className={styles.drawerContent}>
        {children}
      </Box>

    </Drawer>
  );
}
