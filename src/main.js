import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/styles/common.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
Vue.use(ElementUI)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import { message } from '@/utils/resetMessage'
Vue.prototype.$message = message

import dForm from '@/components/Form'
import dTable from '@/components/Table'
import dDialog from '@/components/Dialog'
Vue.component('dForm', dForm)
Vue.component('dTable', dTable)
Vue.component('dDialog', dDialog)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
