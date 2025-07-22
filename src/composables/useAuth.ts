import { ref, readonly, computed } from 'vue';

// Define the User interface based on project needs
interface User {
  id: string;
  email: string;
  gamertag: string;
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
    console.log(`Simulating login for ${credentials.email}`);
    // Simulate API delay
    await new Promise(res => setTimeout(res, 500));
    
    // In a real app, you'd validate credentials against a backend.
    // Here, we'll just create a mock user.
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      gamertag: 'SpeedyRacer', // Mock gamertag
      isProPlayer: false,
      hasLinkedXboxId: true, // Assume linked for simplicity on login
    };
    
    user.value = mockUser;
    localStorage.setItem('forzatune.user', JSON.stringify(mockUser));
    
    return true;
  };

  const register = async (details: { email: string; pass: string }): Promise<boolean> => {
    console.log(`Simulating registration for ${details.email}`);
    await new Promise(res => setTimeout(res, 800));

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: details.email,
      gamertag: 'NewPlayer' + Date.now().toString().slice(-4), // Assign a temporary name
      isProPlayer: false,
      hasLinkedXboxId: false, // Default to false on new registration
    };

    user.value = newUser;
    localStorage.setItem('forzatune.user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    console.log('Simulating logout');
    user.value = null;
    localStorage.removeItem('forzatune.user');
    // In a real app, you might want to redirect to home or login page
    // This can be handled in the component calling logout.
  };

  const linkXboxID = async (gamertag: string, verificationCode: string): Promise<boolean> => {
    console.log(`Simulating linking Xbox ID ${gamertag} with code ${verificationCode}`);
    if (user.value && verificationCode === 'XBOX-OK') {
      await new Promise(res => setTimeout(res, 500));
      user.value.hasLinkedXboxId = true;
      user.value.gamertag = gamertag;
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
