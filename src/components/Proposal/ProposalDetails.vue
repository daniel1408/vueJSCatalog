<template>
  <v-row class="background ma-0 pa-0" style="border-radius: 5px">
    <v-tabs
      active-class="active-tab"
      slider-color="#da7c02"
      v-model="tab"
      centered
      style="margin: 0; overflow: auto; height: 65vh"
      background-color="#f5f5f5"
      color="#41b883"
      :icons-and-text="true"
      :grow="true"
    >
      <v-tab :href="`#tab-1`">Dados gerais</v-tab>
      <v-tab :href="`#tab-2`">Arquivos</v-tab>
      <v-tab :href="`#tab-3`">Adicionais</v-tab>

      <v-tab-item :value="'tab-1'">
        <v-col cols="12" class="ma-2 mt-4">
          <span class="details" v-if="selectedProposal.budget.cnpj">
            <br />CNPJ:
          </span>
          <span class="details-result">
            {{ selectedProposal.budget.cnpj }}
          </span>
          <br v-if="selectedProposal.budget.cnpj" />
          <span class="details" v-if="selectedProposal.budget.cpf">CPF:</span>
          <span class="details-result">
            {{ selectedProposal.budget.cpf }}
          </span>
          <br v-if="selectedProposal.budget.cpf" />

          <span class="details">Client:</span>
          <span class="details-result">
            {{ selectedProposal.client.name }} </span
          ><br />
          <span class="details">CEP:</span>
          <span class="details-result">
            {{ selectedProposal.budget.postalCode }}
          </span>
          <br />
          <span class="details">Endereço:</span>
          <span class="details-result">
            {{ selectedProposal.budget.address1 }} -
            {{ selectedProposal.budget.address2 }}
            {{ selectedProposal.budget.complement }}
          </span>
          <br />
          <span class="details">Cidade:</span>
          <span class="details-result">
            {{ selectedProposal.budget.city }} /
            {{ selectedProposal.budget.state }} </span
          ><br />

          <span class="details">Estrutura:</span>
          <span class="details-result">
            {{ selectedProposal.budget.structure }} </span
          ><br />
          <span class="details">Tecnologia:</span>
          <span class="details-result">
            {{ selectedProposal.budget.technology }} </span
          ><br />
          <span class="details">Observação:</span>
          <span class="details-result">
            {{ selectedProposal.budget.observations }} </span
          ><br />

          <v-col cols="12" class="pl-0 mt-5">
            <v-text-field
              disabled
              filled
              dense
              color="#34495e"
              v-model="selectedProposal.proposalNumber"
              label="NÚMERO DA PROPOSTA"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="pl-0">
            <v-text-field
              disabled
              filled
              dense
              color="#34495e"
              v-model="selectedProposal.situation"
              hide-details
              label="Condição da proposta"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            class="pl-0"
            v-if="selectedProposal.situation === 'PENDENTE'"
          >
            <v-textarea
              label="Descrição da pendência"
              v-model="selectedProposal.pendenceDetail"
              hide-details
              disabled
              filled
              height="100"
            ></v-textarea>
          </v-col>
        </v-col>
      </v-tab-item>

      <v-tab-item :value="'tab-2'">
        <div class="mt-4" style="text-align: center">
          <span class="title-card"> Do cliente </span>
        </div>

        <v-col cols="12" class="ma-2 mt-0" v-if="imageList.length">
          <v-img
            v-for="(item, index) in imageList"
            :key="index"
            :src="
              checkIsImage(item)
                ? item
                : 'https://cdn-icons-png.flaticon.com/512/534/534074.png'
            "
            :lazy-src="
              checkIsImage(item)
                ? item
                : 'https://cdn-icons-png.flaticon.com/512/534/534074.png'
            "
            position="top center"
            class="image-behind"
          ></v-img>
        </v-col>

        <v-col v-else>
          <base-empty
            :data="dataEmpty"
            style="width: 100%; height: 20vh"
          ></base-empty>
        </v-col>

        <div class="mt-4" style="text-align: center">
          <span class="title-card"> Do orçamentista </span>
        </div>

        <v-col cols="12" class="ma-2 mt-4" v-if="imageProposalList.length">
          <v-card
            v-for="(item, index) in imageProposalList"
            :key="index"
            @click="openUrl(item)"
            class="image-item mt-1"
            elevation="2"
            color="#F9F9F9"
          >
            <v-avatar class="ma-3 card-image" size="50" tile>
              <v-img
                src="https://image.flaticon.com/icons/png/512/136/136522.png"
                class="mr-3"
              ></v-img>
            </v-avatar>

            <div>
              <span style="color: #505050; font-weight: 300; font-size: 15px">
                {{ item }}
              </span>
            </div>
          </v-card>
        </v-col>

        <v-col v-else>
          <base-empty
            :data="dataEmptyBudget"
            style="width: 100%; height: 20vh"
          ></base-empty>
        </v-col>
      </v-tab-item>

      <v-tab-item :value="'tab-3'">
        <v-col cols="12" class="ma-2 mt-4">
          <v-text-field
            disabled
            filled
            dense
            color="#34495e"
            :value="currencyFormat(selectedProposal.value)"
            label="Valor da proposta"
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="DATA DA PROPOSTA"
            v-model="selectedProposal.inverterBrand"
            color="#34495e"
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="VALIDADE DA PROPOSTA - DIAS ÚTEIS"
            v-model="selectedProposal.supplierName"
            color="#34495e"
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="POTÊNCIA  DO SISTEMA EM KWP"
            v-model="selectedProposal.systemPower"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="CONSUMO CONSIDERADO EM KWH"
            v-model="selectedProposal.consideredConsumption"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="GERAÇÃO EM KWH"
            v-model="selectedProposal.typeOfModules"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="VALOR DA CONTA ATUAL"
            :value="currencyFormat(selectedProposal.newAccountValue)"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="VALOR DA NOVA CONTA"
            :value="currencyFormat(selectedProposal.kitValue)"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="QUANTIDADE DE MÓDULOS"
            v-model="selectedProposal.quantityModules"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="MÓDULOS"
            v-model="selectedProposal.brandOfModules"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="QUANT. INVERSOR 1"
            v-model="selectedProposal.quantityInverter1"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="INVERSOR 1"
            v-model="selectedProposal.inverterType1"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="QUANT. INVERSOR 2"
            v-model="selectedProposal.quantityInverter2"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="INVERSOR 2"
            v-model="selectedProposal.inverterType2"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="ÁREA NECESSÁRIA EM M²"
            v-model="selectedProposal.requiredArea"
            color="#34495e"
            dense
            suffix="m²"
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="MODALIDADE"
            v-model="selectedProposal.modality"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            label="MARGEM DE LUCRO LÍQUIDO"
            :value="currencyFormat(selectedProposal.typeOfPlant)"
            color="#34495e"
            dense
          ></v-text-field>

          <v-text-field
            disabled
            filled
            dense
            color="#34495e"
            :value="currencyFormat(selectedProposal.laborValue)"
            label="VALOR DA COMISSÃO"
          ></v-text-field>

          <v-text-field
            disabled
            filled
            dense
            color="#34495e"
            v-model="selectedProposal.commissionValue"
            label="SITUAÇÃO"
          ></v-text-field>

          <v-text-field
            label="DATA DE FECHAMENTO"
            v-model="selectedProposal.closeDate"
            color="#34495e"
            disabled
            filled
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <v-text-field
            label="DATA DE HOMOLOGAÇÃO"
            v-model="selectedProposal.homologDate"
            color="#34495e"
            disabled
            filled
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <v-text-field
            label="MOTIVO DA PERDA"
            v-model="selectedProposal.losteMotive"
            color="#34495e"
            disabled
            filled
            dense
          ></v-text-field>
        </v-col>
      </v-tab-item>
    </v-tabs>

    <v-col cols="12" class="d-flex justify-center footer">
      <v-btn
        text
        small
        class="mt-2 mr-2 btn-option"
        @click="editProposal"
        v-if="
          selectedProposal.situation === 'PENDENTE' &&
          storeUser.userType === 'VENDEDOR'
        "
      >
        Editar
      </v-btn>

      <v-menu
        v-model="deleteMenu"
        :close-on-content-click="false"
        max-width="400"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mt-2"
            small
            color="#b51414"
            dark
            elevation="0"
            v-bind="attrs"
            v-on="on"
            v-if="
              storeUser.userType !== 'VENDEDOR' &&
              storeUser.userType !== 'ORCAMENTISTA'
            "
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
              `Todos os dados desta proposta serão perdidos. Deseja continuar com a deleção?`
            }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text small @click="deleteMenu = false"> Cancelar </v-btn>
            <v-btn small text @click="deleteProposal" color="#b51414">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-col>

    <v-dialog
      v-model="modalAdd"
      transition="dialog-bottom-transition"
      overlay-opacity="0.93"
      persistent
    >
      <client-budget-add
        :clientId="clientId"
        :client="selectedClient"
        @close-modals="modalAdd = false"
        @reload-list="$emit('reload-list')"
        :isEdit="true"
        :dataToEdit="dataToEdit"
        :proposalToDelete="selectedProposal.id"
      ></client-budget-add>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import Component from "../Notification.vue";
import firebase from "firebase";
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import ClientBudgetAdd from "../Client/ClientBudgetAdd.vue";
import { deleteProposal } from "@/services/OrderService.js";

const masterList = {
  UBERLANDIA: "Uberlândia",
  BRASILIA: "Brasília",
  FRANCA: "Franca",
  PASSOS: "Passos",
};

const personList = {
  FISICA: "Física",
  JURIDICA: "Jurídica",
};

const translate = {
  inverterBrand: "Data da proposta",
  supplierName: "Validade da proposta - Dias úteis",
  systemPower: "Potência do sistema em kWp",
  consideredConsumption: "Consumo considerado em kWh",
  typeOfModules: "Geração em kWh",
  newAccountValue: "Valor da conta atual",
  kitValue: "Valor da nova conta",
  quantityModules: "Quantidade de módulos",
  brandOfModules: "Módulos",
  quantityInverter1: "Quant. inversor 1",
  inverterType1: "Inversor 1",
  quantityInverter2: "Quant. inversor 2",
  inverterType2: "Inversor 2",
  requiredArea: "Área necessária em m²",
  modality: "Modalidade",
  typeOfPlant: "Margem de lucro líquido",
  laborValue: "Valor da comissão",
  commissionValue: "Situação",
  averageAccountValue: "Data de fechamento",

  // Outros campos
  proposalNumber: "Nº da proposta",
  situation: "Condição da proposta",
  updateDate: "Última atualização",
  value: "Valor",
  pendenceDetail: "Detalhes da pendência",
  observation: "Observação",
  structure: "Estrutura",
  technology: "Tecnologia",
  classes: "Classe",
  financing: "Terá financiamento?",
  voltage: "Voltagem",
  fileList: "fileList",
  createdDate: "Data de criação",
  observations: "Observações",
  postalCode: "CEP",
  address1: "Endereço",
  address2: "Número",
  city: "Cidade",
  state: "Estado",
  clientId: "ID do Cliente",
  financingCnpj: "CNPJ do financiamento",
  financingCpf: "CPF do financiamento",
  birthDate: "Data de nascimento",
  requestToken: "Franqueado",
  personType: "Tipo de pessoa",
  cnpj: "CNPJ",
  cpf: "CPF",
  name: "Nome",
  fantasyName: "Nome fantasia",
  firstPhoneNumber: "Celular",
  secondPhoneNumber: "Celular 2",
  email: "E-mail",
  complement: "Complemento",
  contactName: "Nome do contato",
  masterName: "Master",
  id: "Nº do orçamento",
};

export default {
  data: () => ({
    emailRules: [
      (v) => !!v || "E-mail é obrigatório",
      (v) => /.+@.+/.test(v) || "E-mail deve ser válido",
    ],

    isReq1: false,
    isReq2: false,
    isReq3: false,
    isReq4: false,
    positionX: null,
    positionY: null,
    menuTrackCode: false,
    trackCode: "",
    emailToSend: "",
    imageList: [],
    imageProposalList: [],
    tab: 0,
    todos: [],
    budget: [],
    client: [],
    modalAdd: false,
    selectedClient: {},
    clientId: 0,
    dataToEdit: {},
    deleteMenu: false,
  }),

  created() {
    this.listFiles();
    this.listProposalFiles();

    const self = this;

    Object.keys(this.selectedProposal).forEach(function (item) {
      if (
        item !== "client" &&
        item !== "budget" &&
        item !== "id" &&
        item !== "budgetId" &&
        item !== "requestToken" &&
        item !== "masterName"
      ) {
        if (self.selectedProposal[item]) {
          if (item === "value" || item === "laborValue") {
            self.todos.push({
              title: translate[item],
              description: `R$ ${self.selectedProposal[item]}`,
            });
          } else {
            self.todos.push({
              title: translate[item],
              description: self.selectedProposal[item],
            });
          }
        } else {
          self.todos.push({
            title: translate[item],
            description: "Não consta",
            columnWidth: 60,
          });
        }
      }
    });

    Object.keys(this.selectedProposal.budget).forEach(function (item) {
      if (item !== "fileList") {
        if (self.selectedProposal.budget[item]) {
          if (
            item !== "masterName" &&
            item !== "createdDate" &&
            item !== "requestToken"
          ) {
            self.budget.push({
              title: translate[item],
              description: self.selectedProposal.budget[item],
            });
          } else if (item === "createdDate") {
            self.budget.push({
              title: translate[item],
              description: self.formatDate(self.selectedProposal.budget[item]),
            });
          } else if (item === "masterName") {
            self.budget.push({
              title: translate[item],
              description: masterList[self.selectedProposal.budget[item]],
            });
          } else {
            self.budget.push({
              title: translate[item],
              description: self.getConsulor(self.selectedProposal.budget[item]),
            });
          }
        } else {
          self.budget.push({
            title: translate[item],
            description: "Não consta",
            columnWidth: 60,
          });
        }
      }
    });

    Object.keys(this.selectedProposal.client).forEach(function (item) {
      if (item !== "id" && item !== "requestToken") {
        if (self.selectedProposal.client[item]) {
          if (item !== "personType") {
            self.client.push({
              title: translate[item],
              description: self.selectedProposal.client[item],
            });
          } else {
            self.client.push({
              title: translate[item],
              description: personList[self.selectedProposal.client[item]],
            });
          }
        } else {
          self.client.push({
            title: translate[item],
            description: "Não consta",
            columnWidth: 60,
          });
        }
      }
    });

    this.selectedProposal &&
      this.selectedProposal.email &&
      (this.emailToSend = this.selectedProposal.email);
  },

  methods: {
    confirmClotheSent() {
      this.$toast.success(
        <Component title="Sucesso" subtitle="Pedido foi enviado."></Component>,
        { hideProgressBar: true, timeout: 2000 }
      );
    },

    getConsulor(requestToken) {
      const user = this.userList.find((x) => x.requestToken === requestToken);
      return user ? user.name : "Não consta";
    },

    formatDate(date) {
      let options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      if (date) {
        let dt = new Date(date);
        let formattedDate = new Date(
          dt.getTime() + Math.abs(dt.getTimezoneOffset() * 60000)
        );
        return `${formattedDate.toLocaleDateString("pt-BR", options)}`;
      } else {
        return "Não consta";
      }
    },

    deleteProposal() {
      deleteProposal(this.selectedProposal.id)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Proposta deletada com sucesso."
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        })
        .catch(() => {
          this.$toast.error(
            <Component
              title="Erro ao deletar"
              subtitle="Infelizmente não é possível deletar esta proposta"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        })
        .finally(() => {
          this.$emit("reload-list");
        });
    },

    listFiles() {
      var storageRef = firebase
        .storage()
        .ref(`budget-${this.selectedProposal.budget.id}/`);

      storageRef.listAll().then(function (result) {
        result.items.forEach(function (imageRef) {
          displayImage(imageRef);
        });
      });

      const self = this;
      function displayImage(imageRef) {
        imageRef.getDownloadURL().then(function (url) {
          self.imageList.push(url);
        });
      }
    },

    listProposalFiles() {
      var storageRef = firebase
        .storage()
        .ref(`proposal-${this.selectedProposal.id}/`);

      storageRef.listAll().then(function (result) {
        result.items.forEach(function (imageRef) {
          displayImage(imageRef);
        });
      });

      const self = this;
      function displayImage(imageRef) {
        imageRef.getDownloadURL().then(function (url) {
          self.imageProposalList.push(url);
        });
      }
    },

    checkIsImage(item) {
      return (
        item.includes("jpg") ||
        item.includes("jpeg") ||
        item.includes("png") ||
        item.includes("gif")
      );
    },

    editProposal() {
      this.selectedClient = this.selectedProposal.client;
      this.clientId = this.selectedProposal.client.id;
      this.dataToEdit = this.selectedProposal.budget;
      this.modalAdd = true;
    },

    openUrl(item) {
      window.open(item);
    },

    reloadList() {
      this.modalAdd = false;
    },

    currencyFormat(val) {
      return val && val !== "0"
        ? val.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
        : "R$ 0,00";
    },
  },

  components: {
    BaseEmpty,
    ClientBudgetAdd,
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    dataEmpty() {
      return {
        icon: {
          name: "image",
          size: 40,
        },
        title: "Nenhum arquivo",
        subtitle: "Não há nenhum arquivo de cliente",
      };
    },

    dataEmptyBudget() {
      return {
        icon: {
          name: "image",
          size: 40,
        },
        title: "Nenhum arquivo",
        subtitle: "Não há nenhum arquivo de orçamentista",
      };
    },
  },

  props: {
    selectedProposal: {
      type: Object,
      required: true,
      default: () => {},
    },

    userList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>


<style scoped>
.details {
  font-weight: 500;
}

.background {
  background: #fff;
  padding: 10px;
}

::v-deep .v-label {
  font-size: 95%;
}

.details-result {
  font-size: 14px;
  color: rgb(66, 66, 66);
}

.image-behind {
  width: 250px;
  height: 250px;
  margin-right: 6px;
  border-radius: 5px;
  display: inline-flex;
}

.active-tab {
  background-color: #f3f3f3;
  color: #41b883;
  font-weight: 400 !important;
  border-radius: 10px;
}

.v-tab {
  font-size: 12.5px !important;
}

::v-deep .v-tabs-bar {
  border-top-right-radius: 0px !important;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer {
  background: #f0f0f0;
  padding-top: 8px;
  padding-bottom: 12px;
}
</style>
