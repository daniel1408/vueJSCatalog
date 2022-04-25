<template>
  <v-card flat class="content-width">
    <v-toolbar flat>
      <v-toolbar-title class="title-card">Manutenção</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="#41b883"
        elevation="0"
        small
        dark
      >
        <v-icon class="mr-2" small>add</v-icon> Adicionar
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card class="mx-auto" flat>
      <v-container fluid class="pa-1">
        <loading
          color="#34495e"
          :width="64"
          :height="64"
          :active="loaderVisible"
          :can-cancel="true"
          loader="spinner"
          class="loading"
        ></loading>

        <v-row v-if="!loaderVisible" dense>
          <base-empty
            :data="dataEmpty"
            style="height: 70vh; width: 100%"
          ></base-empty>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog
      v-model="modalAdd"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="600"
      persistenttag
    >
      <h1>ADICIONAR</h1>
    </v-dialog>
  </v-card>
</template>

<script>
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import Loading from "vue-loading-overlay";
import { mapState } from "vuex";

export default {
  data: () => ({
    loaderVisible: true,
    selectedLog: {},
    modalAdd: false
  }),

  created() {
    setTimeout(() => {
      this.loaderVisible = false;
    }, 500);
  },

  methods: {},

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataEmpty() {
      return {
        icon: {
          name: "build",
          size: 55
        },
        title: "Nenhuma manutenção",
        subtitle: "Adicione item que ele será listado aqui"
      };
    }
  },

  props: {},

  components: {
    Loading,
    BaseEmpty
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.title-modal {
  font-size: 15px;
  font-weight: 400;
  color: #34495e;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.toolbar_title {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}
</style>
