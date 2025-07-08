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
import { backupService } from '@/services/api/backupService';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
const [selectedBackupFile, setSelectedBackupFile] = useState(null);
const [isExporting, setIsExporting] = useState(false);
const [isImporting, setIsImporting] = useState(false);
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
      const followedByArray = user.followedBy ? user.followedBy.split(',') : [];
      filtered = filtered.filter(user => followedByArray.includes(filters.followedBy));
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
        Name: userData.username,
        username: userData.username,
        accountSource: userData.accountSource,
        dateAdded: new Date().toISOString(),
        followedBy: "",
        followedBack: false,
        dmSent: false,
        unfollowed: false,
        isBlacklisted: false,
        notes: ""
      });

      setUsers(prev => [...prev, newUser]);
      toast.success('User added successfully');
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
          Name: username,
          username: username,
          accountSource: accountSource,
          dateAdded: new Date().toISOString(),
          followedBy: "",
          followedBack: false,
          dmSent: false,
          unfollowed: false,
          isBlacklisted: false,
          notes: ""
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
      followedBy: user.followedBy || '',
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

  const handleExportDatabase = async () => {
    try {
      setIsExporting(true);
      await backupService.createBackup();
      toast.success('Database backup created successfully');
    } catch (err) {
      toast.error('Failed to create database backup');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportDatabase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const validation = await backupService.validateBackupFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          return;
        }

        setSelectedBackupFile(file);
        setIsRestoreConfirmOpen(true);
      } catch (err) {
        toast.error('Failed to validate backup file');
      }
    };
    input.click();
  };

  const handleConfirmRestore = async () => {
    if (!selectedBackupFile) return;

    try {
      setIsImporting(true);
      setIsRestoreConfirmOpen(false);
      
      const result = await backupService.restoreBackup(selectedBackupFile);
      
      if (result.success) {
        toast.success(result.message);
        // Reload data after successful restore
        await loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to restore database');
    } finally {
      setIsImporting(false);
      setSelectedBackupFile(null);
    }
  };

  const handleCancelRestore = () => {
    setIsRestoreConfirmOpen(false);
    setSelectedBackupFile(null);
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
            icon="Database"
            label="Export DB"
            onClick={handleExportDatabase}
            variant="secondary"
            disabled={isExporting}
          />
          <ActionButton
            icon="Upload"
            label="Import DB"
            onClick={handleImportDatabase}
            variant="secondary"
            disabled={isImporting}
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

      {/* Restore Confirmation Modal */}
      {isRestoreConfirmOpen && selectedBackupFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Database Restore
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                This will replace all current data with the backup. Are you sure you want to continue?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. Consider creating a backup first.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>Backup file:</strong> {selectedBackupFile.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={handleCancelRestore}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRestore}
                disabled={isImporting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isImporting ? 'Restoring...' : 'Restore Database'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;