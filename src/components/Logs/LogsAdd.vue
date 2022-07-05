<template>
  <div>
    <v-toolbar color="#304156" dark flat>
      <v-toolbar-title class="title-card"> Adicionar agenda </v-toolbar-title>
      <v-btn icon @click="close">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card flat class="pa-5">
      <v-form ref="form" v-model="validBasic">
        <v-row dense>
          <v-col cols="12" v-if="!client">
            <v-autocomplete
              :items="clientList"
              :loading="userLoaderVisible"
              color="#34495e"
              v-model="logForm.clientId"
              label="Cliente"
              item-text="name"
              item-value="id"
              outlined
              dense
              no-data-text="Nenhum dado encontrado"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-select
              :items="logTypeList"
              color="#34495e"
              v-model="logForm.logType"
              label="Tipo de agenda"
              outlined
              dense
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="logForm.title"
              :label="'Título da atividade'"
              :rules="[v => !!v || 'O Título é obrigatório']"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              color="#34495e"
              outlined
              v-model="logForm.description"
              label="Descrição da atividade"
              counter="300"
            ></v-textarea>
          </v-col>

          <v-col cols="12" md="6">
            <v-dialog
              ref="dialog"
              v-model="menuDate"
              :return-value.sync="logForm.returnDate"
              persistent
              width="290px"
              overlay-opacity="0.93"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFormatted"
                  label="Data de retorno  "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>

              <v-date-picker
                v-model="logForm.returnDate"
                scrollable
                locale="pt-Br"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menuDate = false">
                  Cancelar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(logForm.returnDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>

          <v-col cols="12" md="6">
            <v-menu
              ref="menuTime"
              v-model="menuTime"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="logForm.date"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="logForm.date"
                  label="Hora"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuTime"
                v-model="logForm.date"
                full-width
                @click:minute="$refs.menuTime.save(logForm.date)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>

      <div class="d-flex justify-end footer">
        <v-btn
          @click="nextStepSave()"
          :loading="loadingSave"
          :disabled="loadingSave"
          color="#41b883"
          class="btn-text"
          elevation="0"
        >
          <v-icon small class="mr-1">save</v-icon>
          Salvar
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { postLog, putLog } from "@/services/OrderService.js";
import { mapState } from "vuex";
import { getClientList } from "@/utils/functions.js";
import Component from "../Notification.vue";

export default {
  name: "LogAdd",
  data: vm => ({
    logTypeList: ["CONTATO", "VISITA", "VISITA TÉCNICA", "MANUTENÇÃO"],
    e1: 1,
    steps: 2,
    toggleInputType: false,
    clotheAdded: null,
    imageList: [],
    clientList: [],
    userLoaderVisible: true,
    validBasic: true,
    validData: true,
    loadingSave: false,
    isLoadingFile: false,
    finishLoad: false,
    cepSuccess: false,
    menuTime: false,

    logForm: {
      title: null,
      description: null,
      date: null,
      logType: null,
      returnDate: new Date().toISOString().substr(0, 10)
    },

    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menuDate: false
  }),

  created() {
    this.loadClientList();
    if (this.isEdit && this.logToEdit) {
      this.logForm = this.logToEdit;
    }
  },

  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: true
    },

    client: {
      type: Object,
      required: false
    },

    logToEdit: {
      type: Object,
      required: false
    },
    meta: {
      type: Array,
      required: false
    }
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },

    logForm: {
      handler: function(e) {
        this.dateFormatted = this.formatDate(e.returnDate);
      },
      deep: true,
      imediate: true
    }
  },

  components: {},

  computed: {
    ...mapState("LoginStore", ["storeUser"])
  },

  methods: {
    loadClientList() {
      this.clientList = getClientList();
      setTimeout(() => {
        this.userLoaderVisible = false;
      }, 500);
    },

    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },

    beforeStep(n) {
      if (n <= this.steps) {
        this.e1 = n - 1;
      } else {
        this.e1 = 1;
      }
    },

    nextStepSave() {
      this.loadingSave = true;
      this.logForm.requestToken = this.storeUser.requestToken;
      this.logForm.masterName = this.storeUser.masterName;

      if (this.logForm.logType === "CONTATO") {
        this.logForm.color = "#aeecae";
      } else if (this.logForm.logType === "MANUTENÇÃO") {
        this.logForm.color = "#ecaee2";
      } else {
        this.logForm.color = "#aeb7ec";
      }

      if (this.client) {
        this.logForm.clientId = this.client.id;
      }

      postLog(this.logForm)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="agenda adicionada."
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
              title="Erro ao cadastrar agenda"
              subtitle="Por favor revise os dados e tente novamente"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          this.loadingSave = false;
          this.$emit("reload-list");
        });
    },

    nextStepUpdate() {
      this.loadingSave = true;
      this.logForm.masterName = this.storeUser.masterName;

      putLog(this.logForm)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Agenda atualizada."
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .catch(() => {
          this.loadingSave = false;
          this.$toast.error(
            <Component
              title="Erro ao atualizar agenda"
              subtitle="Por favor revise os dados e tente novamente"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          this.loadingSave = false;
          this.$emit("reload-list");
        });
    },

    close() {
      this.$refs.form.reset();
      (this.logForm = {
        title: null,
        description: null,
        date: null,
        logType: null,
        returnDate: new Date().toISOString().substr(0, 10)
      }),
        this.$emit("close-modals");
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  margin-top: 20px;
}

.header {
  height: 90px;
  background-color: #f7f7f7;
  border-bottom: solid #eeeeee 1px;
}

.section-title {
  color: #34495e;
  font-weight: 200;
  margin-top: 20px;
}

.color-picker {
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  margin-top: 3px;
  cursor: pointer;
}

.btn-text {
  color: white;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20vh;
}

.v-stepper {
  box-shadow: none;
}

.title-section {
  font-weight: 600;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  font-size: 15.5px;
  text-transform: uppercase;
}

::v-deep .v-label {
  font-size: 95%;
}

fieldset {
  border: solid #f0f0f0 1px;
  padding: 10px;
  border-radius: 5px;
}

legend {
  font-weight: 600;
  text-transform: uppercase;
}
</style>
