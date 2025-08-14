import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = ({ children, value, onValueChange, ...props }) => {
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        ref__={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
          {React.Children.map(children, child => {
            if (child.type?.displayName === 'SelectContent') {
              return React.cloneElement(child, { 
                value, 
                onValueChange: (newValue) => {
                  onValueChange?.(newValue);
                  setIsOpen(false);
                }
              });
            }
            return null;
          })}
        </div>
      )}
    </>
  );
});

const SelectValue = ({ placeholder }) => {
  return <span className="text-slate-500">{placeholder}</span>;
};

const SelectContent = ({ children, value, onValueChange }) => {
  return (
    <div className="py-1">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const SelectItem = ({ value: itemValue, children, value, onValueChange }) => {
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-slate-100",
        value === itemValue && "bg-slate-100"
      )}
      onClick={() => onValueChange?.(itemValue)}
    >
      {children}
    </div>
  );
};

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };