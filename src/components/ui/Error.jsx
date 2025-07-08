import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;