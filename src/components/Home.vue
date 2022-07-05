<template>
  <v-card class="card-container">
    <v-card class="d-flex" style="height: 100%">
      <v-navigation-drawer style="border-radius: 0;" color="#F5F5F5" permanent>
        <v-toolbar class="toolbar-top" color="#F5F5F5" flat>
          <v-img
            src="@/assets/initial-logo.png"
            lazy-src="@/assets/initial-logo.png"
            width="200"
            alt="IMG"
          ></v-img>
        </v-toolbar>

        <v-list nav dense>
          <v-list-item-group v-model="selectedItem" mandatory>
            <v-list-item
              v-for="item in optionList"
              :disabled="item.disabled"
              :key="item.id"
              @click="openItem(item)"
              :value="item.id"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> {{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-card style="width: 100%; border-radius: 0" flat>
        <component @change-router="changeRouter" :is="MenuEnum[selectedItem]">
        </component>
      </v-card>
    </v-card>

    <v-dialog
      v-model="supportModal"
      persistent
      max-width="600"
      overlay-opacity="0.93"
    >
      <v-card>
        <v-card-title class="display-1 mb-1">Suporte técnico</v-card-title>
        <v-card-text class="mb-0">
          <div class="text--primary mb-7">
            Digite abaixo qual o problemas que você encontrou que iremos
            resolver assim que possível.
          </div>

          <v-text-field
            label="Loja"
            :value="'Usuário 1'"
            color="#34495e"
            type="text"
            disabled
            outlined
            dense
          ></v-text-field>

          <v-textarea
            label="Qual o problema?"
            v-model="supportText"
            hide-details
            outlined
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pb-4 mr-4">
          <v-spacer></v-spacer>
          <v-btn text small @click="supportModal = false">
            <v-icon small class="mr-1">cancel</v-icon>Cancelar
          </v-btn>
          <v-btn :loading="supportLoading" color="#34495e" small dark>
            <v-icon small class="mr-1">mail</v-icon>
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from "firebase";
import Component from "./Notification";
import Analytics from "./Analytics/Analytics";
import Client from "./Client/Client";
import Budget from "./Budget/Budget";
import Proposal from "./Proposal/Proposal";
import Users from "./Users/Users";
import Logs from "./Logs/Logs";
import Maintenance from "./Maintenance/Maintenance";
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    MenuEnum: {
      1: Client,
      2: Proposal,
      3: Budget,
      4: Analytics,
      5: Users,
      6: Logs,
      7: Maintenance
    },

    translate: {
      UBERLANDIA: "Uberlândia",
      BRASILIA: "Brasília",
      FRANCA: "Franca",
      PASSOS: "Passos",
      ALL: "Usuário ROOT"
    },

    optionList: [],
    find: null,
    editStoreData: {},
    supportModal: false,
    supportText: "",
    supportLoading: false,
    selectedItem: 4,
    showMore: false
  }),

  watch: {},

  created() {
    this.optionList = [
      {
        title: "Clientes",
        desc: "Todos cadastrados",
        id: 1,
        disabled: false,
        icon: "people_alt"
      },

      {
        title: "Orçamentos",
        desc: "Analise os orçamentos",
        id: 3,
        disabled: false,
        icon: "assignment"
      },

      {
        title: "Propostas",
        desc: "Acompanhe os orçamentos",
        id: 2,
        disabled: false,
        icon: "work"
      },

      {
        title: "Análises",
        desc: "Como vão suas vendas?",
        id: 4,
        disabled: false,
        icon: "assessment"
      },

      {
        title: "Usuários",
        desc: "Gerencie os usuários",
        id: 5,
        disabled: false,
        icon: "account_box"
      },

      {
        title: "Agenda",
        desc: "Controle as suas atividades",
        id: 6,
        disabled: false,
        icon: "event"
      },
      {
        title: "Manutenção",
        desc: "Pós instalação",
        id: 7,
        disabled: false,
        icon: "build"
      },
      {
        title: "Sair",
        desc: "Logout",
        id: 8,
        disabled: false,
        icon: "logout"
      }
    ];
  },

  methods: {
    ...mapActions("LoginStore", ["ADD_JWT", "ADD_STORE"]),

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("login");
          this.ADD_STORE({});
          this.ADD_JWT(null);
        })
        .catch(() => {
          this.$toast.error(
            <Component
              title="Erro ao sair"
              subtitle="Erro ao realizar o logout. Por favor tente novamente"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        });
    },

    openModalSupport() {
      this.supportModal = true;
    },

    openItemMobile(item) {
      item.id === 8 ? this.logout() : (this.selectedItem = item.id);
    },

    openItem(item) {
      if (item.id === 8) {
        this.logout();
      }
    },

    changeRouter(router) {
      if (router === "client") {
        this.selectedItem = 1;
      } else if (router === "budget") {
        this.selectedItem = 3;
      } else if (router === "proposal") {
        this.selectedItem = 2;
      } else if (router === "logs") {
        this.selectedItem = 6;
      } else {
        this.selectedItem = 4;
      }
    },

    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"])
  },

  components: {
    Maintenance,
    Analytics,
    Client,
    Budget,
    Proposal,
    Users,
    Logs
  }
};
</script>

<style scoped>
::v-deep .v-card__title {
  border-radius: 0 !important;
}

.card-image {
  background-color: #f9f9f9;
}

.title-toolbar {
  font-size: 16px;
  text-transform: uppercase;
}

.store-title {
  font-size: 18px;
  font-weight: 400;
  text-transform: uppercase;
  color: #fff;
}

.title-modal {
  font-size: 16px;
  font-weight: 200;
  color: #333;
}

.header-card {
  border: solid #34495e 1px;
  height: 70px;
  padding: 10px;
  background-color: #34495e;
  color: #fff;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

::v-deep .v-stepper__header,
.v-stepper {
  box-shadow: none !important;
}

.upload-container {
  background: white;
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
  padding: 10px 20px;
}

.title-content {
  margin-top: 155px;
  padding: 10px 5px;
}

.display-1 {
  font-weight: 500 !important;
  font-size: 24px !important;
  color: #333;
}

::v-deep .v-input input {
  font-size: 15px;
  font-weight: 400 !important;
}

::v-deep .v-list-item--active {
  background-color: #34495e !important;
  color: #fff;
}

.card-title {
  text-transform: uppercase;
  font-size: 16px;
  color: #333;
}

.card-subtitle {
  text-transform: uppercase;
  font-size: 12px;
  color: #333;
}

.label-type {
  position: absolute;
  top: 5px;
  right: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}

.user-type {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  background: #26384e;
  padding: 14px 0px 8px 0px;
}

.user-type-mobile {
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  background: #26384e;
  padding: 14px 0px 8px 0px;
  color: #fff;
  border-radius: 0;
}

.nav-bar-mobile {
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-radius: 0;
}

.toolbar-top {
  margin-bottom: 30px;
  margin-top: 20px;
}
</style>
