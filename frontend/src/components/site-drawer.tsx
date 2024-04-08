'use client';

import { Box, Drawer, DrawerProps, ScrollArea } from '@mantine/core';
import styles from '@/styles/site-drawer.module.scss';

export interface SiteDrawerProps extends DrawerProps {
  hasMenu?: boolean;
}

export default function SiteDrawer({children, hasMenu = false, ...props}: SiteDrawerProps) {
  return (
    <Drawer
      position='right'
      className={styles.drawer}
      data-hasmenu={hasMenu}
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
