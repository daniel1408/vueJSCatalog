<template>
  <v-card flat class="content-width">
    <v-toolbar flat>
      <v-toolbar-title class="title-card">Usuários</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="#505050"
        text
        @click="viewList = !viewList"
        class="mr-2"
        small
      >
        <div v-if="viewList" class="d-flex align-center">
          <v-icon class="mr-2" small>view_module</v-icon> Cards
        </div>

        <div v-else class="d-flex align-center">
          <v-icon class="mr-2" small>view_list</v-icon> Lista
        </div>
      </v-btn>

      <v-btn dark @click="addUser(null)" color="#41b883" elevation="0" small>
        <v-icon class="mr-2" small>add</v-icon> Adicionar usuário
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card class="mx-auto" flat>
      <v-container fluid class="container-users">
        <div class="loading" v-if="loaderVisible">
          <rotate-square2 size="64px"></rotate-square2>
        </div>

        <v-row v-if="!loaderVisible">
          <v-col cols="12" class="my-10">
            <v-text-field
              label="Buscar"
              v-model="modelSeach"
              prepend-inner-icon="search"
              color="#34495e"
              clearable
              hide-details
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="!loaderVisible && !viewList" dense>
          <base-empty
            v-if="!filteredList.length"
            :data="dataEmpty"
            class="empty"
          ></base-empty>

          <v-col
            cols="12"
            sm="6"
            md="4"
            xl="3"
            v-for="(user, i) in filteredList"
            :key="i"
          >
            <v-card @click="openItem(user)" flat class="cards">
              <div>
                <h2 class="user-title">{{ user.name }}</h2>
                <div class="mt-3">
                  <span class="user-subtitle">{{ user.email }}</span>
                </div>
                <div>
                  <span class="user-subtitle">{{ user.firstPhoneNumber }}</span>
                </div>
              </div>

              <div class="d-flex" style="flex-direction: column">
                <span class="mr-2 mb-1" style="font-size: 11px; color: #aaaaaa">
                  Tipo de usuário
                </span>
                <span class="mr-2 user-type">
                  {{ user.userType }}
                </span>
              </div>
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
            ></v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog
      v-model="modalAdd"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="1000"
      persistent
    >
      <user-add
        @close-modals="closeModals"
        @reload-list="reloadList"
        :userToEdit="userToAdd"
        :isEdit="isEdit"
      ></user-add>
    </v-dialog>

    <v-dialog
      v-model="modalDetails"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="500"
      persistent
    >
      <v-toolbar flat color="#304156" dark>
        <v-toolbar-title class="title-card"> Detalhes </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="modalDetails = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card>
        <div cols="12" class="pa-3 mb-3">
          <span class="details">CPF:</span>
          <span class="details-result">
            {{ userSelected.cpf || "Não consta" }}
          </span>
          <br />
          <span class="details">Nome:</span>
          <span class="details-result">
            {{ userSelected.name }}
          </span>
          <br />
          <span class="details">Phone:</span>
          <span class="details-result">
            {{ userSelected.firstPhoneNumber }}
          </span>
          <span class="details-result" v-if="userSelected.secondPhoneNumber">
            /
          </span>
          <span class="details-result" v-if="userSelected.secondPhoneNumber">
            {{ userSelected.secondPhoneNumber }}
          </span>
          <br />
          <span class="details">E-mail:</span>
          <span class="details-result">
            {{ userSelected.email }}
          </span>
          <br />

          <span class="details">Master:</span>
          <span class="details-result">
            {{ userSelected.masterName }}
          </span>
          <br />
        </div>

        <v-divider></v-divider>

        <div
          class="pa-3 d-flex align-center justify-center"
          style="background: #f9f9f9"
        >
          <v-menu
            v-model="deleteMenu"
            :close-on-content-click="false"
            max-width="400"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mt-2 mr-2"
                color="#b51414"
                width="200px"
                elevation="0"
                v-bind="attrs"
                v-on="on"
                small
                dark
              >
                <v-icon small class="mr-2">delete</v-icon>
                Deletar
              </v-btn>
            </template>

            <v-card>
              <v-toolbar flat>
                <v-toolbar-title class="title-card">
                  Confirmar deleção
                </v-toolbar-title>
              </v-toolbar>

              <v-divider></v-divider>

              <v-card-text>
                {{
                  `Todos os dados do usuário ${userSelected.name} serão perdidos. Deseja continuar com a deleção?`
                }}
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text small @click="deleteMenu = false"> Cancelar </v-btn>
                <v-btn
                  small
                  text
                  @click="deleteUs(userSelected)"
                  color="#b51414"
                >
                  Confirmar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-btn
            class="mt-2 btn-option"
            @click="addUser(userSelected)"
            small
            width="200px"
            text
            elevation="0"
          >
            <v-icon small class="mr-2">edit</v-icon>
            Editar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import { RotateSquare2 } from "vue-loading-spinner";
import Component from "../Notification.vue";
import UserAdd from "./UserAdd";
import { mapState } from "vuex";
import { deleteUser } from "@/services/OrderService.js";
import { getUsers } from "@/utils/functions.js";

export default {
  data: () => ({
    textSnack: "",
    loaderVisible: true,

    overlay: false,
    userList: [],
    selectedUser: {},
    selectedUserMeta: [],
    selectedUserMedia: {},
    showCloseBtn: true,
    isSavingImage: false,
    modelSeach: "",
    termToSearch: "name",
    pageSize: 0,
    modalAdd: false,
    isEdit: false,
    userSelected: {},
    userToAdd: {},
    modalDetails: false,
    viewList: false,
    deleteMenu: false,
    headers: [
      { text: "Nome", value: "name", align: "start", sortable: false },
      {
        text: "Tipo de usuário",
        value: "userType",
        align: "start",
        sortable: false
      },
      {
        text: "CPF",
        align: "start",
        sortable: false,
        value: "cpf"
      },
      {
        text: "E-mail",
        value: "email",
        align: "start",
        sortable: false
      },

      {
        text: "Contato",
        value: "firstPhoneNumber",
        align: "start",
        sortable: false
      }
    ]
  }),

  created() {
    this.loadUserList();
  },

  methods: {
    loadUserList() {
      this.userList = getUsers();
      setTimeout(() => {
        this.loaderVisible = false;
      }, 500);
    },

    back() {
      this.$router.replace("home");
    },

    simpleFilter() {
      return this.userList.filter(data =>
        data.name.toLowerCase().includes(this.modelSeach.toLowerCase())
      );
    },

    addUser(user) {
      this.userToAdd = user;
      this.isEdit = user ? true : false;
      this.modalAdd = true;
    },

    closeModals() {
      this.modalAdd = false;
      this.isEdit = false;
    },

    reloadList() {
      this.loaderVisible = true;
      this.modalAdd = false;
      this.isEdit = false;
      this.loadUserList();
    },

    deleteUs(user) {
      deleteUser(user.requestToken)
        .then(() => {
          this.loadUserList();
          this.$toast.success(
            <Component
              title="Sucesso!"
              subtitle="Usuário deletado com sucesso"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .catch(() => {
          this.$toast.error(
            <Component
              title="Erro ao deletar o usuário"
              subtitle={"Tente novamente"}
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          setTimeout(() => {
            this.loaderVisible = false;
            this.modalDetails = false;
          }, 500);
        });
    },

    openItem(item) {
      this.modalDetails = true;
      this.userSelected = item;
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataEmpty() {
      return {
        icon: {
          name: "supervised_user_circle",
          size: 55
        },
        title: "Nenhum usuário",
        subtitle: "Adicione um usuário que ele será listado aqui"
      };
    },
    filteredList() {
      return this.modelSeach && this.userList[0]
        ? this.simpleFilter()
        : this.userList;
    }
  },

  props: {},

  components: {
    RotateSquare2,
    BaseEmpty,
    UserAdd
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 65px);
}

.user-title {
  font-weight: 600;
  text-transform: uppercase;
  color: #333;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.user-subtitle {
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
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.details {
  font-weight: 500;
}

.details-result {
  font-size: 14px;
  color: #424242;
}

.user-type {
  font-weight: 400;
  font-size: 14px;
  margin-top: 1px;
}

.container-users {
  overflow: auto;
  height: calc(100vh - 65px);
  border-radius: 0;
  padding: 0 100px;
}

.cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  background: #f9f9f9;
  border: solid 1px #f1f1f1;
}

.empty {
  height: 70vh;
  width: 100%;
}
</style>
