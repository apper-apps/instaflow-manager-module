import React from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import ActionButton from '@/components/molecules/ActionButton';

const UserTable = ({ users, onUpdate, onDelete, onBlacklist, myAccounts }) => {
  const handleFieldUpdate = (userId, field, value) => {
    const updates = { [field]: value };
    
// Auto-set dates when certain fields are updated
    if (field === 'followedBy' && (Array.isArray(value) ? value.length > 0 : value)) {
      updates.followDate = new Date().toISOString();
    }
    if (field === 'dmSent' && value) {
      updates.dmSentDate = new Date().toISOString();
    }
    
    onUpdate(userId, updates);
  };

const getRowClassName = (user) => {
    if (user.dmSent) return 'status-dm-sent';
    if (user.followedBack) return 'status-followed-back';
    if (user.followedBy && (Array.isArray(user.followedBy) ? user.followedBy.length > 0 : user.followedBy.trim())) return 'status-followed';
    return '';
  };

  const getResponseBadgeVariant = (status) => {
    switch (status) {
      case 'Replied': return 'success';
      case 'Ignored': return 'warning';
      case 'Blocked': return 'danger';
      default: return 'default';
    }
  };

  const handleBlacklist = (user) => {
    if (window.confirm(`Are you sure you want to blacklist @${user.username}?`)) {
      onBlacklist(user.Id);
      toast.success(`@${user.username} has been blacklisted`);
    }
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete @${user.username}?`)) {
      onDelete(user.Id);
      toast.success(`@${user.username} has been deleted`);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
<th className="text-left p-3 font-medium text-gray-700">Username</th>
            <th className="text-left p-3 font-medium text-gray-700">Date Added</th>
            <th className="text-left p-3 font-medium text-gray-700">Source</th>
            <th className="text-left p-3 font-medium text-gray-700">Followed By</th>
            <th className="text-left p-3 font-medium text-gray-700">Follow Date</th>
            <th className="text-left p-3 font-medium text-gray-700">Followed Back</th>
            <th className="text-left p-3 font-medium text-gray-700">DM Sent</th>
            <th className="text-left p-3 font-medium text-gray-700">DM Date</th>
            <th className="text-left p-3 font-medium text-gray-700">Response</th>
            <th className="text-left p-3 font-medium text-gray-700">Unfollowed</th>
            <th className="text-left p-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Id} className={cn("border-b border-gray-100 hover:bg-gray-50", getRowClassName(user))}>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-4 w-4 text-white" />
                  </div>
                  <a 
                    href={`https://dereferer.me/?https://www.instagram.com/${user.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    @{user.username}
                  </a>
                </div>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {format(new Date(user.dateAdded), 'MMM dd, yyyy')}
              </td>
              <td className="p-3">
                <Select
                  value={user.accountSource}
                  onChange={(e) => handleFieldUpdate(user.Id, 'accountSource', e.target.value)}
                  className="w-28"
                >
                  <option value="hashtag">hashtag</option>
                  <option value="competitor">competitor</option>
                  <option value="location">location</option>
                  <option value="manual">manual</option>
                  <option value="referral">referral</option>
                  <option value="story_mention">story_mention</option>
                </Select>
              </td>
<td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {user.followedBy && user.followedBy.split(',').filter(account => account.trim()).map((account, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      @{account.trim()}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {user.followDate ? format(new Date(user.followDate), 'MMM dd, yyyy') : '-'}
              </td>
              <td className="p-3">
                <Select
                  value={user.followedBack ? 'Yes' : 'No'}
                  onChange={(e) => handleFieldUpdate(user.Id, 'followedBack', e.target.value === 'Yes')}
                  className="w-20"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Select>
              </td>
              <td className="p-3">
                <Checkbox
                  checked={user.dmSent}
                  disabled={!user.followedBack}
                  onChange={(e) => handleFieldUpdate(user.Id, 'dmSent', e.target.checked)}
                />
              </td>
              <td className="p-3 text-sm text-gray-600">
                {user.dmSentDate ? format(new Date(user.dmSentDate), 'MMM dd, yyyy') : '-'}
              </td>
              <td className="p-3">
                <Select
                  value={user.responseStatus || ''}
                  onChange={(e) => handleFieldUpdate(user.Id, 'responseStatus', e.target.value)}
                  disabled={!user.dmSent}
                  className="w-24"
                >
                  <option value="">None</option>
                  <option value="Replied">Replied</option>
                  <option value="Ignored">Ignored</option>
                  <option value="Blocked">Blocked</option>
                </Select>
              </td>
              <td className="p-3">
                <Checkbox
                  checked={user.unfollowed}
                  onChange={(e) => handleFieldUpdate(user.Id, 'unfollowed', e.target.checked)}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <ActionButton
                    icon="UserX"
                    onClick={() => handleBlacklist(user)}
                    variant="ghost"
                    className="p-1 text-red-600 hover:bg-red-50"
                  />
                  <ActionButton
                    icon="Trash2"
                    onClick={() => handleDelete(user)}
                    variant="ghost"
                    className="p-1 text-red-600 hover:bg-red-50"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;