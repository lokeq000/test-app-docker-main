import Vue from 'vue'

//Main pages
import App from './views/app.vue'
import store from './store/store'

const app = new Vue({
    store,
    el: '#app',
    components: { App }
});