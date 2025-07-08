import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ActionButton from '@/components/molecules/ActionButton';
import UserTable from '@/components/organisms/UserTable';
import AddUserModal from '@/components/organisms/AddUserModal';
import BulkAddModal from '@/components/organisms/BulkAddModal';
import FilterBar from '@/components/organisms/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { userService } from '@/services/api/userService';
import { settingsService } from '@/services/api/settingsService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    accountSource: '',
    followedBy: '',
    followedBack: '',
    dmSent: '',
    responseStatus: '',
    unfollowed: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, settingsData] = await Promise.all([
        userService.getAll(),
        settingsService.getSettings()
      ]);
      setUsers(usersData.filter(user => !user.isBlacklisted));
      setSettings(settingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.accountSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Column filters
    if (filters.accountSource) {
      filtered = filtered.filter(user => user.accountSource === filters.accountSource);
    }
    if (filters.followedBy) {
      filtered = filtered.filter(user => user.followedBy?.includes(filters.followedBy));
    }
    if (filters.followedBack) {
      filtered = filtered.filter(user => user.followedBack === (filters.followedBack === 'true'));
    }
    if (filters.dmSent) {
      filtered = filtered.filter(user => user.dmSent === (filters.dmSent === 'true'));
    }
    if (filters.responseStatus) {
      filtered = filtered.filter(user => user.responseStatus === filters.responseStatus);
    }
    if (filters.unfollowed) {
      filtered = filtered.filter(user => user.unfollowed === (filters.unfollowed === 'true'));
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filters]);

  const handleAddUser = async (userData) => {
    try {
      // Check for duplicates
      const existingUser = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
      if (existingUser) {
        toast.error('User already exists');
        return false;
      }

      // Check blacklist
      const allUsers = await userService.getAll();
      const blacklistedUser = allUsers.find(u => u.isBlacklisted && u.username.toLowerCase() === userData.username.toLowerCase());
      if (blacklistedUser) {
        toast.error('User is blacklisted');
        return false;
      }

      const newUser = await userService.create({
        ...userData,
        dateAdded: new Date().toISOString(),
        followedBy: [],
        followedBack: false,
        dmSent: false,
        unfollowed: false,
        isBlacklisted: false
      });

      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (err) {
      toast.error('Failed to add user');
      return false;
    }
  };

  const handleBulkAdd = async (usernames, accountSource) => {
    try {
      let added = 0;
      let duplicates = 0;

      const allUsers = await userService.getAll();
      const existingUsernames = allUsers.map(u => u.username.toLowerCase());

      for (const username of usernames) {
        if (existingUsernames.includes(username.toLowerCase())) {
          duplicates++;
          continue;
        }

        const newUser = await userService.create({
          username,
          accountSource,
          dateAdded: new Date().toISOString(),
          followedBy: [],
          followedBack: false,
          dmSent: false,
          unfollowed: false,
          isBlacklisted: false
        });

        setUsers(prev => [...prev, newUser]);
        added++;
      }

      return { success: true, added, duplicates };
    } catch (err) {
      toast.error('Failed to bulk add users');
      return { success: false, added: 0, duplicates: 0 };
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const updatedUser = await userService.update(userId, updates);
      setUsers(prev => prev.map(user => user.Id === userId ? updatedUser : user));
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.delete(userId);
      setUsers(prev => prev.filter(user => user.Id !== userId));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleBlacklistUser = async (userId) => {
    try {
      await userService.update(userId, { isBlacklisted: true });
      setUsers(prev => prev.filter(user => user.Id !== userId));
    } catch (err) {
      toast.error('Failed to blacklist user');
    }
  };

  const handleExportCSV = () => {
    const csvData = users.map(user => ({
      username: user.username,
      dateAdded: user.dateAdded,
      accountSource: user.accountSource,
      followedBy: user.followedBy?.join(';') || '',
      followDate: user.followDate || '',
      followedBack: user.followedBack ? 'Yes' : 'No',
      dmSent: user.dmSent ? 'Yes' : 'No',
      dmSentDate: user.dmSentDate || '',
      responseStatus: user.responseStatus || '',
      unfollowed: user.unfollowed ? 'Yes' : 'No',
      notes: user.notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Users exported successfully');
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage your Instagram users</p>
        </div>
        <div className="flex items-center gap-3">
          <ActionButton
            icon="Download"
            label="Export CSV"
            onClick={handleExportCSV}
            variant="secondary"
          />
          <ActionButton
            icon="Users"
            label="Bulk Add"
            onClick={() => setIsBulkModalOpen(true)}
            variant="secondary"
          />
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add User
          </Button>
        </div>
      </div>

      {settings && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          filters={filters}
          onFilterChange={handleFilterChange}
          accountSources={settings.accountSources}
          myAccounts={settings.myAccounts}
        />
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {filteredUsers.length === 0 ? (
          <Empty
            icon="Users"
            title="No users found"
            description="Start by adding your first Instagram user to track"
            actionLabel="Add User"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <UserTable
            users={filteredUsers}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
            onBlacklist={handleBlacklistUser}
            myAccounts={settings?.myAccounts || []}
          />
        )}
      </div>

      {settings && (
        <>
          <AddUserModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddUser}
            accountSources={settings.accountSources}
          />
          <BulkAddModal
            isOpen={isBulkModalOpen}
            onClose={() => setIsBulkModalOpen(false)}
            onBulkAdd={handleBulkAdd}
            accountSources={settings.accountSources}
          />
        </>
      )}
    </div>
  );
};

export default Users;