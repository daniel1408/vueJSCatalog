<template>
  <div>
    <v-card class="mx-auto" style="height: 100%;" flat>
      <v-form
        ref="clientForm"
        v-model="validBasic"
        style="overflow: auto; max-height: 60vh"
        class="px-5"
      >
        <v-row dense>
          <v-col cols="12" class="mt-5">
            <h4 class="title-section">Dados básicos</h4>
          </v-col>
          <v-col cols="6">
            <v-select
              :items="personTypeList"
              color="#34495e"
              v-model="clientForm.personType"
              label="Tipo"
              outlined
              dense
            ></v-select>
          </v-col>

          <v-col cols="6" v-if="clientForm.personType === 'JURIDICA'">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.cnpj"
              label="CNPJ"
              v-mask="'##.###.###/####-##'"
              :disabled="isEdit"
              :rules="cnpjRules"
            ></v-text-field>
          </v-col>

          <v-col cols="6" v-else>
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.cpf"
              v-mask="'###.###.###-##'"
              label="CPF"
              :disabled="isEdit"
              :rules="cpfRules"
            ></v-text-field>
          </v-col>

          <v-col :cols="clientForm.personType === 'JURIDICA' ? 6 : 12">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.name"
              :label="
                clientForm.personType === 'JURIDICA'
                  ? 'Razão social'
                  : 'Nome do cliente'
              "
              :rules="[v => !!v || 'O Nome é obrigatório']"
            ></v-text-field>
          </v-col>

          <v-col cols="6" v-if="clientForm.personType === 'JURIDICA'">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.fantasyName"
              label="Nome fantasia"
              :rules="[v => !!v || 'O Nome fantasia é obrigatório']"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.postalCode"
              label="CEP"
              v-mask="'#####-###'"
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
              v-model="clientForm.address1"
              label="Endereço"
              :rules="[v => !!v || '']"
            ></v-text-field>
          </v-col>

          <v-col cols="4" md="4" sm="4" xs="4">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.address2"
              type="number"
              label="Número"
              :rules="[v => !!v || '']"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" sm="6" xs="6">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.complement"
              label="Complemento"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" sm="6" xs="6">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.location"
              label="Localização"
              append-icon="place"
            ></v-text-field>
          </v-col>

          <v-col cols="8" md="8" sm="8" xs="8">
            <v-text-field
              dense
              color="#34495e"
              :disabled="cepSuccess"
              outlined
              v-model="clientForm.city"
              label="Cidade"
            ></v-text-field>
          </v-col>

          <v-col cols="4" md="4" sm="4" xs="4">
            <v-text-field
              dense
              color="#34495e"
              outlined
              :disabled="cepSuccess"
              v-model="clientForm.state"
              label="Estado"
              :rules="[v => !!v || '']"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row dense class="mt-5">
          <v-col cols="12">
            <h4 class="title-section">Dados Contato</h4>
          </v-col>

          <v-col cols="6">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.firstPhoneNumber"
              label="Celular 1"
              v-mask="'(##) #####-####'"
              :rules="[v => !!v || 'O número é obrigatório']"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              dense
              color="#34495e"
              outlined
              v-model="clientForm.secondPhoneNumber"
              v-mask="'(##) #####-####'"
              label="Celular 2"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              dense
              outlined
              label="Email"
              v-model="clientForm.email"
              color="#34495e"
              type="text"
              :disabled="isEdit"
              :rules="emailRules"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              dense
              outlined
              label="Nome do contato"
              v-model="clientForm.contactName"
              color="#34495e"
              type="text"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>

      <div class="d-flex justify-center pa-3" style="background: #f9f9f9">
        <v-btn
          color="#41b883"
          @click="saveClient"
          :disabled="!validBasic"
          class="btn-text"
          :loading="isLoading"
          elevation="0"
        >
          <v-icon small class="mr-1">save</v-icon> Salvar cliente
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import Component from "../Notification.vue";
import { cpfCheck, cnpjCheck } from "@/utils/functions.js";
import { getDataByCep } from "@/services/CustomerService.js";
import { mapState } from "vuex";
import {
  putClient,
  postClient,
  getClientList
} from "@/services/OrderService.js";
import Loading from "vue-loading-overlay";

export default {
  name: "ClientAdd",
  data: () => ({
    clientForm: {
      personType: "Física"
    },

    personTypeList: ["JURIDICA", "FISICA"],

    emailRules: [v => !v || /.+@.+\..+/.test(v) || "E-mail inválido"],
    cpfRules: [v => !!v || "", v => cpfCheck(v) || "CPF inválido"],
    cnpjRules: [v => !!v || "", v => cnpjCheck(v) || "CNPJ inválido"],

    e1: 0,
    isLoading: false,
    validBasic: true,
    finishLoad: false,
    cepSuccess: false
  }),

  created() {
    if (this.isEdit && this.dataToEdit) {
      this.clientForm = this.dataToEdit;
    }
  },

  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    dataToEdit: {
      type: Object,
      required: false
    }
  },

  watch: {},

  components: {
    Loading
  },

  computed: {
    ...mapState("LoginStore", ["storeUser"])
  },

  methods: {
    saveClient() {
      this.isLoading = true;
      this.clientForm.requestToken = this.storeUser.requestToken;
      this.clientForm.masterName = this.storeUser.masterName;

      if (!this.isEdit) {
        getClientList(null, "ALL")
          .then(res => {
            const user = res.data.find(
              x =>
                x.cnpj === this.clientForm.cnpj ||
                x.cpf === this.clientForm.cpf ||
                x.email === this.clientForm.email
            );

            if (user) {
              this.$toast.error(
                <Component
                  title="Cliente já está cadastrado na base"
                  subtitle="Revise os seus dados e tente novamente"
                ></Component>,
                {
                  hideProgressBar: true,
                  timeout: 2000
                }
              );
              this.isLoading = false;
            } else {
              this.postNewClient();
            }
          })
          .catch(() => {
            this.isLoading = true;
          });
      } else {
        putClient(this.clientForm)
          .then(() => {
            this.$toast.success(
              <Component
                title="Sucesso"
                subtitle="Cliente editado."
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
                title="Erro ao atualizar cliente"
                subtitle="Por favor revise os dados e tente novamente"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000
              }
            );
          })
          .finally(() => {
            this.isLoading = true;
            this.$emit("reload-list");
          });
      }
    },

    postNewClient() {
      this.clientForm.masterName = this.storeUser.masterName;

      postClient(this.clientForm)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Cliente adicionado."
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
              title="Erro ao cadastrar cliente"
              subtitle="Por favor revise os dados e tente novamente"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000
            }
          );
        })
        .finally(() => {
          this.isLoading = true;
          this.$emit("reload-list");
        });
    },

    close() {
      this.$refs.clientForm.reset();
      this.$emit("close-modals");
    },

    getAddressByCep() {
      if (this.clientForm.postalCode) {
        this.finishLoad = true;
        const form = this.clientForm.postalCode.replace(/-/g, "");

        getDataByCep(form)
          .then(res => {
            this.cepSuccess = true;

            this.clientForm.state = res.data.uf;
            this.clientForm.city = res.data.localidade;
            this.clientForm.address1 = res.data.logradouro;

            setTimeout(() => {
              this.finishLoad = false;
            }, 500);
          })
          .catch(() => {
            this.finishLoad = false;
            this.cepSuccess = false;
          });
      }
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
  font-weight: 1000;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #333;
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
