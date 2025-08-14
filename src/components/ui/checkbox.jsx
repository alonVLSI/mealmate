import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ className, checked, ...props }, ref) => (
  <button
    ref__={ref}
    className={cn(
      "h-4 w-4 rounded border border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      checked && "bg-slate-900 text-slate-50",
      className
    )}
    {...props}
  >
    {checked && <Check className="h-3 w-3" />}
  </button>
));

Checkbox.displayName = "Checkbox";
export { Checkbox };