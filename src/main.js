import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'
import { paymentOrderRoutes } from '@/modules/payment-order-management'
import './assets/css/main.css'

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...paymentOrderRoutes,
    // redirect root to payment orders list
    { path: '/', redirect: '/payment-orders' },
  ],
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ui)
app.mount('#app')