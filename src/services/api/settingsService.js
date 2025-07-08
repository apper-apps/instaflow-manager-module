const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings() {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "myAccounts" } },
          { field: { Name: "accountSources" } },
          { field: { Name: "unfollowReminderDays" } },
          { field: { Name: "dmReminderDays" } },
          { field: { Name: "telegramBotToken" } },
          { field: { Name: "telegramChatId" } }
        ]
      };

      const response = await apperClient.fetchRecords('setting', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Return first settings record or create default if none exists
      if (response.data && response.data.length > 0) {
        const setting = response.data[0];
        return {
          myAccounts: setting.myAccounts ? setting.myAccounts.split(',') : [],
          accountSources: setting.accountSources ? setting.accountSources.split(',') : [],
          unfollowReminderDays: setting.unfollowReminderDays || 7,
          dmReminderDays: setting.dmReminderDays || 3,
          telegramBotToken: setting.telegramBotToken || "",
          telegramChatId: setting.telegramChatId || ""
        };
      } else {
        // Create default settings if none exist
        return {
          myAccounts: [],
          accountSources: ["hashtag", "competitor", "location", "manual", "referral", "story_mention"],
          unfollowReminderDays: 7,
          dmReminderDays: 3,
          telegramBotToken: "",
          telegramChatId: ""
        };
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  async updateSettings(newSettings) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First check if settings record exists
      const existing = await this.getSettings();
      
      // Only include Updateable fields
      const settingData = {
        Name: "Application Settings",
        myAccounts: Array.isArray(newSettings.myAccounts) ? newSettings.myAccounts.join(',') : newSettings.myAccounts,
        accountSources: Array.isArray(newSettings.accountSources) ? newSettings.accountSources.join(',') : newSettings.accountSources,
        unfollowReminderDays: newSettings.unfollowReminderDays || 7,
        dmReminderDays: newSettings.dmReminderDays || 3,
        telegramBotToken: newSettings.telegramBotToken || "",
        telegramChatId: newSettings.telegramChatId || ""
      };

      // Try to get existing record ID
      const fetchParams = {
        fields: [{ field: { Name: "Id" } }]
      };
      
      const fetchResponse = await apperClient.fetchRecords('setting', fetchParams);
      
      let response;
      if (fetchResponse.success && fetchResponse.data && fetchResponse.data.length > 0) {
        // Update existing record
        const params = {
          records: [{
            Id: fetchResponse.data[0].Id,
            ...settingData
          }]
        };
        response = await apperClient.updateRecord('setting', params);
      } else {
        // Create new record
        const params = {
          records: [settingData]
        };
        response = await apperClient.createRecord('setting', params);
      }

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update settings:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update settings');
        }
      }

      return newSettings;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }
};