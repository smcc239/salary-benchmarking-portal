import { User } from '../types/user';

// Mock user storage
let users: User[] = [];

export const registerUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Store user
  users.push(newUser);

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  return user;
};

export const getCurrentUser = async (): Promise<User | null> => {
  // In a real app, this would check the session/token
  return users[0] || null;
}; 