import Vue from "vue";

export default {
  namespaced: true,
  actions: {
    SET_SNACKBAR_SUCCESS(snackBarMessage) {
      Vue.toasted.show(snackBarMessage, {
        type: "success",
        icon: "check",
        containerClass: "success-container",
        keepOnHover: true,
        theme: "toasted-primary",
        position: "bottom-left",
        duration: 3000,
      });
    },
    SET_SNACKBAR_INFO(snackBarMessage) {
      Vue.toasted.show(snackBarMessage, {
        type: "info",
        icon: "info",
        containerClass: "info-container",
        keepOnHover: true,
        theme: "toasted-primary",
        position: "bottom-left",
        duration: 3000,
      });
    },
    SET_SNACKBAR_ERROR(statusOrMsg = "") {
      Vue.toasted.show(statusOrMsg, {
        type: "error",
        icon: "error",
        containerClass: "error-container",
        keepOnHover: true,
        theme: "toasted-primary",
        position: "bottom-left",
        duration: 3000,
      });
    },
  },
};
