import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 max-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref__={ref}
    className={cn(
      "relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-right", className)} {...props} />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref__={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
);

const DialogClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref__={ref}
    className={cn("absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100", className)}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogFooter.displayName = "DialogFooter";
DialogClose.displayName = "DialogClose";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose };