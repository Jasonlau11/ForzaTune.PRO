import { ref, readonly, computed } from 'vue';
import { tokenManager } from '@/utils/api';

// Define the User interface based on project needs
interface User {
  id: string;
  email: string;
  xboxId: string;
  isProPlayer: boolean;
  hasLinkedXboxId: boolean;
}

// The user state, reactive and shared across the app
const user = ref<User | null>(null);

// Try to load user from localStorage on initial load
const storedUser = localStorage.getItem('forzatune.user');
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser);
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    localStorage.removeItem('forzatune.user');
  }
}

/**
 * A composable function to manage user authentication state and actions.
 * This is a frontend simulation of an auth system.
 */
export function useAuth() {

  const isLoggedIn = computed(() => !!user.value);

  const login = async (credentials: { email: string; pass: string }): Promise<boolean> => {
    try {
      console.log(`Attempting login for ${credentials.email}`);
      
      // 调用真实的登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const { token, user: userInfo } = result.data;
        
        // 设置用户信息
        const loggedInUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          xboxId: userInfo.xboxId,
          isProPlayer: userInfo.isProPlayer,
          hasLinkedXboxId: userInfo.hasLinkedXboxId,
        };
        
        user.value = loggedInUser;
        localStorage.setItem('forzatune.user', JSON.stringify(loggedInUser));
        
        // 设置JWT token
        tokenManager.setToken(token);
        
        return true;
      } else {
        console.error('Login failed:', result.error || result.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (details: { email: string; xboxId: string; pass: string }): Promise<boolean> => {
    try {
      console.log(`Attempting registration for ${details.email}`);
      
      // 调用真实的注册API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const { token, user: userInfo } = result.data;
        
        // 设置用户信息
        const registeredUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          xboxId: userInfo.xboxId,
          isProPlayer: userInfo.isProPlayer,
          hasLinkedXboxId: userInfo.hasLinkedXboxId,
        };
        
        user.value = registeredUser;
        localStorage.setItem('forzatune.user', JSON.stringify(registeredUser));
        
        // 设置JWT token
        tokenManager.setToken(token);
        
        return true;
      } else {
        console.error('Registration failed:', result.error || result.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Simulating logout');
    user.value = null;
    localStorage.removeItem('forzatune.user');
    // 清除token
    tokenManager.clearToken();
    // In a real app, you might want to redirect to home or login page
    // This can be handled in the component calling logout.
  };

  const linkXboxID = async (gamertag: string, verificationCode: string): Promise<boolean> => {
    console.log(`Simulating linking Xbox ID ${gamertag} with code ${verificationCode}`);
    if (user.value && verificationCode === 'XBOX-OK') {
      await new Promise(res => setTimeout(res, 500));
      user.value.hasLinkedXboxId = true;
      user.value.xboxId = gamertag;
      localStorage.setItem('forzatune.user', JSON.stringify(user.value));
      return true;
    }
    return false;
  };
  
  return {
    user: readonly(user),
    isLoggedIn,
    login,
    register,
    logout,
    linkXboxID,
  };
}
