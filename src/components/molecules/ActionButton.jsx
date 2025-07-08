import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'ghost',
  className,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="h-4 w-4" />}
      {label}
    </Button>
  );
};

export default ActionButton;