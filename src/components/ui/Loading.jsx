import React from 'react';
import { cn } from '@/utils/cn';

const Loading = ({ className }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      
      {/* Filter bar skeleton */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg border">
        {/* Table header */}
        <div className="border-b p-4">
          <div className="grid grid-cols-11 gap-4">
            {Array(11).fill(0).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Table rows */}
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="border-b p-4">
            <div className="grid grid-cols-11 gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              {Array(10).fill(0).map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;