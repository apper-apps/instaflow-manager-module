import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ActionButton from '@/components/molecules/ActionButton';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';

const Blacklist = () => {
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setBlacklistedUsers(data.filter(user => user.isBlacklisted));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (userId) => {
    try {
      await userService.update(userId, { isBlacklisted: false });
      setBlacklistedUsers(prev => prev.filter(user => user.Id !== userId));
      toast.success('User restored successfully');
    } catch (err) {
      toast.error('Failed to restore user');
    }
  };

  const handlePermanentDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await userService.delete(userId);
        setBlacklistedUsers(prev => prev.filter(user => user.Id !== userId));
        toast.success('User permanently deleted');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blacklist</h1>
          <p className="text-gray-600">Manage blacklisted users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-700 text-sm font-medium">
              {blacklistedUsers.length} blacklisted
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {blacklistedUsers.length === 0 ? (
          <Empty
            icon="UserX"
            title="No blacklisted users"
            description="Users you blacklist will appear here. You can restore them to your main user list if needed."
            actionLabel="Go to Users"
            onAction={() => window.location.href = '/users'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Username</th>
                  <th className="text-left p-4 font-medium text-gray-700">Date Added</th>
                  <th className="text-left p-4 font-medium text-gray-700">Account Source</th>
                  <th className="text-left p-4 font-medium text-gray-700">Last Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blacklistedUsers.map((user) => (
                  <tr key={user.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="UserX" className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-900">@{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {format(new Date(user.dateAdded), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {user.accountSource}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.followedBack && (
                          <div className="w-2 h-2 bg-green-400 rounded-full" title="Followed back"></div>
                        )}
                        {user.dmSent && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full" title="DM sent"></div>
                        )}
                        {user.responseStatus && (
                          <span className="text-xs text-gray-500">{user.responseStatus}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon="RotateCcw"
                          label="Restore"
                          onClick={() => handleRestore(user.Id)}
                          variant="ghost"
                          className="text-green-600 hover:bg-green-50"
                        />
                        <ActionButton
                          icon="Trash2"
                          label="Delete"
                          onClick={() => handlePermanentDelete(user.Id)}
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {blacklistedUsers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">About Blacklisted Users</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Blacklisted users are prevented from being added again to your main user list. 
            You can restore them if needed, or permanently delete them. 
            Duplicate checking includes blacklisted users to prevent accidental re-addition.
          </p>
        </div>
      )}
    </div>
  );
};

export default Blacklist;