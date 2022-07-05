import Http from "@/services/http.js";
import createPersistedState from "vuex-persistedstate";

export default {
  plugins: [createPersistedState()],
  namespaced: true,

  state: {
    token: "",
    storeUser: {},
  },
  mutations: {
    auth(state, token) {
      state.token = token;
    },

    addStore(state, store) {
      state.storeUser = store;
    },
  },
  actions: {
    ADD_STORE({ commit }, storeUser) {
      return new Promise((resolve) => {
        commit("addStore", storeUser);
        resolve();
      });
    },

    ADD_JWT({ commit }, token) {
      return new Promise((resolve) => {
        if (token) {
          Http.defaults.headers["Authorization"] = `Bearer ${token}`;
          commit("auth", token);
        } else {
          delete Http.defaults.headers["Authorization"];
          commit("auth", null);
        }
        resolve();
      });
    },

    REMOVE_TOKEN({ commit }, options = {}) {
      const { kickOff } = options;
      return new Promise((resolve) => {
        commit("auth", "");
        Http.defaults.headers["Authorization"] = "";
        if (kickOff) window.location = "/login";
        resolve();
      });
    },
  },
  getters: {
    getLoggedIn: (state) => !!state.token,
  },
};
