import React from 'react';
import { cn } from '@/utils/cn';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  accountSources,
  myAccounts,
  className 
}) => {
  const responseOptions = [
    { value: 'Replied', label: 'Replied' },
    { value: 'Ignored', label: 'Ignored' },
    { value: 'Blocked', label: 'Blocked' }
  ];

  const followedBackOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  const dmSentOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  const unfollowedOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg", className)}>
      <div className="flex-1">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search users..."
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          title="Source"
          options={accountSources.map(source => ({ value: source, label: source }))}
          selectedValue={filters.accountSource}
          onSelect={(value) => onFilterChange('accountSource', value)}
        />
        
<FilterDropdown
          title="Followed By"
          options={(myAccounts || []).map(account => ({ value: account, label: `@${account}` }))}
          selectedValue={filters.followedBy}
          onSelect={(value) => onFilterChange('followedBy', value)}
        />
        
        <FilterDropdown
          title="Followed Back"
          options={followedBackOptions}
          selectedValue={filters.followedBack}
          onSelect={(value) => onFilterChange('followedBack', value)}
        />
        
        <FilterDropdown
          title="DM Sent"
          options={dmSentOptions}
          selectedValue={filters.dmSent}
          onSelect={(value) => onFilterChange('dmSent', value)}
        />
        
        <FilterDropdown
          title="Response"
          options={responseOptions}
          selectedValue={filters.responseStatus}
          onSelect={(value) => onFilterChange('responseStatus', value)}
        />
        
        <FilterDropdown
          title="Unfollowed"
          options={unfollowedOptions}
          selectedValue={filters.unfollowed}
          onSelect={(value) => onFilterChange('unfollowed', value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;