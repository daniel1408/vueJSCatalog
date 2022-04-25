<template>
  <v-card flat style="border-radius: 0">
    <v-toolbar flat>
      <v-toolbar-title class="title-card">Análises gerais</v-toolbar-title>
      <v-spacer></v-spacer>
      <img src="@/assets/logo.png" alt="logo" width="140" />
    </v-toolbar>

    <v-divider></v-divider>

    <v-container fluid class="container">
      <v-row dense>
        <v-col cols="12" md="12" class="cards">
          <v-card
            class="mr-3"
            v-for="(item, index) in dashboard"
            :key="index"
            :color="item.color"
            @click="goToRouter(item.router)"
            :disabled="disableRouter(item)"
          >
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h4" style="color: #f1f1f1">
                  {{ item.label }}
                </v-list-item-title>
                <v-list-item-subtitle style="color: #f1f1f1">
                  {{ item.desc }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="text-h2" cols="6">
                  {{ item.value }}
                </v-col>
                <v-col cols="6">
                  <v-img src="@/assets/budget.png" width="92"></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="mb-10">
          <v-card>
            <canvas id="line-chart"></canvas>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="mb-10">
          <v-card>
            <canvas id="doughnut-chart"></canvas>
          </v-card>
        </v-col>

        <v-col cols="12" md="12" class="mt-2">
          <v-toolbar-title class="title-card mb-2">Clientes</v-toolbar-title>
          <v-card flat>
            <v-expansion-panels flat v-if="clientList && clientList.length">
              <v-expansion-panel
                v-for="user in clientList"
                :key="user.id"
                class="border-item"
              >
                <v-expansion-panel-header
                  class="user-title"
                  expand-icon="mdi-menu-down"
                  style="background: #f9f9f9"
                >
                  {{ user.name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content style="background: #f9f9f9">
                  <v-card flat class="mt-2" style="background: #f9f9f9">
                    <span class="details">CPF:</span>
                    <span class="details-result">
                      {{ user.cpf || "Não consta" }}</span
                    ><br />
                    <span class="details">Nome:</span>
                    <span class="details-result"> {{ user.name }}</span
                    ><br />
                    <span class="details">Phone:</span>
                    <span class="details-result">
                      {{ user.firstPhoneNumber }}
                    </span>

                    <span class="details-result" v-if="user.secondPhoneNumber">
                      /
                    </span>

                    <span class="details-result">
                      {{ user.secondPhoneNumber }}
                    </span>

                    <br />
                    <span class="details">E-mail:</span>
                    <span class="details-result"> {{ user.email }}</span
                    ><br />
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels flat v-else>
              <v-expansion-panel class="border-item" disabled>
                <v-expansion-panel-header
                  class="user-title"
                  expand-icon="mdi-menu-down"
                  style="background: #f9f9f9"
                >
                  Nenhum cliente cadastrado
                </v-expansion-panel-header>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import Chart from "chart.js";
import doughnutChartData from "./doughnutChart.js";
import lineChartData from "./barChart";
import { mapState } from "vuex";
import { getClientList } from "@/utils/functions.js";

export default {
  data() {
    return {
      labels: ["SU", "MO", "TU", "WED", "TH", "FR", "SA"],
      time: 0,
      textSnack: "",
      doughnutChartData: doughnutChartData,
      lineChartData: lineChartData,
      userToken: null,
      dashboard: [
        {
          value: 0,
          label: "Clientes",
          color: "#37577d",
          desc: "Todos cadastrados",
          image: "logo",
          router: "client"
        },
        {
          value: 0,
          label: "Propostas",
          color: "#8e5ea2",
          desc: "Aceitas e rejeitadas",
          image: "proposal",
          router: "proposal"
        },
        {
          value: 0,
          label: "Orçamentos",
          color: "#4CAF50",
          desc: "Analisadas e pendentes",
          image: "https://image.flaticon.com/icons/png/512/2228/2228779.png",
          router: "budget"
        },
        {
          value: 0,
          label: "Agendas",
          color: "#DD9621",
          desc: "Seus próximos compomissos",
          image: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
          router: "logs"
        }
      ],
      clientList: [],
      installationList: [],

      doughnutDataSet: {
        labels: ["Com pendências", "Aprovadas"],
        datasets: [
          {
            label: "Suas propostas",
            backgroundColor: ["#8e5ea2", "#4CAF50"],
            data: []
          }
        ]
      },

      lineDataSet: {
        labels: ["Pendentes", "Já analisados"],
        datasets: [
          {
            label: "Seus orçamentos em processo",
            backgroundColor: ["#37577d", "#DD9621"],
            data: []
          }
        ]
      }
    };
  },

  mounted() {
    this.loadValues();
  },

  methods: {
    back() {
      this.$router.replace("home");
    },

    createDoughnutChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: this.doughnutDataSet,
        options: chartData.options
      });
      myChart && myChart.update();
    },

    createLineChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: this.lineDataSet,
        options: chartData.options
      });
      myChart && myChart.update();
    },

    loadValues() {
      this.dashboard[0].value = 12;
      this.clientList = getClientList();

      this.dashboard[1].value = 12;
      this.doughnutDataSet.datasets[0].data = [5, 7];
      this.createDoughnutChart("doughnut-chart", this.doughnutChartData);

      this.dashboard[2].value = 12;
      this.lineDataSet.datasets[0].data = [5, 7];
      this.createLineChart("line-chart", this.lineChartData);

      this.dashboard[3].value = 10;
    },

    goToRouter(router) {
      this.$emit("change-router", router);
    },

    disableRouter(item) {
      // eslint-disable-next-line no-console
      console.log('item: ', item);
      return false;
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataAdd() {
      return {
        icon: {
          name: "add",
          size: 55
        },
        title: "Adicionar",
        subtitle: ""
      };
    }
  },

  props: {},

  components: {
    // Loading,
  }
};
</script>

<style scoped>
.back-menu-btn {
  z-index: 1010;
  position: absolute;
  bottom: 1.8em;
  right: 6em;
}

.card-desc {
  font-weight: 100;
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card {
  /* border: solid #a3a3a3 1px; */
  height: 80px;
  border-radius: 10px;
  display: flex;
  -webkit-box-shadow: -3px 10px 6px -9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -3px 10px 6px -9px rgba(0, 0, 0, 0.75);
  box-shadow: -3px 10px 6px -9px rgba(0, 0, 0, 0.75);
}

.price {
  font-size: 40px;
  color: #34495e;
}

::v-deep .v-overlay__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

::v-deep .v-toolbar__content {
  height: 40px;
}

h2 {
  font-size: 20px;
  color: rgb(51, 51, 51);
}

.user-title {
  font-weight: 400;
  text-transform: capitalize;
  color: #333;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-result {
  font-size: 14px;
  color: #424242;
}

.border-item {
  border: solid #e0e0e0 1px;
}

.text-h2 {
  color: #fff;
  font-weight: 400;
}

.container {
  overflow: auto;
  max-height: calc(100vh - 65px);
  border-radius: 0;
  padding: 0 100px;
}

.cards {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 60px;
}
</style>
