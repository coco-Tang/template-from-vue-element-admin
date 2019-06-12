import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
// import './permission' // permission control
import './icons' // icon

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue'
Vue.component("ag-grid-vue", AgGridVue);

import { 
  Row,
  Col,
  Dialog,
  Card,
  progress,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Checkbox,
  Input,
  Tooltip,
  Message,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Select 
} from "element-ui";

const elementComponent = {
  Row,
  Col,
  Dialog,
  Card,
  progress,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Checkbox,
  Input,
  Tooltip,
  Message,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button, 
  Select 
}
Object.values(elementComponent).forEach(eleComp => {
  Vue.use(eleComp)
})

// 挂载一些方法
import * as Util from '@/utils'
Vue.prototype.$util = Util

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
