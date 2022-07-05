<template>
  <v-row class="background ma-0" style="overflow: auto; max-height: 80vh">
    <v-col cols="12" class="mt-2">
      <span class="details" v-if="client.cnpj">CNPJ:</span>
      <span class="details-result">
        {{ client.cnpj }}
        <br v-if="client.cnpj" />
      </span>
      <span class="details" v-if="client.cpf">CPF:</span>
      <span class="details-result">
        {{ client.cpf }}
        <br v-if="client.cpf" />
      </span>
      <span class="details">Contato:</span>
      <span class="details-result"> {{ client.firstPhoneNumber }}</span>
      <span v-if="client.secondPhoneNumber"> /</span>
      <span class="details-result"> {{ client.secondPhoneNumber }}</span>

      <br v-if="client.contactName" />
      <span class="details" v-if="client.contactName">Falar com:</span>
      <span class="details-result" v-if="client.contactName">
        {{ client.contactName }}
      </span>

      <br />
      <span class="details">E-mail:</span
      ><span class="details-result">
        {{ client.email ? client.email : "Não consta" }}</span
      >

      <br />
      <span class="details">Endereço:</span
      ><span class="details-result">
        {{ client.address1 }}, {{ client.address2 }} {{ client.complement }}
      </span>
      -
      <span class="details-result">{{ client.city }}/{{ client.state }}</span>

      <v-expansion-panels class="pa-0 ma-0 mt-4">
        <v-expansion-panel
          v-for="(budget, index) in client.budgetResponseDTOList"
          :key="budget.id"
        >
          <v-expansion-panel-header expand-icon="mdi-menu-down" class="px-6">
            <div>
              <div>
                <span class="client-title" style="font-weight: 500">
                  Orçamento:
                </span>
                <span class="client-title"> {{ index + 1 }}</span>
              </div>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <span class="details">CEP: </span>
            <span class="details-result">{{ budget.postalCode }} </span><br />
            <span class="details">Endereço: </span>
            <span class="details-result">
              {{ budget.address1 }} - {{ budget.address2 }}
              {{ budget.complement }}<br />
              <span class="details">Cidade:</span> {{ budget.city }} /
              {{ budget.state }} </span
            ><br />
            <span class="details">Estrutura: </span>
            <span class="details-result">{{ budget.structure }}</span
            ><br />
            <span class="details">Tecnologia: </span>
            <span class="details-result">{{ budget.technology }}</span
            ><br />
            <span class="details">Observações: </span>
            <span class="details-result">{{ budget.observations }} </span><br />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>

    <v-col cols="12">
      <v-btn
        small
        block
        text
        class="mt-2 btn-option"
        @click="addBudget(client)"
      >
        Criar orçamento
      </v-btn>
      <v-btn
        small
        block
        text
        class="mt-2 btn-option"
        @click="$emit('add-log', client)"
        elevation="0"
      >
        Adicionar agenda
      </v-btn>

      <v-divider></v-divider>

      <v-btn
        small
        block
        text
        class="mt-2 btn-option"
        @click="editClient(client)"
      >
        Editar dados
      </v-btn>

      <v-btn
        small
        block
        text
        :loading="loadDelete"
        class="mt-2 btn-option"
        @click="setClientData($event, client)"
      >
        Deletar
      </v-btn>

      <v-menu
        v-model="deleteMenu"
        :close-on-content-click="false"
        max-width="400"
        offset-y
        :position-x="positionX"
        :position-y="positionY"
      >
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title class="title-card">
              Confirmar deleção
            </v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            {{
              `Todos os dados e orçamentos do cliente ${clientSelected.name} serão perdidos. Deseja continuar com a deleção?`
            }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text small @click="deleteMenu = false"> Cancelar </v-btn>
            <v-btn
              small
              text
              @click="deleteClient(clientSelected)"
              color="#b51414"
            >
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
        :client="client"
        @close-modals="modalAdd = false"
        @reload-list="$emit('reload-list')"
      ></client-budget-add>
    </v-dialog>
  </v-row>
</template>

<script>
import Component from "../Notification.vue";
import ClientBudgetAdd from "./ClientBudgetAdd";
import { deleteClient } from "@/services/OrderService.js";
import { mapState } from "vuex";

export default {
  name: "ClientDetails",
  data: () => ({
    clientId: null,
    modalAdd: false,
    loadDelete: false,
    deleteMenu: false,
    positionX: null,
    positionY: null,
    clientSelected: {}
  }),

  created() {},

  props: {
    client: {
      type: Object,
      required: false,
      default: () => {}
    },
    userType: {
      type: String,
      required: false,
      default: null
    }
  },

  watch: {},

  components: {
    ClientBudgetAdd
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"]),

    disableDelete() {
      return false;
    }
  },

  methods: {
    editClient(client) {
      this.$emit("edit-client", client);
    },

    addSchedule(client) {
      this.$emit("edit-client", client);
    },

    setClientData(e, client) {
      this.positionX = e.clientX;
      this.positionY = e.clientY;
      this.clientSelected = client;
      this.deleteMenu = true;
    },

    deleteClient(client) {
      this.loadDelete = true;
      deleteClient(client.id)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Cliente deletado."
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
          this.$emit("reload-list");
        })
        .catch(() => {
          this.$toast.error(
            <Component
              title="Erro ao deletar cliente"
              subtitle="Por favor tente novamente mais tarde"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          this.loadDelete = false;
        });
    },

    addBudget(client) {
      this.clientId = client.id;
      this.modalAdd = true;
    },

    getBorder(item) {
      return item.situation === "Maturação"
        ? "border-right: solid #b51414 5px"
        : "border-right: solid green 5px";
    },

    reloadList() {
      this.modalAdd = false;
      this.$emit("reload-only");
    }
  }
};
</script>

<style lang="scss" scoped>
.details {
  font-weight: 500;
  font-size: 14px;
}

.details-result {
  font-size: 14px;
  color: rgb(66, 66, 66);
}

.background {
  background: #fff;
  padding: 10px;
  border-radius: 5px;
}

.client-title {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.client-subtitle {
  color: #aaaaaa;
  font-size: 13px;
}
</style>
