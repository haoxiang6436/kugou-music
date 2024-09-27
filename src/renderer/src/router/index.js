import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'HomeView',
          component: () => import('@/views/HomeView/index.vue')
        },
        {
          path: '/search',
          name: 'SearchView',
          component: () => import('@/views/SearchView/index.vue')
        }
      ]
    }
    // {
    //   path: '/user',
    //   name: 'user',
    //   component: () => import('@/views/UserInfoView.vue'),
    //   meta: { keepAlive: true }
    // }
  ]
})

export default router
