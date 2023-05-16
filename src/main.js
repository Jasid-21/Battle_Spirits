import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App);

app.component('fai', FontAwesomeIcon);

app.use(VueSweetalert2);
app.use(store);
app.use(router);
app.mount('#app');
