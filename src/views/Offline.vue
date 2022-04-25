<template>
  <transition name="up-slide-fade">
    <v-layout wrap align-center justify-center row fill-height>
      <v-flex xs12 sm12 md12>
        <base-empty :data="dataEmpty"></base-empty>
        <v-btn
          small
          outlined
          :loading="loading"
          :disabled="loading"
          color="#34495e"
          >Reconectar</v-btn
        >
      </v-flex>
    </v-layout>
  </transition>
</template>

<script>
import BaseEmpty from "../components/Shared/BaseEmptyComponent";

export default {
  name: "Offline",
  data() {
    return {
      loading: false,
      dataEmpty: {
        icon: {
          name: "build",
          size: 80,
        },
        title: "Ops, estamos em manutenção...",
        subtitle: "Tente reconectar clicando no botão abaixo",
      },
    };
  },
  methods: {},
  components: {
    BaseEmpty,
  },
};
</script>

<style>
</style>
