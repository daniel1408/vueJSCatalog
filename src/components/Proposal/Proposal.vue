<template>
  <v-card flat class="content-width" style="height: 100vh">
    <v-toolbar flat color="#f5f5f5">
      <v-toolbar-title class="title-card">Propostas</v-toolbar-title>
      <v-spacer></v-spacer>
      <img src="@/assets/logo.png" alt="logo" width="140" />
    </v-toolbar>

    <v-card class="mx-auto" flat>
      <v-container fluid class="pa-0">
        <div class="loading" v-if="loaderVisible">
          <rotate-square2 size="64px"></rotate-square2>
        </div>

        <v-tabs
          v-if="!loaderVisible"
          v-model="tab"
          background-color="#f5f5f5"
          active-class="active-tab"
          color="#41b883"
          :icons-and-text="true"
          :centered="true"
          :grow="true"
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab :href="`#tab-1`">Validados</v-tab>
          <v-tab :href="`#tab-2`">Com pendências</v-tab>

          <v-tab-item :value="'tab-1'" class="px-1 tab-style">
            <base-empty
              v-if="!orderListP.length"
              :data="dataEmpty"
              class="empty"
            ></base-empty>

            <v-row
              dense
              class="px-4"
              v-for="(group, groupName) in progressList"
              :key="group.id"
            >
              <v-col cols="12" md="12" class="mt-6">
                <span class="group-title">
                  {{ groupName === "null" ? "GERAL" : formatDate(groupName) }}
                </span>
              </v-col>

              <v-col
                v-for="(order, index) in group"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                xl="3"
              >
                <v-card
                  color="#f9f9f9"
                  elevation="1"
                  class="d-flex justify-center ma-1"
                  @click="openDetails(order)"
                  :style="getBorder(order)"
                  :title="`Condição: ${order.situation}`"
                >
                  <div class="d-flex align-center" style="width: 100%">
                    <div>
                      <v-card-title class="order-title">
                        Proposta {{ order.id }}
                      </v-card-title>
                      <v-card-subtitle class="card-subtitle">
                        <b>Master:</b> {{ master[order.masterName] }} <br />
                        <b>Franqueado:</b> {{ order.client.name }} <br />
                        <b>Cliente:</b> {{ getConsulor(order.requestToken) }}
                        <br />
                        <b>Valor:</b> {{ currencyFormat(order.value) }} <br />
                        <b>Tipo de instalação:</b> {{ order.structure }} <br />
                        <b>Tecnologia:</b> {{ order.budget.technology }} <br />
                        <b>Potencia em kWp:</b> {{ order.systemPower }} <br />
                        <b>Consumo considerado em kWh:</b>
                        {{ order.consideredConsumption }} <br />
                        <b>Situação:</b> {{ order.commissionValue }} <br />
                      </v-card-subtitle>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item :value="'tab-2'" class="px-1 tab-style">
            <base-empty
              v-if="!orderListF.length"
              :data="dataFinishedEmpty"
              class="empty"
            ></base-empty>

            <v-row
              dense
              class="px-4"
              v-for="(group, groupName) in finishedList"
              :key="group.id"
            >
              <v-col cols="12" md="12" class="mt-6">
                <span class="group-title">
                  {{ groupName === "null" ? "GERAL" : formatDate(groupName) }}
                </span>
              </v-col>

              <v-col
                v-for="(order, index) in group"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                xl="3"
              >
                <v-card
                  color="#f9f9f9"
                  elevation="1"
                  class="d-flex justify-center ma-1"
                  @click="openDetails(order)"
                  :style="getBorder(order)"
                  :title="`Condição: ${order.situation}`"
                >
                  <div class="d-flex align-center" style="width: 100%">
                    <div>
                      <v-card-title class="order-title">
                        Proposta {{ order.id }}
                      </v-card-title>
                      <v-card-subtitle class="card-subtitle">
                        <b>Master:</b> {{ order.masterName }} <br />
                        <b>Franqueado:</b> {{ order.client.name }} <br />
                        <b>Cliente:</b> {{ getConsulor(order.requestToken) }}
                        <br />
                        <b>Valor:</b> {{ currencyFormat(order.value) }} <br />
                        <b>Tipo de instalação:</b> {{ order.structure }} <br />
                        <b>Tecnologia:</b> {{ order.budget.technology }} <br />
                        <b>Potencia em kWp:</b> {{ order.systemPower }} <br />
                        <b>Consumo considerado em kWh:</b>
                        {{ order.consideredConsumption }} <br />
                        <b>Situação:</b> {{ order.commissionValue }} <br />
                      </v-card-subtitle>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-card>

    <v-dialog
      v-model="proposalDetail"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="1000"
      style="overflow: hidden"
      persistent
    >
      <v-toolbar flat color="#304156" dark>
        <v-toolbar-title class="title-card">
          Detalhes da proposta
        </v-toolbar-title>

        <v-btn icon @click="proposalDetail = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <proposal-details
        :selectedProposal="selectedOrder"
        :userList="userList"
        @reload-list="reloadProposalList"
      ></proposal-details>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from "firebase";
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import ProposalDetails from "./ProposalDetails.vue";
import Component from "../Notification.vue";
import { mapState, mapActions } from "vuex";
import { groupBy, getUsers } from "@/utils/functions.js";
import { RotateSquare2 } from "vue-loading-spinner";

const masterList = {
  UBERLANDIA: "Uberlândia",
  BRASILIA: "Brasília",
  FRANCA: "Franca",
  PASSOS: "Passos"
};

export default {
  data: () => ({
    textSnack: "",
    loaderVisible: true,
    detailsModal: false,
    tab: null,
    orderListP: [],
    orderListF: [],
    selectedOrder: {},
    pageSize: 0,
    orderLength: 0,
    noLimit: true,
    proposalDetail: false,
    userToken: null,
    userList: [],
    master: masterList
  }),

  created() {
    this.getOrderList();
    this.userList = getUsers();
  },

  methods: {
    ...mapActions("LoginStore", ["ADD_JWT", "ADD_STORE"]),

    getOrderList() {
      // updateDate
      this.orderListP = [];
      this.orderListF = [];

      setTimeout(() => {
        this.loaderVisible = false;
      }, 500);
    },

    openDetails(order) {
      this.selectedOrder = order;
      this.proposalDetail = true;
    },

    currencyFormat(val) {
      return val && val !== "0"
        ? val.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
          })
        : "R$ 0,00";
    },

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

    back() {
      this.$router.replace("home");
    },

    getBorder(item) {
      return item.situation === "PENDENTE"
        ? "border-right: solid #b51414 5px"
        : "border-right: solid green 5px";
    },

    getConsulor(requestToken) {
      const user = this.userList.find(x => x.requestToken === requestToken);
      return user ? user.name : "Não consta";
    },

    formatDate(date) {
      let options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      };

      if (date) {
        let dt = new Date(date);
        let formattedDate = new Date(
          dt.getTime() + Math.abs(dt.getTimezoneOffset() * 60000)
        );
        return `${formattedDate.toLocaleDateString("pt-BR", options)}`;
      } else {
        return "Não informado";
      }
    },

    reloadProposalList() {
      this.proposalDetail = false;
      this.getOrderList();
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataEmpty() {
      return {
        icon: {
          name: "archive",
          size: 55
        },
        title: "Nenhuma proposta pendente",
        subtitle: "Aguarde até que um usuário realize uma proposta"
      };
    },

    dataFinishedEmpty() {
      return {
        icon: {
          name: "archive",
          size: 55
        },
        title: "Nenhuma proposta finalizado",
        subtitle: "Aguarde até que um usuário finalize uma proposta"
      };
    },

    progressList() {
      return groupBy(this.orderListP, "updateDate");
    },

    finishedList() {
      return groupBy(this.orderListF, "updateDate");
    }
  },

  components: {
    RotateSquare2,
    BaseEmpty,
    ProposalDetails
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
}

.back-menu-btn {
  z-index: 1010;
  position: absolute;
  bottom: 1.8em;
  right: 6em;
}

.price {
  font-size: 40px;
  color: #34495e;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

::v-deep .v-card__title {
  border-radius: 0 !important;
}

.order-title {
  font-weight: 500;
  text-transform: uppercase;
  color: #333;
  font-size: 14.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-image {
  border-radius: 50%;
}

::v-deep .v-tabs--icons-and-text > .v-tabs-bar {
  height: 55px !important;
  border-radius: 10px;
}

.active-tab {
  background-color: #f3f3f3;
  color: #41b883;
  font-weight: 400 !important;
  border-radius: 10px;
}

.v-tabs--icons-and-text > .v-tabs-bar .v-tab {
  font-size: 13px;
}

.group-title {
  font-size: 14px;
  text-transform: capitalize;
}

.v-tab {
  font-size: 12.5px !important;
}

.card-title {
  font-weight: 600;
  text-transform: uppercase;
  color: #333;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.card-subtitle {
  text-transform: capitalize;
  font-size: 13px;
  color: #606060 !important;
  letter-spacing: 0;
}

.empty {
  height: calc(100vh - 125px);
  width: 100%;
}

.tab-style {
  height: calc(100vh - 120px);
  overflow: auto;
}
</style>
