import React from 'react';
import { cn } from '@/utils/cn';

const Checkbox = React.forwardRef(({ 
  className,
  ...props 
}, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-2 transition-colors",
        className
      )}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;