import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Layout,
      children: [
        {
          path: '/layout',
          name: 'HomeView',
          component: () => import('@/views/HomeView/index.vue')
        },
        {
          path: '/layout/search',
          name: 'SearchView',
          component: () => import('@/views/SearchView/index.vue')
        }
      ]
    },
    { path: '/:catchAll(.*)', redirect: '/layout' }
  ]
})

export default router
