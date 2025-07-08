import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Users", 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-6 mb-4">
        <ApperIcon name={icon} className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;