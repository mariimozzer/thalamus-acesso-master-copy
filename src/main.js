import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVueNext from 'bootstrap-vue-next'
import VueMask from '@devindex/vue-mask'; // <-- ADD THIS LINE


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(router)
app.use(BootstrapVueNext)
app.use(VueMask); 
// app.use(PrimeVue);
app.mount('#app')
