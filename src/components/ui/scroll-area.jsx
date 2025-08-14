import React from 'react';
import { cn } from '../../lib/utils';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref__={ref}
    className={cn("overflow-auto", className)}
    {...props}
  >
    {children}
  </div>
));

ScrollArea.displayName = "ScrollArea";
export { ScrollArea };