import mockUsersData from '@/services/mockData/users.json';

let users = [...mockUsersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      Id: Math.max(...users.map(u => u.Id), 0) + 1
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, updates) {
    await delay(300);
    const index = users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = { ...users[index], ...updates };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(200);
    const index = users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users.splice(index, 1);
    return { success: true };
  }
};