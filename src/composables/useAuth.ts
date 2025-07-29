import { ref, computed, readonly } from 'vue'
import { api } from '@/utils/api'

interface User {
  id: string;
  email: string;
  xboxId: string;
  isProPlayer: boolean;
  hasLinkedXboxId: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface UserInfo {
  id: string;
  email: string;
  xboxId: string;
  isProPlayer: boolean;
  hasLinkedXboxId: boolean;
  userTier: string;
}

// 数据源配置
const USE_API = (import.meta as any).env?.VITE_USE_API === 'true' || false

// Mock数据
const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    xboxId: 'TestUser',
    isProPlayer: false,
    hasLinkedXboxId: true,
  },
  {
    id: 'user-002',
    email: 'protuner@example.com',
    xboxId: 'ProTuner',
    isProPlayer: true,
    hasLinkedXboxId: true,
  }
];

export function useAuth() {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);
  const currentMode = ref<'API' | 'Mock'>(USE_API ? 'API' : 'Mock');

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => {
    return user.value !== null;
  });

  // 获取当前数据源模式
  const getDataSource = () => {
    return currentMode.value;
  };

  // 设置数据源模式
  const setDataSource = (mode: 'API' | 'Mock') => {
    currentMode.value = mode;
    console.log(`[useAuth] 切换到${mode}模式`);
  };

  // Mock登录
  const mockLogin = async (credentials: { email: string; pass: string }): Promise<boolean> => {
    console.log('🔧 Mock模式：模拟登录');
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = mockUsers.find(u => u.email === credentials.email);
    if (mockUser && credentials.pass === 'password123') {
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      user.value = mockUser;
      localStorage.setItem('forzatune.user', JSON.stringify(mockUser));
      localStorage.setItem('forzatune.token', mockToken);
      
      console.log('✅ Mock登录成功');
      return true;
    } else {
      error.value = '邮箱或密码错误';
      return false;
    }
  };

  // Mock注册
  const mockRegister = async (details: { email: string; xboxId: string; pass: string; confirmPass: string }): Promise<boolean> => {
    console.log('🔧 Mock模式：模拟注册');
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查是否已存在
    if (mockUsers.find(u => u.email === details.email)) {
      error.value = '邮箱已存在';
      return false;
    }
    
    if (mockUsers.find(u => u.xboxId === details.xboxId)) {
      error.value = 'Xbox ID已存在';
      return false;
    }
    
    // 创建新用户
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: details.email,
      xboxId: details.xboxId,
      isProPlayer: false,
      hasLinkedXboxId: true,
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    user.value = newUser;
    localStorage.setItem('forzatune.user', JSON.stringify(newUser));
    localStorage.setItem('forzatune.token', mockToken);
    
    console.log('✅ Mock注册成功');
    return true;
  };

  // Mock获取用户信息
  const mockGetProfile = async (): Promise<UserInfo | null> => {
    console.log('🔧 Mock模式：模拟获取用户信息');
    
    const savedUser = localStorage.getItem('forzatune.user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return {
        id: userData.id,
        email: userData.email,
        xboxId: userData.xboxId,
        isProPlayer: userData.isProPlayer,
        hasLinkedXboxId: userData.hasLinkedXboxId,
        userTier: 'STANDARD'
      };
    }
    return null;
  };

  // 初始化用户状态
  const initializeAuth = async () => {
    if (isInitialized.value) return;
    
    const token = localStorage.getItem('forzatune.token');
    const savedUser = localStorage.getItem('forzatune.user');
    
    if (token && savedUser) {
      try {
        if (currentMode.value === 'API') {
          // API模式：验证token有效性
          const response = await api.get('/auth/profile');
          user.value = {
            id: response.id,
            email: response.email,
            xboxId: response.xboxId,
            isProPlayer: response.isProPlayer,
            hasLinkedXboxId: response.hasLinkedXboxId,
          };
          console.log('✅ 用户状态已恢复（API模式）');
        } else {
          // Mock模式：直接使用本地数据
          user.value = JSON.parse(savedUser);
          console.log('✅ 用户状态已恢复（Mock模式）');
        }
      } catch (err) {
        console.warn('⚠️ Token已失效，清除本地状态');
        clearAuth();
        
        // API失败时切换到Mock模式
        if (currentMode.value === 'API') {
          console.log('🔄 API不可用，切换到Mock模式');
          setDataSource('Mock');
        }
      }
    }
    
    isInitialized.value = true;
  };

  // 清除认证状态
  const clearAuth = () => {
    user.value = null;
    localStorage.removeItem('forzatune.user');
    localStorage.removeItem('forzatune.token');
  };

  // 清除错误
  const clearError = () => {
    error.value = null;
  };

  // 更新用户信息
  const updateUserInfo = async () => {
    if (!user.value) return;
    
    try {
      if (currentMode.value === 'API') {
        const response = await api.get('/auth/profile');
        user.value = {
          id: response.id,
          email: response.email,
          xboxId: response.xboxId,
          isProPlayer: response.isProPlayer,
          hasLinkedXboxId: response.hasLinkedXboxId,
        };
        localStorage.setItem('forzatune.user', JSON.stringify(user.value));
      } else {
        // Mock模式：用户信息已是最新的
        console.log('🔧 Mock模式：用户信息已是最新的');
      }
    } catch (err) {
      console.error('更新用户信息失败:', err);
      
      // API失败时切换到Mock模式
      if (currentMode.value === 'API') {
        console.log('🔄 API不可用，切换到Mock模式');
        setDataSource('Mock');
      }
    }
  };

  // 验证token有效性
  const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('forzatune.token');
    if (!token) return false;
    
    try {
      if (currentMode.value === 'API') {
        await api.get('/auth/profile');
        return true;
      } else {
        // Mock模式：简单检查token格式
        return token.startsWith('mock-jwt-token-');
      }
    } catch (err) {
      // API失败时切换到Mock模式
      if (currentMode.value === 'API') {
        console.log('🔄 API不可用，切换到Mock模式');
        setDataSource('Mock');
        return validateToken(); // 递归调用，使用Mock模式重新验证
      }
      return false;
    }
  };

  const login = async (credentials: { email: string; pass: string }): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log(`Attempting login for ${credentials.email} (${currentMode.value}模式)`);
      
      if (currentMode.value === 'API') {
        // API模式
        const result = await api.post('/auth/login', credentials);
        const { token, user: userInfo } = result;
        
        const loggedInUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          xboxId: userInfo.xboxId,
          isProPlayer: userInfo.isProPlayer,
          hasLinkedXboxId: userInfo.hasLinkedXboxId,
        };
        
        user.value = loggedInUser;
        localStorage.setItem('forzatune.user', JSON.stringify(loggedInUser));
        localStorage.setItem('forzatune.token', token);
        
        return true;
      } else {
        // Mock模式
        return await mockLogin(credentials);
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      console.error('Login error:', err);
      
      // API失败时切换到Mock模式
      if (currentMode.value === 'API') {
        console.log('🔄 API不可用，切换到Mock模式');
        setDataSource('Mock');
        return await login(credentials); // 递归调用，使用Mock模式重新登录
      }
      
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (details: { 
    email: string; 
    xboxId: string; 
    pass: string; 
    confirmPass: string 
  }): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log(`Attempting registration for ${details.email} (${currentMode.value}模式)`);
      
      if (currentMode.value === 'API') {
        // API模式
        const result = await api.post('/auth/register', details);
        const { token, user: userInfo } = result;
        
        const registeredUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          xboxId: userInfo.xboxId,
          isProPlayer: userInfo.isProPlayer,
          hasLinkedXboxId: userInfo.hasLinkedXboxId,
        };
        
        user.value = registeredUser;
        localStorage.setItem('forzatune.user', JSON.stringify(registeredUser));
        localStorage.setItem('forzatune.token', token);
        
        return true;
      } else {
        // Mock模式
        return await mockRegister(details);
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      console.error('Registration error:', err);
      
      // API失败时切换到Mock模式
      if (currentMode.value === 'API') {
        console.log('🔄 API不可用，切换到Mock模式');
        setDataSource('Mock');
        return await register(details); // 递归调用，使用Mock模式重新注册
      }
      
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    console.log('Logging out');
    clearAuth();
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
    isLoading: readonly(isLoading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    login,
    register,
    logout,
    linkXboxID,
    clearError,
    initializeAuth,
    updateUserInfo,
    validateToken,
    getDataSource,
    setDataSource,
  };
}
