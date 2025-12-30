import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FormPage from './pages/FormPage.vue'
import PublicPage from './pages/PublicPage.vue'
import './styles/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'form',
      component: FormPage,
      meta: { title: 'Formulaire de diagnostic' }
    },
    {
      path: '/public',
      name: 'public',
      component: PublicPage,
      meta: { title: 'Liste des réponses' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Diagnostic Connexion Internet'
  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
