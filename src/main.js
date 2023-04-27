import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import * as Icons from "@ant-design/icons-vue"
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'

initAMapApiLoader({
    key: process.env.VUE_APP_AMAP_KEY,
    securityJsCode: process.env.VUE_APP_AMAP_SECURITY_CODE
})


const app = createApp(App)

app.use(Antd).use(VueAMap).mount('#app')

const icons = Icons
for (const i in icons) {
    app.component(i, icons[i])
}
