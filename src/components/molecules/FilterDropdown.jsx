import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterDropdown = ({ 
  title, 
  options, 
  selectedValue, 
  onSelect, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        {selectedValue || title}
        <ApperIcon name="ChevronDown" className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div 
            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSelect('')}
          >
            All
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;