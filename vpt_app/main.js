import Vue from 'vue'
import App from './App'
import faicon from './components/fa-icon/fa-icon.vue'

Vue.component('faicon',faicon)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
