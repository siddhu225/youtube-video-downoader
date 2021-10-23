import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';

const app = createApp(App);

app.use(Toast, {
  position: 'top-center',
  timeout: 5000,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  hideProgressBar: true,
  closeButton: false,
  icon: false,
});



require('./main.scss');

app.use(store);
app.use(router);

app.mount('#app')
