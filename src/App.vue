<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({}),
  computed: {
    showNavbar() {
      return this.$router.currentRoute.path === "/login" ? true : false;
    }
  }
};
</script>


<style lang="scss" scoped>
.navbar-title {
  font-size: 16px !important;
  font-weight: 500;
}
</style>

