/**
 * Authentication Service
 * 
 * Handles user authentication operations including sign up, sign in, sign out, and password reset.
 */

import { api, setAuthToken, clearAuthToken } from '@/lib/api-client';
import type {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  ResetPasswordRequest,
} from '@/types/api';

export const authService = {
  /**
   * Sign up a new user
   */
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    
    // Store auth token
    if (response.session?.access_token) {
      setAuthToken(response.session.access_token);
    }
    
    return response;
  },

  /**
   * Sign in an existing user
   */
  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    
    // Store auth token
    if (response.session?.access_token) {
      setAuthToken(response.session.access_token);
    }
    
    return response;
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<void> => {
    await api.post('/auth/signout');
    
    // Clear auth token
    clearAuthToken();
  },

  /**
   * Request password reset email
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
