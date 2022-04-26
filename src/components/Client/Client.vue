<template>
  <v-card flat class="content-width">
    <v-toolbar flat>
      <v-toolbar-title class="title-card">Clientes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="#505050"
        @click="viewList = !viewList"
        class="mr-2"
        small
        text
      >
        <div v-if="viewList" class="d-flex align-center">
          <v-icon class="mr-2" small>view_module</v-icon> Cards
        </div>

        <div v-else class="d-flex align-center">
          <v-icon class="mr-2" small>view_list</v-icon> Lista
        </div>
      </v-btn>

      <v-btn dark @click="addClient(null)" color="#41b883" depressed small>
        <v-icon class="mr-2" small>add</v-icon> Adicionar cliente
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-container fluid class="container-client">
      <div class="loading" v-if="loaderVisible">
        <rotate-square2 size="64px"></rotate-square2>
      </div>

      <v-row>
        <v-col cols="12" class="my-10">
          <v-text-field
            label="Buscar"
            v-model="modelSeach"
            prepend-inner-icon="search"
            color="#34495e"
            clearable
            hide-details
            outlined
            :disabled="loaderVisible"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="!loaderVisible && !viewList" dense>
        <base-empty
          :data="dataEmpty"
          style="height: 75vh; width: 100%"
          v-if="!filteredList.length"
        ></base-empty>

        <v-col
          v-for="(client, i) in filteredList"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          xl="3"
        >
          <v-card @click="openDetails(client)" class="cards" flat>
            <div>
              <h2 class="client-title">{{ client.name }}</h2>
              <span class="client-subtitle" style="font-weight: 500">
                E-mail:
              </span>
              <span class="client-subtitle">
                {{ client.email ? client.email : "Não consta" }}
              </span>
              <br />
              <span class="client-subtitle" style="font-weight: 500">
                Contato:
              </span>
              <span class="client-subtitle">{{ client.firstPhoneNumber }}</span>
              <span v-if="client.secondPhoneNumber">/</span>
              <span class="client-subtitle">
                {{ client.secondPhoneNumber }}
              </span>
            </div>

            <v-btn
              @click.stop="addLog(client)"
              fab
              depressed
              color="#f9f9f9"
              dark
            >
              <img src="@/assets/logs.png" alt="logo" width="35" />
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="!loaderVisible && viewList">
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="filteredList"
            class="elevation-1"
            hide-default-footer
            fixed-header
            no-data-text="Nenhum dado encontrado"
          >
            <template v-slot:[`item.city`]="{ item }">
              <span>{{ item.city }} / {{ item.state }}</span>
            </template>

            <template v-slot:[`item.email`]="{ item }">
              <span>{{ item.email || "Não consta" }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="openDetails(item)" outlined small>Detalhes</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-model="clientDetail"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      style="overflow: hidden"
      width="800"
      persistent
    >
      <v-toolbar flat color="#304156" dark>
        <v-toolbar-title class="title-card">
          {{ selectedClient.name }}
        </v-toolbar-title>

        <v-btn icon @click="clientDetail = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <client-details
        :client="selectedClient"
        @reload-list="reloadList"
        @close-modals="closeModals"
        @edit-client="editClient"
        @add-log="addLog"
        @reload-only="onlyReload"
        :userType="storeUser.userType"
      ></client-details>
    </v-dialog>

    <v-dialog
      v-model="modalAdd"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      style="overflow: hidden"
      width="900"
      persistent
    >
      <v-toolbar flat color="#304156" dark>
        <v-toolbar-title class="title-card" v-if="!isEdit">
          Adicionar cliente
        </v-toolbar-title>
        <v-toolbar-title class="title-card" v-else>
          Editar cliente
        </v-toolbar-title>

        <v-btn icon @click="modalAdd = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>
      <client-add
        :dataToEdit="clientSelected"
        :isEdit="isEdit"
        @close-modals="modalAdd = false"
        @reload-list="reloadList"
      ></client-add>
    </v-dialog>

    <v-dialog
      v-model="logModalAdd"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="600"
      persistent
    >
      <log-add
        :logToEdit="null"
        :client="clientSelected"
        :isEdit="false"
        @close-modals="logModalAdd = false"
        @reload-list="reloadListByLog"
      ></log-add>
    </v-dialog>
  </v-card>
</template>

<script>
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import ClientDetails from "./ClientDetails";
import ClientAdd from "./ClientAdd";
import LogAdd from "./../Logs/LogsAdd.vue";

import { RotateSquare2 } from "vue-loading-spinner";
import { getClientList } from "@/utils/functions.js";
import { mapState } from "vuex";

export default {
  data: () => ({
    textSnack: "",
    loaderVisible: true,
    overlay: false,
    clientList: [],
    selectedClient: {},
    clientDetail: false,
    modelSeach: "",
    termToSearch: "name",
    modalAdd: false,
    logModalAdd: false,
    isEdit: false,
    viewList: false,
    clientSelected: {},
    userToken: null,
    headers: [
      {
        text: "Nome",
        align: "start",
        sortable: false,
        value: "name"
      },
      {
        text: "Contato",
        value: "firstPhoneNumber",
        align: "start",
        sortable: false
      },

      {
        text: "Cidade/Estado",
        value: "city",
        align: "start",
        sortable: false
      },

      { text: "Email", value: "email", align: "start", sortable: false },
      { text: "", value: "actions", align: "start", sortable: false }
    ]
  }),

  created() {
    this.loadClientList();
  },

  methods: {
    loadClientList() {
      this.clientList = getClientList();
      setTimeout(() => {
        this.loaderVisible = false;
      }, 500);
    },

    back() {
      this.$router.replace("home");
    },

    simpleFilter() {
      return this.clientList.filter(data =>
        data.name.toLowerCase().includes(this.modelSeach.toLowerCase())
      );
    },

    addLog(client) {
      this.clientSelected = client;
      this.logModalAdd = true;
    },

    addClient(client) {
      this.clientSelected = client;
      this.modalAdd = true;
    },

    editClient(client) {
      this.isEdit = true;
      this.clientSelected = client;
      this.modalAdd = true;
    },

    openDetails(client) {
      this.selectedClient = client;
      this.clientDetail = true;
    },

    closeModals() {
      this.clientDetail = false;
      this.modalAdd = false;
      this.logModalAdd = false;
      this.isEdit = false;
    },

    reloadListByLog() {
      this.isEdit = false;
      this.logModalAdd = false;
      this.loadClientList();
    },

    reloadList() {
      this.loaderVisible = true;
      this.clientDetail = false;
      this.modalAdd = false;
      this.logModalAdd = false;
      this.isEdit = false;
      this.loadClientList();
    },

    onlyReload() {
      this.isEdit = false;
      this.loadClientList();
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),
    dataEmpty() {
      return {
        icon: {
          name: "person",
          size: 55
        },
        title: "Nenhum cliente",
        subtitle: "Adicione um client que ele será listado aqui"
      };
    },
    filteredList() {
      return this.modelSeach && this.clientList[0]
        ? this.simpleFilter()
        : this.clientList;
    }
  },

  props: {},

  components: {
    BaseEmpty,
    ClientDetails,
    ClientAdd,
    LogAdd,
    RotateSquare2
  }
};
</script>

<style scoped>
.client-title {
  font-weight: 600;
  text-transform: uppercase;
  color: #333;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.client-subtitle {
  color: #606060;
  font-size: 13px !important;
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
  /* 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; */
  margin: 20px 2px;
}

.details {
  font-weight: 500;
}

.container-client {
  overflow: auto;
  height: calc(100vh - 65px);
  border-radius: 0;
  padding: 0 100px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 65px);
}

.cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  background: #f9f9f9;
  border: solid 1px #f1f1f1;
}
</style>
