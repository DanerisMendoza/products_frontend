import App from './App.vue'
import store from './store';
import { createApp } from 'vue'
import Swal from 'sweetalert2';
import { registerPlugins } from '@/plugins'
import router from './router';


const app = createApp(App)
app.config.globalProperties.$swal = Swal;
registerPlugins(app)



app.use(store)
app.use(router)
app.mount('#app')
