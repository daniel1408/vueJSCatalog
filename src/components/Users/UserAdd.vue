<template>
  <div>
    <v-toolbar flat color="#304156" dark>
      <v-toolbar-title class="title-card" v-if="isEdit">
        Editar usuário
      </v-toolbar-title>
      <v-toolbar-title class="title-card" v-else>
        Adicionar usuário
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn icon @click="back">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-stepper v-model="e1" style="height: 100%; border-radius: 0">
      <v-stepper-header class="header">
        <v-stepper-step
          key="1-step"
          :complete="e1 > 1"
          :step="1"
          edit-icon="check"
          color="#34495e"
          :editable="isEdit"
        >
          Dados básicos
          <small class="mt-1">Dados básicos</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          key="2-step"
          :complete="e1 > 2"
          :step="2"
          edit-icon="check"
          color="#34495e"
          :editable="isEdit"
        >
          Dados de acesso
          <small class="mt-1">Dados para login</small>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <v-card flat class="mt-1">
            <v-form ref="validBasic" v-model="validBasic">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="userForm.name"
                    :label="'Nome do usuário'"
                    :rules="[(v) => !!v || 'O Nome é obrigatório']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="userForm.cpf"
                    v-mask="'###.###.###-##'"
                    label="CPF"
                    :rules="cpfRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="userForm.firstPhoneNumber"
                    label="Celular 1"
                    v-mask="'(##) #####-####'"
                    :rules="[(v) => !!v || 'O número é obrigatório']"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    dense
                    color="#34495e"
                    outlined
                    v-model="userForm.secondPhoneNumber"
                    v-mask="'(##) #####-####'"
                    label="Celular 2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="UserTypeList"
                    color="#34495e"
                    v-model="userForm.userType"
                    label="Tipo de usuário"
                    :rules="[(v) => !!v || 'O tipo de usuário é obrigatório']"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <div class="d-flex justify-end footer">
            <v-btn
              color="#41b883"
              @click="nextStep(1)"
              class="btn-text"
              elevation="0"
              :disabled="!validBasic"
            >
              Continuar
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content :step="2">
          <v-card flat class="mt-1">
            <v-form
              ref="validAccess"
              style="height: 100%"
              v-model="validAccess"
            >
              <v-row
                dense
                class="d-flex justify-center align-center"
                style="height: 100%"
              >
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    label="Email"
                    v-model="userForm.email"
                    color="#34495e"
                    type="text"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="masterList"
                    color="#34495e"
                    v-model="userForm.masterName"
                    :disabled="storeUser.masterName !== 'ALL'"
                    label="Master do usuário"
                    outlined
                    dense
                    item-text="name"
                    item-value="code"
                    :rules="[(v) => !!v || 'A master é obrigatória']"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    dense
                    color="#3F184A"
                    outlined
                    v-model="userForm.password"
                    label="Senha"
                    :append-icon="
                      toggleInputType ? 'visibility_off' : 'visibility'
                    "
                    :rules="[
                      (v) => !!v || 'A senha é obrigatória',
                      (v) =>
                        (v && v.length >= 6) ||
                        'A senha deve ter no mínimo 6 caracteres',
                    ]"
                    :type="toggleInputType ? 'text' : 'password'"
                    @click:append="toggleInputType = !toggleInputType"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    dense
                    color="#3F184A"
                    outlined
                    v-model="userForm.passwordConfirm"
                    label="Confirmação de senha"
                    :append-icon="
                      toggleInputType2 ? 'visibility_off' : 'visibility'
                    "
                    :rules="[
                      (v) => !!v || 'A confirmação é obrigatória',
                      (v) =>
                        v === userForm.password || 'As senhas devem ser iguais',
                      (v) =>
                        (v && v.length >= 6) ||
                        'A senha deve ter no mínimo 6 caracteres',
                    ]"
                    :type="toggleInputType2 ? 'text' : 'password'"
                    @click:append="toggleInputType2 = !toggleInputType2"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <div class="d-flex justify-end footer">
            <v-btn text @click="beforeStep(4)">Voltar</v-btn>
            <v-btn
              @click="saveUser()"
              :loading="loadingSave"
              :disabled="!validAccess"
              color="#41b883"
              class="btn-text"
              elevation="0"
            >
              <v-icon small class="mr-1">save</v-icon>
              Salvar
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>


<script>
import { postUser, putUser } from "@/services/OrderService.js";
import { cpfCheck, VerifyErrorCode } from "@/utils/functions.js";
import { mapState } from "vuex";
import firebase from "firebase";
import Component from "../Notification.vue";

export default {
  name: "UserAdd",
  data: () => ({
    UserTypeList: ["ADMINISTRADOR", "ORCAMENTISTA", "FRANQUEADO"],
    e1: 1,
    steps: 2,
    toggleInputType: false,
    toggleInputType2: false,
    clotheAdded: null,
    imageList: [],
    validBasic: true,
    validAccess: true,
    loadingSave: false,
    isLoadingFile: false,
    finishLoad: false,
    cepSuccess: false,
    cpfRules: [(v) => !!v || "", (v) => cpfCheck(v) || "CPF inválido"],
    emailRules: [(v) => !!v || "", (v) => /.+@.+\..+/.test(v) || ""],
    userForm: {
      personType: "Física",
    },

    masterList: [
      { name: "Uberlândia", code: "UBERLANDIA" },
      { name: "Brasília", code: "BRASILIA" },
      { name: "Franca", code: "FRANCA" },
      { name: "Passos", code: "PASSOS" },
    ],
  }),

  created() {
    if (this.isEdit && this.userToEdit) {
      this.userForm = this.userToEdit;
      this.userForm.passwordConfirm = this.userToEdit.password;
    }

    if (this.storeUser.masterName !== "ALL") {
      this.userForm.masterName = this.storeUser.masterName;
    }
  },

  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: true,
    },
    userToEdit: {
      type: Object,
      required: false,
    },
    meta: {
      type: Array,
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

  components: {},

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

    saveUser() {
      this.isEdit ? this.nextStepUpdate() : this.nextStepSave();
    },

    nextStepSave() {
      this.loadingSave = true;
      const userType =
        this.userForm.userType === "FRANQUEADO"
          ? "VENDEDOR"
          : this.userForm.userType;

      const user = {
        email: this.userForm.email,
        firstPhoneNumber: this.userForm.firstPhoneNumber,
        secondPhoneNumber: this.userForm.secondPhoneNumber,
        password: this.userForm.password,
        name: this.userForm.name,
        userType: userType,
        cpf: this.userForm.cpf,
        masterName: this.userForm.masterName,
      };

      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.userForm.email,
          this.userForm.password
        )
        .then(
          (data) => {
            user.requestToken = data.user.uid;
            postUser(user)
              .then(() => {
                this.$toast.success(
                  <Component
                    title="Sucesso"
                    subtitle="Cliente adicionado."
                  ></Component>,
                  {
                    hideProgressBar: true,
                    timeout: 2000,
                  }
                );
              })
              .catch(() => {
                firebase.auth().deleteUser(data.user.uid);
              })
              .finally(() => {
                this.loadingSave = false;
                this.$emit("reload-list");
              });
          },
          (error) => {
            this.loadingSave = false;
            this.$toast.error(
              <Component
                title="Erro ao cadastrar cliente"
                subtitle={VerifyErrorCode(error.code)}
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
          }
        );
    },

    nextStepUpdate() {
      this.loadingSave = true;
      const userType =
        this.userForm.userType === "FRANQUEADO"
          ? "VENDEDOR"
          : this.userForm.userType;

      const user = {
        email: this.userForm.email,
        firstPhoneNumber: this.userForm.firstPhoneNumber,
        secondPhoneNumber: this.userForm.secondPhoneNumber,
        password: this.userForm.password,
        name: this.userForm.name,
        userType: userType,
        cpf: this.userForm.cpf,
        id: this.userForm.id,
        masterName: this.userForm.masterName,
        requestToken: this.userForm.requestToken,
      };

      putUser(user)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Cliente atualizado."
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        })
        .catch(() => {
          this.loadingSave = false;
          this.$toast.error(
            <Component
              title="Erro ao atualizar cliente"
              subtitle="Por favor revise os dados e tente novamente"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        })
        .finally(() => {
          this.loadingSave = false;
          this.$emit("reload-list");
        });
    },

    back() {
      this.$emit("close-modals");
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
