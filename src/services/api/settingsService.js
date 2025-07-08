import mockSettingsData from '@/services/mockData/settings.json';

let settings = { ...mockSettingsData };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings() {
    await delay(200);
    return { ...settings };
  },

  async updateSettings(newSettings) {
    await delay(300);
    settings = { ...newSettings };
    return { ...settings };
  }
};