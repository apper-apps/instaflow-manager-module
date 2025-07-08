const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
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
          { field: { Name: "username" } },
          { field: { Name: "dateAdded" } },
          { field: { Name: "accountSource" } },
          { field: { Name: "followedBy" } },
          { field: { Name: "followDate" } },
          { field: { Name: "followedBack" } },
          { field: { Name: "dmSent" } },
          { field: { Name: "dmSentDate" } },
          { field: { Name: "responseStatus" } },
          { field: { Name: "unfollowed" } },
          { field: { Name: "notes" } },
          { field: { Name: "isBlacklisted" } }
        ]
      };

      const response = await apperClient.fetchRecords('app_User', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getById(id) {
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
          { field: { Name: "username" } },
          { field: { Name: "dateAdded" } },
          { field: { Name: "accountSource" } },
          { field: { Name: "followedBy" } },
          { field: { Name: "followDate" } },
          { field: { Name: "followedBack" } },
          { field: { Name: "dmSent" } },
          { field: { Name: "dmSentDate" } },
          { field: { Name: "responseStatus" } },
          { field: { Name: "unfollowed" } },
          { field: { Name: "notes" } },
          { field: { Name: "isBlacklisted" } }
        ]
      };

      const response = await apperClient.getRecordById('app_User', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  async create(userData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: userData.Name || userData.username,
          Tags: userData.Tags || "",
          Owner: userData.Owner,
          username: userData.username,
          dateAdded: userData.dateAdded,
          accountSource: userData.accountSource,
          followedBy: Array.isArray(userData.followedBy) ? userData.followedBy.join(',') : (userData.followedBy || ""),
          followDate: userData.followDate,
          followedBack: userData.followedBack || false,
          dmSent: userData.dmSent || false,
          dmSentDate: userData.dmSentDate,
          responseStatus: userData.responseStatus,
          unfollowed: userData.unfollowed || false,
          notes: userData.notes || "",
          isBlacklisted: userData.isBlacklisted || false
        }]
      };

      const response = await apperClient.createRecord('app_User', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create user:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create user');
        }

        return response.results[0].data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async update(id, updates) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields in update
      const updateData = {
        Id: id
      };

      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
      if (updates.username !== undefined) updateData.username = updates.username;
      if (updates.dateAdded !== undefined) updateData.dateAdded = updates.dateAdded;
      if (updates.accountSource !== undefined) updateData.accountSource = updates.accountSource;
      if (updates.followedBy !== undefined) updateData.followedBy = Array.isArray(updates.followedBy) ? updates.followedBy.join(',') : updates.followedBy;
      if (updates.followDate !== undefined) updateData.followDate = updates.followDate;
      if (updates.followedBack !== undefined) updateData.followedBack = updates.followedBack;
      if (updates.dmSent !== undefined) updateData.dmSent = updates.dmSent;
      if (updates.dmSentDate !== undefined) updateData.dmSentDate = updates.dmSentDate;
      if (updates.responseStatus !== undefined) updateData.responseStatus = updates.responseStatus;
      if (updates.unfollowed !== undefined) updateData.unfollowed = updates.unfollowed;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.isBlacklisted !== undefined) updateData.isBlacklisted = updates.isBlacklisted;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('app_User', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update user:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update user');
        }

        return response.results[0].data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('app_User', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete user:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete user');
        }

        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};