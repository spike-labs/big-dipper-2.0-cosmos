import type DesktopType from '@/components/nav/components/desktop';
import Mobile from '@/components/nav/components/mobile';
import { useStyles } from '@/components/nav/styles';
import { useScreenSize } from '@/hooks';
import dynamic from 'next/dynamic';
import React from 'react';

const Desktop = dynamic(() => import('@/components/nav/components/desktop')) as typeof DesktopType;

const Nav: React.FC<{
  title?: string;
}> = ({ title }) => {
  const classes = useStyles();
  const { isDesktop } = useScreenSize();
  if (isDesktop) {
    return <Desktop className={classes.desktop} title={title ?? ''} />;
  }
  return <Mobile className={classes.mobile} title={title ?? ''} />;
};

export default Nav;
