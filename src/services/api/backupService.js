import JSZip from 'jszip';
import { userService } from './userService';
import { settingsService } from './settingsService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const backupService = {
  async createBackup() {
    await delay(500);
    
    try {
      // Collect all data
      const users = await userService.getAll();
      const settings = await settingsService.getSettings();
      
      // Create backup object
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          users,
          settings,
          blacklist: users.filter(user => user.isBlacklisted)
        }
      };

      // Create ZIP file
      const zip = new JSZip();
      zip.file('backup.json', JSON.stringify(backupData, null, 2));
      zip.file('readme.txt', `InstaFlow Manager Backup
Created: ${new Date().toLocaleString()}
Version: ${backupData.version}

This backup contains:
- ${users.length} users
- Application settings
- ${backupData.data.blacklist.length} blacklisted accounts

To restore, use the "Restore Backup" feature in Settings.`);

      // Generate blob
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `instaflow-backup-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: 'Backup created successfully' };
    } catch (error) {
      throw new Error('Failed to create backup: ' + error.message);
    }
  },

  async restoreBackup(file) {
    await delay(300);
    
    try {
      // Validate file type
      if (!file.name.endsWith('.zip')) {
        throw new Error('Please select a valid backup ZIP file');
      }

      // Read ZIP file
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      
      // Extract backup.json
      const backupFile = zipData.file('backup.json');
      if (!backupFile) {
        throw new Error('Invalid backup file: backup.json not found');
      }

      const backupContent = await backupFile.async('string');
      const backupData = JSON.parse(backupContent);

      // Validate backup structure
      if (!backupData.data || !backupData.data.users || !backupData.data.settings) {
        throw new Error('Invalid backup format: missing required data');
      }

      // Restore data
      const { users, settings } = backupData.data;
      
      // Update services (this would replace current data)
      await this.restoreUsers(users);
      await settingsService.updateSettings(settings);

      return { 
        success: true, 
        message: `Backup restored successfully. ${users.length} users and settings restored.`,
        stats: {
          users: users.length,
          settings: Object.keys(settings).length,
          timestamp: backupData.timestamp
        }
      };
    } catch (error) {
      throw new Error('Failed to restore backup: ' + error.message);
    }
  },

  async restoreUsers(users) {
    // This is a simplified restore - in a real app, you'd want more sophisticated merging
    const { userService: userSvc } = await import('./userService');
    
    // Clear existing users and restore from backup
    // Note: This replaces all data - in production, you might want merge options
    userSvc.users = [...users];
  },

  async validateBackupFile(file) {
    try {
      if (!file) return { valid: false, error: 'No file selected' };
      if (!file.name.endsWith('.zip')) return { valid: false, error: 'File must be a ZIP archive' };
      if (file.size > 50 * 1024 * 1024) return { valid: false, error: 'File too large (max 50MB)' };

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      
      const backupFile = zipData.file('backup.json');
      if (!backupFile) return { valid: false, error: 'Invalid backup: missing backup.json' };

      const content = await backupFile.async('string');
      const data = JSON.parse(content);
      
      if (!data.data || !data.data.users || !data.data.settings) {
        return { valid: false, error: 'Invalid backup format' };
      }

      return { 
        valid: true, 
        stats: {
          users: data.data.users.length,
          timestamp: data.timestamp,
          version: data.version
        }
      };
    } catch (error) {
      return { valid: false, error: 'Corrupted backup file: ' + error.message };
    }
  }
};