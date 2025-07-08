import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  ...props 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200",
      className
    )} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs mt-1 flex items-center gap-1",
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className="h-3 w-3" 
              />
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;