import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAuth } from '@/composables/useAuth'

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
    meta: { requiresAuth: true }
  },
  { 
    path: '/teams/:teamId', 
    name: 'TeamDetail', 
    component: () => import('@/views/TeamDetail.vue'),
    meta: { requiresAuth: true },
    props: true 
  },
  { 
    path: '/teams/:teamId/manage', 
    name: 'TeamManagement', 
    component: () => import('@/views/TeamManagement.vue'),
    meta: { requiresAuth: true }, // Add requiresAuth and role/permission check later
    props: true 
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/pro-application', 
    name: 'ProApplication', 
    component: () => import('@/views/ProApplication.vue'),
    meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  if (requiresAuth && !isLoggedIn.value) {
    // Redirect to login page, saving the intended destination
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    });
  } else if (guestOnly && isLoggedIn.value) {
    // If a logged-in user tries to access a guest-only page (like login), redirect them to home
    next({ name: 'Home' });
  } else {
    // Otherwise, allow navigation
    next();
  }
});


export default router 