<template>
  <v-card flat class="content-width">
    <v-toolbar flat>
      <v-toolbar-title class="title-card">Agenda do mês</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="addLog(null)" color="#41b883" elevation="0" small dark>
        <v-icon class="mr-2" small>add</v-icon> Adicionar agenda para um cliente
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card class="mx-auto" flat>
      <v-container fluid class="pa-1">
        <div class="loading" v-if="loaderVisible">
          <rotate-square2 size="64px"></rotate-square2>
        </div>

        <v-row dense v-if="!loaderVisible" class="pa-5 pt-0">
          <base-empty
            :data="dataEmpty"
            style="height: 70vh; width: 100%"
            v-if="false"
          ></base-empty>

          <v-col cols="12" v-else>
            <v-sheet tile height="54" class="d-flex my-5">
              <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                <v-icon>arrow_left</v-icon>
              </v-btn>
              <v-select
                v-model="type"
                :items="types"
                dense
                outlined
                hide-details
                class="ma-2"
                placeholder="type"
              ></v-select>
              <v-select
                v-model="mode"
                :items="modes"
                dense
                outlined
                hide-details
                placeholder="event-overlap-mode"
                class="ma-2"
              ></v-select>
              <v-select
                v-model="weekday"
                :items="weekdays"
                dense
                outlined
                hide-details
                placeholder="weekdays"
                class="ma-2"
              ></v-select>

              <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                <v-icon>arrow_right</v-icon>
              </v-btn>
            </v-sheet>

            <v-sheet height="700">
              <!-- <v-calendar
                ref="calendar"
                :weekdays="weekday"
                :now="today"
                :value="today"
                :events="logList"
                :event-overlap-threshold="30"
                :event-margin-bottom="5"
                event-overlap-mode="stack"
                color="#cecece"
                type="month"
                locale="pt-BR"
                event-text-color="#000"
                event-name="title"
                event-start="returnDate"
                @click:event="showEvent"
              ></v-calendar> -->

              <v-calendar
                ref="calendar"
                v-model="value"
                :weekdays="weekday"
                :type="type"
                :events="events"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
                :event-color="getEventColor"
                @change="getEvents"
                locale="pt-BR"
                :now="today"
                :value="today"
              ></v-calendar>

              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :position-x="positionX"
                :position-y="positionY"
                offset-x
                max-width="500"
              >
                <v-card color="grey lighten-4" min-width="380px" flat>
                  <v-toolbar :color="selectedEvent.color" dark elevation="1">
                    <v-toolbar-title style="color: #000">
                      <span class="date-span">
                        {{ selectedEvent.date }}
                      </span>
                      {{ selectedEvent.title }}
                    </v-toolbar-title>

                    <v-spacer></v-spacer>
                    <v-btn icon @click="selectedOpen = false" color="#333">
                      <v-icon small>close</v-icon>
                    </v-btn>
                  </v-toolbar>

                  <div class="mt-2 mx-4 mb-2">
                    <h3 v-html="seletedUser.name"></h3>

                    <span
                      class="details-result"
                      v-html="seletedUser.firstPhoneNumber"
                    >
                    </span>
                    <br />
                    <span class="details-result" v-html="seletedUser.email">
                    </span>
                  </div>

                  <v-divider></v-divider>

                  <h3
                    style="font-size: 18px; font-weight: 500"
                    v-html="selectedEvent.title"
                    class="pb-0 mt-2 mx-4"
                  ></h3>

                  <v-card-text class="mt-0 py-0">
                    <span style="font-weight: bold"> Descrição: </span>
                    <span
                      class="details-result"
                      v-html="selectedEvent.description"
                    ></span>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-menu
                      v-model="deleteMenu"
                      :close-on-content-click="false"
                      max-width="400"
                      offset-y
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          text
                          color="#b51414"
                          :loading="loadingDelete"
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
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
                            `Todos os dados desse log serão perdidos. Deseja continuar com a deleção?`
                          }}
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text small @click="deleteMenu = false">
                            Cancelar
                          </v-btn>
                          <v-btn
                            small
                            text
                            @click="deleteUs(selectedEvent)"
                            color="#b51414"
                          >
                            Confirmar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
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
      <log-add
        :logToEdit="logSelected"
        :client="null"
        :isEdit="isEdit"
        @close-modals="closeModals"
        @reload-list="reloadList"
      ></log-add>
    </v-dialog>
  </v-card>
</template>

<script>
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import Component from "../Notification.vue";
import LogAdd from "./LogsAdd";

import { RotateSquare2 } from "vue-loading-spinner";
import { mapState } from "vuex";
import { deleteLog } from "@/services/OrderService.js";
import { getClientList } from "@/utils/functions.js";

export default {
  data: () => ({
    textSnack: "",
    loaderVisible: true,
    deleteMenu: false,
    overlay: false,
    logList: [],
    selectedLog: {},
    selectedLogMeta: [],
    selectedLogMedia: {},
    showCloseBtn: true,
    isSavingImage: false,
    modalAdd: false,
    isEdit: false,
    logSelected: {},
    viewList: false,
    today: new Date().toISOString().substr(0, 10),
    selectedOpen: false,
    selectedEvent: {},
    positionX: null,
    positionY: null,
    loadingDelete: false,
    clientList: [],

    type: "month",
    types: ["month", "week", "day", "4day"],
    mode: "stack",
    modes: ["stack", "column"],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
      { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
      { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { text: "Mon, Wed, Fri", value: [1, 3, 5] }
    ],
    value: "",
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ]
  }),

  created() {
    this.loadClientList();
    this.loadLogList();
  },

  methods: {
    getEvents({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        });
      }

      this.events = events;
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    loadLogList() {
      setTimeout(() => {
        this.loaderVisible = false;
      }, 500);
    },

    loadClientList() {
      this.clientList = getClientList();
    },

    back() {
      this.$router.replace("home");
    },

    addLog(log) {
      this.logSelected = log;
      this.isEdit = log ? true : false;
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
      this.loadLogList();
    },

    deleteUs(log) {
      this.loadingDelete = true;

      deleteLog(log.id)
        .then(() => {
          this.loadLogList();
          this.$toast.success(
            <Component
              title="Sucesso!"
              subtitle="Agenda deletada com sucesso"
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
              title="Erro ao deletar a agenda"
              subtitle={"Tente novamente"}
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          this.loadingDelete = false;
          this.selectedOpen = false;
        });
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

    showEvent({ nativeEvent, event }) {
      this.positionX = nativeEvent.clientX;
      this.positionY = nativeEvent.clientY;
      this.selectedEvent = event;
      nativeEvent.stopPropagation();
      this.selectedOpen = true;
    }
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),
    dataEmpty() {
      return {
        icon: {
          name: "date_range",
          size: 55
        },
        title: "Nenhuma agenda próxima",
        subtitle: "Adicione um log que ele será listado aqui"
      };
    },

    seletedUser() {
      if (
        this.clientList &&
        this.clientList.length &&
        this.selectedEvent &&
        this.selectedEvent.clientId
      ) {
        return this.clientList.find(x => x.id === this.selectedEvent.clientId);
      } else {
        return {};
      }
    }
  },

  props: {},

  components: {
    // Loading,
    BaseEmpty,
    LogAdd,
    RotateSquare2
  }
};
</script>

<style scoped>
.loading {
  height: calc(100vh - 70px);
  justify-content: center;
  align-items: center;
  display: flex;
}

.log-title {
  font-weight: 500;
  text-transform: uppercase;
  color: #333;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
  margin-right: 20px;
}

.tag-date {
  background: #f5f5f5;
  color: #c51a1a;
  font-size: 11.5px;
  padding: 2px 8px;
  border-radius: 5px;
  text-transform: capitalize;
}

.log-subtitle {
  color: #808080;
  font-size: 13.5px;
  font-weight: 300;
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
  color: #333;
  font-weight: 300;
}

.log-type {
  font-weight: 400;
  font-size: 14px;
  margin-top: 1px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.elipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 350px;
}

.date-span {
  font-weight: 800;
  font-size: 14px;
  margin-right: 6px;
}
</style>
