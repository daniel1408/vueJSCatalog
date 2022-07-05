import Vue from "vue";
import Router from "vue-router";
import store from "./store/store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/components/Login/login.vue"),
    },
    {
      path: "/sing-up",
      name: "SignUp",
      component: () => import("@/components/Login/signUp.vue"),
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("@/components/Home.vue"),
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: "/offline",
      name: "offline",
      component: () => import("@/views/Offline.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "*",
      component: () => import("@/views/NotFound.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.state.LoginStore?.storeUser?.requestToken;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
