import LoginStore from "@/components/Login/LoginStore";
import SnackBarStore from "@/components/SnackBarStore";

import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      /** Modules to be persisted
       * **/
      paths: ["LoginStore"],
    }),
  ],
  modules: {
    LoginStore,
    SnackBarStore,
  },
  state: {
    globalDTO: null,
  },
  mutations: {
    setGlobalDTO(state, data) {
      state.globalDTO = data;
    },
  },
  actions: {
    SET_GLOBAL_DTO({ commit }, data = null) {
      if (data && data.rebuildLayout !== false) data.rebuildLayout = true;
      commit("setGlobalDTO", data);
    },
  },
});

export default store;
