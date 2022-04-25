import axios from "axios";

const Http = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: 0,
  headers: { "Content-Type": "application/json" },
});

const setupStopProgress = () => {
  Http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {

      if (window.location.pathname !== "/login") {
        error?.response?.status === 403 && (window.location = `/login`);
      }
      return Promise.reject(error.response);
    }
  );
};

function load() {
  setupStopProgress();
}

load({ easing: "ease", speed: 1000, showSpinner: false });

export default Http;