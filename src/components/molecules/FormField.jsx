import React from 'react';
import { cn } from '@/utils/cn';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  error, 
  className,
  required,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children || <Input error={error} {...props} />}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;