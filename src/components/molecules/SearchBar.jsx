import React from 'react';
import { cn } from '@/utils/cn';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;