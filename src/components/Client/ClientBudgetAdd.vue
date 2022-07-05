<template>
  <div style="overflow: auto; max-height: 80vh">
    <v-toolbar color="#304156" dark flat>
      <v-toolbar-title class="title-card"> Criar orçamento </v-toolbar-title>
      <v-btn icon @click="close">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-stepper v-model="e1" style="height: 100%; border-radius: 0">
      <v-stepper-header class="header">
        <v-stepper-step
          key="2-step"
          :complete="e1 > 1"
          :step="1"
          edit-icon="check"
          color="#34495e"
          :editable="isEdit"
        >
          Endereço de instalação
          <small class="mt-1">Endereço de instalação</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          key="4-step"
          :complete="e1 > 2"
          :step="2"
          edit-icon="check"
          color="#34495e"
          :editable="isEdit"
        >
          Informações de instalação
          <small class="mt-1">Informações de instalação</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          key="5-step"
          :complete="e1 > 3"
          :step="3"
          edit-icon="check"
          color="#34495e"
          :editable="isEdit"
        >
          Observações
          <small class="mt-1">Informações adicionais</small>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          key="6-step"
          :complete="e1 > 4"
          :step="4"
          edit-icon="check"
          color="#34495e"
          :editable="false"
        >
          Imagens
          <small class="mt-1">Imagens adicionais</small>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <v-card flat>
            <v-form ref="addressForm" style="height: 100%" v-model="validData">
              <v-row
                dense
                class="d-flex justify-center align-center"
                style="height: 100%"
              >
                <v-col cols="12">
                  <h4 class="title-section">Endereço de instalação</h4>
                </v-col>

                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        color="#34495e"
                        outlined
                        v-model="budgetForm.postalCode"
                        label="CEP"
                        v-mask="'#####-###'"
                        :rules="[(v) => !!v || '']"
                        @blur="getAddressByCep"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <loading
                    color="#34495e"
                    :width="64"
                    :height="64"
                    :active="finishLoad"
                    :can-cancel="true"
                    loader="spinner"
                    class="loading"
                    v-if="finishLoad"
                  ></loading>

                  <v-row dense v-if="!finishLoad">
                    <v-col cols="8" md="8" sm="8" xs="8">
                      <v-text-field
                        dense
                        color="#34495e"
                        outlined
                        v-model="budgetForm.address1"
                        label="Endereço"
                        :rules="[(v) => !!v || '']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="4" sm="4" xs="4">
                      <v-text-field
                        dense
                        color="#34495e"
                        outlined
                        v-model="budgetForm.address2"
                        type="number"
                        label="Número"
                        :rules="[(v) => !!v || '']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="12" sm="12" xs="12">
                      <v-text-field
                        dense
                        color="#34495e"
                        outlined
                        v-model="budgetForm.complement"
                        label="Complemento"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="8" md="8" sm="8" xs="8">
                      <v-text-field
                        dense
                        color="#34495e"
                        :disabled="cepSuccess"
                        outlined
                        v-model="budgetForm.city"
                        label="Cidade"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="4" sm="4" xs="4">
                      <v-text-field
                        dense
                        color="#34495e"
                        outlined
                        :disabled="cepSuccess"
                        v-model="budgetForm.state"
                        label="Estado"
                        :rules="[(v) => !!v || '']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <div class="d-flex justify-end footer">
            <v-btn
              color="#41b883"
              @click="nextStep(1)"
              :disabled="!validData"
              class="btn-text"
            >
              Continuar
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content :step="2">
          <v-card flat>
            <v-form
              ref="basicForm"
              style="height: 100%"
              v-model="instalationForm"
            >
              <v-row
                dense
                class="d-flex justify-center align-center"
                style="height: 100%"
              >
                <v-col cols="12">
                  <h4 class="title-section">Informações de instalação</h4>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="structureList"
                    color="#34495e"
                    v-model="budgetForm.structure"
                    label="Tipo de estrutura"
                    :rules="[(v) => !!v || '']"
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="voltageList"
                    color="#34495e"
                    v-model="budgetForm.voltage"
                    label="Tensão de alimentação"
                    :rules="[(v) => !!v || '']"
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="technologyList"
                    color="#34495e"
                    v-model="budgetForm.technology"
                    :rules="[(v) => !!v || '']"
                    label="Tipo de tecnologia"
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="classList"
                    color="#34495e"
                    v-model="budgetForm.classes"
                    :rules="[(v) => !!v || '']"
                    label="Classe"
                    outlined
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12" md="12" class="px-2 mb-2 d-flex">
                  <v-switch
                    v-model="budgetForm.financing"
                    label="Simular financiamento?"
                    hide-details
                    inset
                  ></v-switch>

                  <v-switch
                    v-model="isCNPJ"
                    label="Comercial"
                    class="ml-3"
                    hide-details
                    inset
                    v-if="budgetForm.financing"
                  ></v-switch>
                </v-col>

                <v-col cols="12" v-if="isCNPJ">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="budgetForm.financingCnpj"
                    label="CNPJ"
                    v-mask="'##.###.###/####-##'"
                    v-if="budgetForm.financing"
                    :rules="cnpjRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-else>
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="budgetForm.financingCpf"
                    v-mask="'###.###.###-##'"
                    label="CPF para simulação"
                    v-if="budgetForm.financing"
                    :rules="cpfRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="budgetForm.financing">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="budgetForm.birthDate"
                    v-mask="'##/##/####'"
                    label="Nascimento"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <div class="d-flex justify-end footer">
            <v-btn text @click="beforeStep(2)">Voltar</v-btn>
            <v-btn
              @click="nextStep(2)"
              color="#41b883"
              class="btn-text"
              :disabled="!instalationForm"
            >
              Continuar
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <v-card flat>
            <v-form ref="obsForm" style="height: 100%">
              <h4 class="title-section">Observações</h4>
              <v-row
                dense
                class="d-flex justify-center align-center"
                style="height: 100%"
              >
                <v-col cols="12" class="mt-5">
                  <v-textarea
                    color="#34495e"
                    outlined
                    v-model="budgetForm.observations"
                    label="Observações complementares"
                    counter="250"
                    :rules="obsRules"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <div class="d-flex justify-end footer">
            <v-btn text @click="beforeStep(3)">Voltar</v-btn>
            <v-btn
              color="#41b883"
              @click="nextStepSave"
              :loading="loadingSave"
              dark
            >
              Salvar
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content :step="4">
          <v-card flat>
            <v-form ref="form" style="height: 100%" v-if="savedBudget">
              <v-row
                dense
                class="d-flex justify-center align-center"
                style="height: 100%"
              >
                <v-col cols="12">
                  <base-upload
                    ref="baseUpload"
                    class="upload-container"
                    type="budget"
                    :savedBudgetId="savedBudget.id"
                    @change-loading-file="changeLoadingFile"
                  ></base-upload>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <div class="d-flex justify-end footer">
            <v-btn text @click="beforeStep(4)">Voltar</v-btn>
            <v-btn
              color="#41b883"
              :dark="!loadingFile"
              @click="$emit('reload-list')"
              :disabled="loadingFile"
              :loading="loadingSave"
            >
              Finalizar
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>


<script>
import {
  postBudget,
  putBudget,
  deleteProposal,
} from "@/services/OrderService.js";
import { getDataByCep } from "@/services/CustomerService.js";
import { mapState } from "vuex";
import { cpfCheck, cnpjCheck } from "@/utils/functions.js";
import Loading from "vue-loading-overlay";
import Component from "../Notification.vue";
import BaseUpload from "@/components/Shared/BaseUploadComponent";

export default {
  name: "ClientBudgetAdd",

  data: () => ({
    e1: 1,
    steps: 4,
    validData: true,
    instalationForm: true,
    loadingSave: false,
    finishLoad: false,
    cepSuccess: false,
    savedBudget: null,
    isCNPJ: false,
    obsRules: [
      (v) =>
        (v && v.length <= 250) ||
        "A observação deve ter menos do que 300 caracteres",
    ],

    budgetForm: {
      financing: false,
    },
    personTypeList: ["Física", "Jurídica"],
    technologyList: ["Convencional", "Micro Inversor", "SOLAR EDGE"],
    classList: ["Comercial", "Industrial", "Residencial", "Rural"],
    situationList: ["Maturação", "Perdida", "Prospecção", "Vendida"],
    structureList: [
      "Colonial Base Madeira",
      "Colonial Base Metálica",
      "Fibrocimento Base Madeira",
      "Fibrocimento Base Metálica",
      "Metálico Base Madeira",
      "Metálico Base Metálica",
      "Solo",
      "Laje",
      "Carport",
      "Calhetão Base Madeira",
      "Calhetão Base Metálica",
    ],
    voltageList: [
      "Monofasico -127 V",
      "Monofasico -220 V",
      "Bifasico - 220 V",
      "Bifasico - 380 V",
      "Trifasico - 220 V",
      "Trifasico - 380 V",
    ],
    cpfRules: [(v) => !v || cpfCheck(v) || "CPF inválido"],
    cnpjRules: [(v) => !v || cnpjCheck(v) || "CNPJ inválido"],
    loadingFile: false,
  }),

  created() {
    if (this.isEdit && this.dataToEdit) {
      this.budgetForm = this.dataToEdit;
    }

    if (this.client && this.client.cpf) {
      this.budgetForm.financingCpf = this.client.cpf;
    }

    if (this.client && this.client.cnpj) {
      this.budgetForm.financingCnpj = this.client.cnpj;
    }
  },

  props: {
    clientId: {
      type: Number,
      required: true,
    },

    client: {
      type: Object,
      required: true,
    },

    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },

    dataToEdit: {
      type: Object,
      required: false,
    },

    proposalToDelete: {
      type: Number,
      required: false,
    },
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
  },

  components: {
    BaseUpload,
    Loading,
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),
  },

  methods: {
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
      this.budgetForm.clientId = this.clientId;
      this.budgetForm.requestToken = this.storeUser.requestToken;
      this.budgetForm.masterName = this.storeUser.masterName;
      this.budgetForm.createdDate = new Date().toISOString().substr(0, 10);

      if (!this.isEdit && !this.savedBudget) {
        postBudget(this.budgetForm)
          .then((res) => {
            this.savedBudget = res.data;
            this.loadingSave = false;

            this.$toast.success(
              <Component
                title="Sucesso"
                subtitle="Orçamento adicionado."
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
            this.nextStep(3);
          })
          .catch(() => {
            this.$toast.error(
              <Component
                title="Erro ao cadastrar orçamento"
                subtitle="Por favor revise os dados e tente novamente"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
            this.loadingSave = false;
          });
      } else {
        if (this.savedBudget && this.savedBudget.id) {
          this.budgetForm.id = this.savedBudget.id;
        }

        if (this.budgetForm && this.budgetForm.id) {
          this.savedBudget = this.budgetForm;
        }

        this.budgetForm.masterName = this.storeUser.masterName;

        putBudget(this.budgetForm)
          .then(() => {
            this.loadingSave = false;
            if (this.isEdit && this.proposalToDelete) {
              deleteProposal(this.proposalToDelete).then(() => {
                this.$toast.success(
                  <Component
                    title="Sucesso"
                    subtitle="Orçamento editado. Aguarde até ele ser reavaliado"
                  ></Component>,
                  {
                    hideProgressBar: true,
                    timeout: 2000,
                  }
                );
              });
            } else {
              this.$toast.success(
                <Component
                  title="Sucesso"
                  subtitle="Orçamento editado."
                ></Component>,
                {
                  hideProgressBar: true,
                  timeout: 2000,
                }
              );
            }

            this.nextStep(3);
          })
          .catch(() => {
            this.$toast.error(
              <Component
                title="Erro ao atualizar orçamento"
                subtitle="Por favor revise os dados e tente novamente"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
            this.loadingSave = false;
          });
      }
    },

    close() {
      this.$refs.addressForm.reset();
      this.$refs.obsForm.reset();
      this.$refs.basicForm.reset();
      this.budgetForm = {};
      this.$emit("close-modals");
    },

    changeLoadingFile(event) {
      this.loadingFile = event;
    },

    getAddressByCep() {
      if (this.budgetForm.postalCode) {
        this.finishLoad = true;
        const form = this.budgetForm.postalCode.replace(/-/g, "");

        getDataByCep(form)
          .then((res) => {
            this.cepSuccess = true;

            this.budgetForm.state = res.data.uf;
            this.budgetForm.city = res.data.localidade;
            this.budgetForm.address1 = res.data.logradouro;

            setTimeout(() => {
              this.finishLoad = false;
            }, 500);
          })
          .catch(() => {
            this.finishLoad = false;
            this.cepSuccess = false;
          });
      }
    },
  },
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
  font-weight: 1000;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #333;
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
