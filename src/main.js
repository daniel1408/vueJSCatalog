import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import router from "./router";
import Axios from "axios";
import firebase from "firebase";
import "./assets/scss/styles.scss";
import store from "./store/store";
import Http from "@/services/http.js";
import { VueMaskDirective } from "v-mask";
import { getFirebase } from "./utils/auth";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import money from 'v-money'

Vue.config.productionTip = false;
Vue.directive("mask", VueMaskDirective);
Vue.use(money, {precision: 4})
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});

let config = getFirebase();

firebase.initializeApp(config);

Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.post["Content-Type"] = "application/json";

const token = store.state.LoginStore.token;

if (token) {
  Http.defaults.headers["Authorization"] = `Bearer ${token}`;
  // Vue.prototype.$http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

let app = "";
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      i18n,
      store,
      vuetify,
      router,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
