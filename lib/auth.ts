// Authentication utility functions

export interface User {
  id: string;
  email: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
  isNewUser: boolean;
}

// Store authentication token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

// Get authentication token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Remove authentication token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

// Store user data
export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user data
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Logout user
export const logout = (): void => {
  removeAuthToken();
};
