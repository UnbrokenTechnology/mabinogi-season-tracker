import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('./pages/DashboardPage.vue') },
    { path: '/planner', name: 'planner', component: () => import('./pages/PlannerPage.vue') },
    { path: '/progress', name: 'progress', component: () => import('./pages/ProgressPage.vue') },
    { path: '/gold', name: 'gold', component: () => import('./pages/GoldGuidePage.vue') },
    { path: '/market', name: 'market', component: () => import('./pages/MarketPage.vue') },
    { path: '/maistir', name: 'maistir', component: () => import('./pages/MaistirGuidePage.vue') },
    { path: '/almanac', name: 'almanac', component: () => import('./pages/AlmanacPage.vue') },
    { path: '/ledger', name: 'ledger', component: () => import('./pages/LedgerPage.vue') },
    { path: '/settings', name: 'settings', component: () => import('./pages/SettingsPage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})
