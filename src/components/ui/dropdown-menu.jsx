import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild }) => {
  const Comp = asChild ? React.Fragment : 'button';
  
  const handleClick = () => setIsOpen(!isOpen);
  
  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return <Comp onClick={handleClick}>{children}</Comp>;
};

const DropdownMenuContent = ({ children, align = 'center', isOpen, setIsOpen }) => {
  if (!isOpen) return null;
  
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      <div className={cn(
        "absolute top-full mt-1 z-50 min-w-[8rem] bg-white rounded-md border border-slate-200 shadow-md py-1",
        alignClasses[align]
      )}>
        {React.Children.map(children, child => 
          React.cloneElement(child, { setIsOpen })
        )}
      </div>
    </>
  );
};

const DropdownMenuItem = ({ children, onClick, setIsOpen, className }) => {
  const handleClick = (e) => {
    onClick?.(e);
    setIsOpen?.(false);
  };
  
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 flex items-center",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

DropdownMenu.displayName = "DropdownMenu";
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
DropdownMenuContent.displayName = "DropdownMenuContent";
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };