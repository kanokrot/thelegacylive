import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './ui/style.css'
import './ui/cohort.css'
import App from './ui/App.vue'
import './ui/app-theme.css'
import './ui/life-spacing.css'
import './ui/global-theme.css'
import './ui/home-theme.css'
import './ui/reveal-theme.css'
import { ui } from './content/ui'

document.title = `${ui.title} — ${ui.subtitle}`
createApp(App).use(createPinia()).mount('#app')
