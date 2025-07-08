import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { settingsService } from '@/services/api/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAccount, setNewAccount] = useState('');
  const [newSource, setNewSource] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleAddAccount = async () => {
    if (!newAccount.trim()) {
      toast.error('Please enter an account name');
      return;
    }

    const cleanAccount = newAccount.replace('@', '').trim();
    
    if (settings.myAccounts.includes(cleanAccount)) {
      toast.error('Account already exists');
      return;
    }

    try {
      const updatedSettings = {
        ...settings,
        myAccounts: [...settings.myAccounts, cleanAccount]
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      setNewAccount('');
      toast.success('Account added successfully');
    } catch (err) {
      toast.error('Failed to add account');
    }
  };

  const handleRemoveAccount = async (accountToRemove) => {
    try {
      const updatedSettings = {
        ...settings,
        myAccounts: settings.myAccounts.filter(account => account !== accountToRemove)
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Account removed successfully');
    } catch (err) {
      toast.error('Failed to remove account');
    }
  };

  const handleAddSource = async () => {
    if (!newSource.trim()) {
      toast.error('Please enter a source name');
      return;
    }

    const cleanSource = newSource.trim();
    
    if (settings.accountSources.includes(cleanSource)) {
      toast.error('Source already exists');
      return;
    }

    try {
      const updatedSettings = {
        ...settings,
        accountSources: [...settings.accountSources, cleanSource]
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      setNewSource('');
      toast.success('Source added successfully');
    } catch (err) {
      toast.error('Failed to add source');
    }
  };

  const handleRemoveSource = async (sourceToRemove) => {
    try {
      const updatedSettings = {
        ...settings,
        accountSources: settings.accountSources.filter(source => source !== sourceToRemove)
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Source removed successfully');
    } catch (err) {
      toast.error('Failed to remove source');
    }
  };

  const handleUpdateReminders = async (field, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [field]: parseInt(value) || 0
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Reminder settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const handleUpdateTelegram = async (field, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [field]: value
      };
      
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success('Telegram settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your Instagram management preferences</p>
      </div>

      {/* My Accounts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="Users" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">My Instagram Accounts</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="Enter account name (without @)"
              className="flex-1"
            />
            <Button onClick={handleAddAccount}>Add Account</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.myAccounts.map((account) => (
              <div key={account} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">@{account}</span>
                <button
                  onClick={() => handleRemoveAccount(account)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Sources */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="Tags" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Account Sources</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="Enter source name (e.g., hashtag, competitor)"
              className="flex-1"
            />
            <Button onClick={handleAddSource}>Add Source</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.accountSources.map((source) => (
              <div key={source} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">{source}</span>
                <button
                  onClick={() => handleRemoveSource(source)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="Clock" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Reminder Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Unfollow Reminder (days)"
            value={settings.unfollowReminderDays}
            onChange={(e) => handleUpdateReminders('unfollowReminderDays', e.target.value)}
            type="number"
            min="1"
            placeholder="7"
          />
          
          <FormField
            label="DM Reminder (days)"
            value={settings.dmReminderDays}
            onChange={(e) => handleUpdateReminders('dmReminderDays', e.target.value)}
            type="number"
            min="1"
            placeholder="3"
          />
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Unfollow Reminder:</strong> Get notified to unfollow users who haven't followed back after the specified days.
          </p>
          <p className="text-sm text-blue-800 mt-1">
            <strong>DM Reminder:</strong> Get notified to send a DM to users who followed back after the specified days.
          </p>
        </div>
      </div>

      {/* Telegram Settings */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="MessageCircle" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Telegram Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <FormField
            label="Telegram Bot Token"
            value={settings.telegramBotToken}
            onChange={(e) => handleUpdateTelegram('telegramBotToken', e.target.value)}
            placeholder="Enter your Telegram bot token"
            type="password"
          />
          
          <FormField
            label="Telegram Chat ID"
            value={settings.telegramChatId}
            onChange={(e) => handleUpdateTelegram('telegramChatId', e.target.value)}
            placeholder="Enter your Telegram chat ID"
          />
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Info" className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">How to setup Telegram notifications:</p>
            </div>
            <ol className="text-sm text-yellow-700 space-y-1 ml-4">
              <li>1. Create a bot by messaging @BotFather on Telegram</li>
              <li>2. Copy the bot token and paste it above</li>
              <li>3. Start a chat with your bot and send any message</li>
              <li>4. Get your chat ID from the bot or use @userinfobot</li>
              <li>5. Paste your chat ID above</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ApperIcon name="Database" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Backup & Restore</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
              <ApperIcon name="Download" className="h-4 w-4" />
              Create Backup
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <ApperIcon name="Upload" className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Backup includes:</strong> All users, blacklist, settings, and action history. 
              Restore will completely replace your current data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;