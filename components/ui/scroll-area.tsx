'use client';

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ScrollAreaProps = HTMLAttributes<HTMLDivElement>;

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative overflow-y-auto', className)} {...props}>
      {children}
    </div>
  )
);

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
