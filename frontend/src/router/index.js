import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/learn', name: 'Learn', component: () => import('../pages/Learn.vue') },
  { path: '/writing', name: 'Writing', component: () => import('../pages/Writing.vue') },
  { path: '/games', name: 'Games', component: () => import('../pages/Games.vue') },
  { path: '/game/:type', name: 'GamePlay', component: () => import('../pages/GamePlay.vue'), props: true },
  { path: '/review', name: 'Review', component: () => import('../pages/Review.vue') },
  { path: '/checkin', name: 'Checkin', component: () => import('../pages/Checkin.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../pages/Dashboard.vue') },
  { path: '/print', name: 'Print', component: () => import('../pages/PrintCards.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
