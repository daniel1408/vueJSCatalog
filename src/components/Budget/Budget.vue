<template>
  <v-card flat class="content-width">
    <v-toolbar flat color="#f5f5f5">
      <v-toolbar-title class="title-card">Orçamentos</v-toolbar-title>
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

          <v-tab :href="`#tab-1`">Pendentes</v-tab>
          <v-tab :href="`#tab-2`">Analisados</v-tab>

          <v-tab-item :value="'tab-1'" class="px-1 tab-style">
            <base-empty
              :data="dataEmpty"
              class="empty"
              v-if="!budgetPendenceList.length"
            ></base-empty>

            <v-row
              dense
              class="px-4"
              v-for="(group, groupName) in progressList"
              :key="group.id"
            >
              <v-col cols="12" md="12" class="mt-6">
                <span class="group-title"> {{ formatDate(groupName) }} </span>
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
                >
                  <div class="d-flex align-center" style="width: 100%">
                    <div>
                      <v-card-title class="order-title">
                        {{ order.client.name }}
                      </v-card-title>
                      <v-card-subtitle class="card-subtitle">
                        <b>Endereço:</b> {{ order.address1 }} -
                        {{ order.address2 }} {{ order.complement }} <br />
                        <b>Número do orçamento :</b> {{ order.id }}<br />
                        <b>Criação:</b> {{ formatDate(order.createdDate) }}
                      </v-card-subtitle>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item :value="'tab-2'" class="px-1 tab-style">
            <base-empty
              :data="dataFinishedEmpty"
              class="empty"
              v-if="!budgetList.length"
            ></base-empty>

            <v-row
              dense
              class="px-4"
              v-for="(group, groupName) in finishedList"
              :key="group.id"
            >
              <v-col cols="12" md="12" class="mt-6">
                <span class="group-title"> {{ formatDate(groupName) }} </span>
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
                  :style="getBorder(order.proposalResponseDTOS[0])"
                >
                  <div class="d-flex align-center" style="width: 100%">
                    <div>
                      <v-card-title class="order-title">
                        {{ order.client.name }}
                      </v-card-title>
                      <v-card-subtitle class="card-subtitle">
                        <b>Endereço:</b> {{ order.address1 }} -
                        {{ order.address2 }} {{ order.complement }} <br />
                        <b>Número do orçamento :</b> {{ order.id }}<br />
                        <b>Criação:</b> {{ formatDate(order.createdDate) }}
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
      v-model="budgetDetail"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      width="1000"
      style="overflow: hidden"
      persistent
    >
      <budget-details
        :selectedBudget="selected"
        :userList="userList"
        @reload-list="reloadList"
        @close-detail="budgetDetail = false"
      ></budget-details>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from "firebase";
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import BudgetDetails from "./BudgetDetails.vue";
import Component from "../Notification.vue";

import { RotateSquare2 } from "vue-loading-spinner";
import { mapState, mapActions } from "vuex";
import { groupBy } from "@/utils/functions.js";
import { getUsers } from "@/services/OrderService.js";

export default {
  data: () => ({
    textSnack: "",
    loaderVisible: true,
    detailsModal: false,
    tab: null,
    budgetList: [],
    budgetPendenceList: [],
    selected: {},
    pageSize: 0,
    orderLength: 0,
    noLimit: true,
    budgetDetail: false,
    userToken: null,
    userList: []
  }),

  created() {
    this.getOrderList();

    getUsers("ALL")
      .then(res => (this.userList = res.data))
      .catch(() => (this.userList = []));
  },

  methods: {
    ...mapActions("LoginStore", ["ADD_JWT", "ADD_STORE"]),

    getOrderList() {
      this.budgetList = [];
      this.budgetPendenceList = [];

      setTimeout(() => {
        this.loaderVisible = false;
      }, 500);
    },

    openDetails(order) {
      this.selected = order;
      this.budgetDetail = true;
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

    reloadList() {
      this.loaderVisible = true;
      this.budgetDetail = false;
      this.getOrderList();
    },

    getBorder(item) {
      if (item && item.situation === "PENDENTE") {
        return "border-right: solid #b51414 4px";
      } else if (item && item.situation === "FINALIZADO") {
        return "border-right: solid green 4px";
      }
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
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataEmpty() {
      return {
        icon: {
          name: "monetization_on",
          size: 55
        },
        title: "Nenhum orçamento pendente",
        subtitle: "Aguarde até que um usuário realize um orçamento"
      };
    },

    dataFinishedEmpty() {
      return {
        icon: {
          name: "monetization_on",
          size: 55
        },
        title: "Nenhum orçamento finalizado",
        subtitle: "Aguarde até que um usuário finalize um orçamento"
      };
    },

    progressList() {
      return groupBy(this.budgetPendenceList, "createdDate");
    },

    finishedList() {
      return groupBy(this.budgetList, "createdDate");
    }
  },

  props: {},

  components: {
    RotateSquare2,
    BaseEmpty,
    BudgetDetails
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
  font-size: 13.5px;
  text-transform: capitalize;
}

.v-tab {
  font-size: 12.5px !important;
}

.card-title {
  text-transform: uppercase;
  font-size: 16px;
  color: #333;
}

.card-subtitle {
  text-transform: capitalize;
  font-size: 13px;
  color: #606060 !important;
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
