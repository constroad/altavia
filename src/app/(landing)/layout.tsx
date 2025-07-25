'use client';

import { ReactNode } from 'react';
import { PortalLayout } from '@/components';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <PortalLayout>{children}</PortalLayout>;
}
