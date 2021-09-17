import Vue from "vue";

import * as ModalDialogs from "vue-modal-dialogs";
import VueAuth from "@websanova/vue-auth";
import Icon from "vue-awesome/components/Icon.vue";

import VueMeta from 'vue-meta'

import store from "./store";

// Import it before vue-router because it uses i18n strings
import "./utils/i18n";
import "./utils/axios";
import "./utils/icons";

import "./utils/bootstrap-vue";

import router from "./router";

import App from "./App.vue";

Vue.component("v-icon", Icon);

Vue.config.productionTip = false;

Vue.use(ModalDialogs);
Vue.use(VueMeta)

Vue.use(VueAuth, {
  auth: require("@websanova/vue-auth/drivers/auth/bearer.js"),
  authRedirect: "/p/login",
  http: require("@websanova/vue-auth/drivers/http/axios.1.x.js"),
  router: require("@websanova/vue-auth/drivers/router/vue-router.2.x.js"),
  rolesVar: "type_id",
  parseUserData: user => user
});

new Vue({
  store,
  router,
  el: "#app",
  render: h => h(App)
});
