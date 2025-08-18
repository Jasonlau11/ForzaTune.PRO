import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('@/views/Login.vue'),
    meta: { guestOnly: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: () => import('@/views/Register.vue'),
    meta: { guestOnly: true } 
  },
  { path: '/cars', name: 'Cars', component: () => import('@/views/Cars.vue') },
  { path: '/cars/:carId/tunes', name: 'CarTunes', component: () => import('@/views/CarTunes.vue'), props: true },
  { path: '/tunes/:tuneId', name: 'TuneDetail', component: () => import('@/views/TuneDetail.vue'), props: true },
  { path: '/community', name: 'Community', component: () => import('@/views/Community.vue') },
  { 
    path: '/upload', 
    name: 'UploadTune', 
    component: () => import('@/views/UploadTune.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/teams', 
    name: 'Teams', 
    component: () => import('@/views/Teams.vue'),
    meta: { requiresAuth: true, requiresXboxId: true }
  },
  { 
    path: '/teams/:teamId', 
    name: 'TeamDetail', 
    component: () => import('@/views/TeamDetail.vue'),
    meta: { requiresAuth: true, requiresXboxId: true },
    props: true 
  },
  { 
    path: '/teams/:teamId/manage', 
    name: 'TeamManagement', 
    component: () => import('@/views/TeamManagement.vue'),
    meta: { requiresAuth: true, requiresXboxId: true },
    props: true 
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/pro', 
    name: 'ProAdmin', 
    component: () => import('@/views/ProAdmin.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/pro-application', 
    name: 'ProApplication', 
    component: () => import('@/views/ProApplication.vue'),
    meta: { requiresAuth: true }
  },
  // 404 路由 - 必须放在最后
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('@/views/NotFound.vue')
  },
  // Add other routes here
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），则恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    
    // 如果是路由切换（不是前进/后退），则滚动到顶部
    if (to.path !== from.path) {
      return { top: 0 }
    }
    
    // 默认行为
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const { isLoggedIn, isInitialized, initializeAuth, user } = useAuth();
  const { info: toastInfo } = useToast();

  // 初始化认证状态
  if (!isInitialized.value) {
    await initializeAuth();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresXboxId = to.matched.some(record => record.meta.requiresXboxId);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  // 需要认证但未登录
  if (requiresAuth && !isLoggedIn.value) {
    console.log('🔒 需要登录，重定向到登录页面');
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 已是PRO玩家，阻止进入申请页
  if (to.name === 'ProApplication' && isLoggedIn.value && user.value?.isProPlayer) {
    toastInfo('无需申请', '您已是PRO玩家')
    next({ name: 'Profile' })
    return;
  }

  // 需要Xbox ID但未关联
  if (requiresXboxId && isLoggedIn.value && user.value && !user.value.hasLinkedXboxId) {
    console.log('🎮 需要关联Xbox ID，重定向到个人资料页面');
    next({ 
      name: 'Profile',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 已登录用户访问游客页面
  if (guestOnly && isLoggedIn.value) {
    console.log('👤 已登录用户访问游客页面，重定向到首页');
    next({ name: 'Home' });
    return;
  }

  // 其他情况允许访问
  next();
});

export default router 