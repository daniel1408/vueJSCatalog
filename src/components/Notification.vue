<template>
  <div>
    <span class="notification-title">{{ title }}</span>
    <br />
    <span class="subtitle">{{ subtitle }}</span>
  </div>
</template>


<script>
export default {
  name: "Notification",
  props: {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
  },
};
</script>


<style lang="scss" scoped>
.notification-title {
  font-weight: 600 !important;
  font-size: 15px;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
}
.subtitle {
  font-weight: 100 !important;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  font-size: 13.4px;
}
</style>