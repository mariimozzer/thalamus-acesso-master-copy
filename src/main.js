import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVueNext from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import store from '../src/store'; 

const app = createApp(App)
app.use(router)
app.use(store)
app.use(BootstrapVueNext)
app.mount('#app')
