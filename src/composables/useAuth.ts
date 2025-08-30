import { ref, computed, readonly } from 'vue'
import { api } from '@/utils/api'

interface User {
  id: string;
  email: string;
  xboxId: string;
  isProPlayer: boolean;
  hasLinkedXboxId: boolean;
  proPlayerSince?: string;
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
  proPlayerSince?: string;
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

// 全局单例实例
let globalAuthInstance: ReturnType<typeof createAuthInstance> | null = null

function createAuthInstance() {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);
  // 认证相关默认走 API，失败时再降级到 Mock（避免未配置 VITE_USE_API 时注册/登录不调用后端）
  const currentMode = ref<'API' | 'Mock'>('API');

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
  const mockRegister = async (details: { email: string; xboxId: string; pass: string; confirmPass: string; emailCode?: string }): Promise<boolean> => {
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
    
    // 如果有token，尝试恢复用户状态
    if (token) {
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
            proPlayerSince: response.proPlayerSince,
          };
          // 保存到localStorage以保持状态一致
          localStorage.setItem('forzatune.user', JSON.stringify(user.value));
        } else if (savedUser) {
          // Mock模式：直接使用本地数据
          user.value = JSON.parse(savedUser);
        }
      } catch (err) {
        // API失败时切换到Mock模式
        if (currentMode.value === 'API') {
          setDataSource('Mock');
          // 如果有本地保存的用户数据，使用Mock模式恢复
          if (savedUser) {
            user.value = JSON.parse(savedUser);
          }
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
          proPlayerSince: response.proPlayerSince,
        };
        localStorage.setItem('forzatune.user', JSON.stringify(user.value));
        console.log('✅ 用户信息已更新（API模式）', user.value);
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
        
        console.log('✅ 登录成功，用户状态已更新:', user.value);
        return true;
      } else {
        // Mock模式
        return await mockLogin(credentials);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // 检查是否是业务逻辑错误（400系列）还是服务器/网络错误
      if (err.response) {
        // 有响应，说明服务器正常工作
        const status = err.response.status;
        if (status >= 400 && status < 500) {
          // 4xx错误是业务逻辑错误，直接显示错误信息，不切换到Mock模式
          error.value = err.response.data?.message || '登录失败';
          return false;
        } else if (status >= 500) {
          // 5xx错误是服务器错误，可以考虑切换到Mock模式
          error.value = err.response.data?.message || '服务器内部错误';
          if (currentMode.value === 'API') {
            console.log('🔄 服务器错误，切换到Mock模式');
            setDataSource('Mock');
            return await login(credentials);
          }
          return false;
        }
      } else {
        // 没有响应，可能是网络错误，切换到Mock模式
        error.value = '网络错误，请稍后重试';
        if (currentMode.value === 'API') {
          console.log('🔄 网络错误，切换到Mock模式');
          setDataSource('Mock');
          return await login(credentials);
        }
        return false;
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
    confirmPass: string,
    emailCode: string
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
        
        console.log('✅ 注册成功，用户状态已更新:', user.value);
        return true;
      } else {
        // Mock模式
        return await mockRegister(details);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // 检查是否是业务逻辑错误（400系列）还是服务器/网络错误
      if (err.response) {
        // 有响应，说明服务器正常工作
        const status = err.response.status;
        if (status >= 400 && status < 500) {
          // 4xx错误是业务逻辑错误，直接显示错误信息，不切换到Mock模式
          error.value = err.response.data?.message || '请求参数错误';
          return false;
        } else if (status >= 500) {
          // 5xx错误是服务器错误，可以考虑切换到Mock模式
          error.value = err.response.data?.message || '服务器内部错误';
          if (currentMode.value === 'API') {
            console.log('🔄 服务器错误，切换到Mock模式');
            setDataSource('Mock');
            return await register(details);
          }
          return false;
        }
      } else {
        // 没有响应，可能是网络错误，切换到Mock模式
        error.value = '网络错误，请稍后重试';
        if (currentMode.value === 'API') {
          console.log('🔄 网络错误，切换到Mock模式');
          setDataSource('Mock');
          return await register(details);
        }
        return false;
      }
      
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 发送邮箱验证码
  const sendEmailCode = async (email: string): Promise<boolean> => {
    if (!email) return false;
    try {
      const resp = await api.post<{ success: boolean; message?: string; error?: { message: string } }>(
        '/auth/send-email-code',
        { email }
      );
      if ((resp as any).success || resp === true) {
        return true;
      }
      error.value = (resp as any).message || '发送验证码失败';
      return false;
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      return false;
    }
  };

  // 发送忘记密码验证码
  const forgotPassword = async (email: string): Promise<boolean> => {
    if (!email) return false;
    try {
      const resp = await api.post<{ success: boolean; message?: string }>(
        '/auth/forgot-password',
        { email }
      );
      if (resp.success) {
        return true;
      }
      error.value = resp.message || '发送验证码失败';
      return false;
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      return false;
    }
  };

  // 验证重置密码验证码
  const verifyResetCode = async (email: string, code: string): Promise<{ token: string } | null> => {
    if (!email || !code) return null;
    try {
      const resp = await api.post<{ success: boolean; data: { token: string }; message?: string }>(
        '/auth/verify-reset-code',
        { email, code }
      );
      if (resp.success && resp.data) {
        return resp.data;
      }
      error.value = resp.message || '验证码验证失败';
      return null;
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      return null;
    }
  };

  // 重置密码
  const resetPassword = async (token: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
    if (!token || !newPassword || !confirmPassword) return false;
    try {
      const resp = await api.post<{ success: boolean; message?: string }>(
        '/auth/reset-password',
        { token, newPassword, confirmPassword }
      );
      if (resp.success) {
        return true;
      }
      error.value = resp.message || '密码重置失败';
      return false;
    } catch (err: any) {
      error.value = err.response?.data?.message || '网络错误，请稍后重试';
      return false;
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
    sendEmailCode,
    forgotPassword,
    verifyResetCode,
    resetPassword,
  };
}

export function useAuth() {
  // 确保只创建一个全局实例
  if (!globalAuthInstance) {
    globalAuthInstance = createAuthInstance()
  }
  return globalAuthInstance
}
