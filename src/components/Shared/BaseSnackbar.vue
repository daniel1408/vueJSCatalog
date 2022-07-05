<template>
  <v-snackbar v-model="snackbar">
    {{ textSnack }}
    <v-btn text @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    snackbar: {
      type: Boolean,
      required: true
    },
    textSnack: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
