import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/noto-sans-thai/400.css'
import '@fontsource/noto-sans-thai/500.css'
import '@fontsource/noto-sans-thai/600.css'
import '@fontsource/noto-sans-thai/700.css'
import './ui/style.css'
import './ui/cohort.css'
import App from './ui/App.vue'
import './ui/life-spacing.css'
import { ui } from './content/ui'

document.title = `${ui.title} — ${ui.subtitle}`
createApp(App).use(createPinia()).mount('#app')
