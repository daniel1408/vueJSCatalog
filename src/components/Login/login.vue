<template>
  <v-row style="height: 100%; width: 100%" class="ma-0 pa-0 background-content">
    <v-card flat class="card-content">
      <v-row style="height: 100%;" class="d-flex justify-center">
        <v-col class="pa-0 elevation-2 image-content" cols="12" md="7">
          <v-img
            src="@/assets/folder.jpg"
            lazy-src="@/assets/folder.jpg"
            class="img-login"
            alt="IMG"
          ></v-img>
        </v-col>

        <v-col class="left-login" cols="12" md="5">
          <v-card
            style="z-index: 1; border-radius: 0; flex-direction: column"
            class="d-flex justify-center align-center"
            width="100%"
            elevation="0"
          >
            <div>
              <v-img
                src="@/assets/initial-logo.png"
                style="width: 400px"
              ></v-img>
            </div>

            <v-form style="width: 80%; margin-top: 40px;">
              <v-text-field
                dense
                outlined
                prepend-inner-icon="person"
                placeholder="E-mail"
                v-model="email"
                color="#34495e"
                single-line
                :disabled="loading"
                :loading="loading"
                type="text"
                :rules="emailRules"
                hide-details
              ></v-text-field>

              <v-text-field
                dense
                prepend-inner-icon="lock"
                outlined
                placeholder="Senha"
                color="#34495e"
                single-line
                v-model="password"
                :disabled="loading"
                :loading="loading"
                :type="toggleInputType ? 'text' : 'password'"
                :append-icon="toggleInputType ? 'visibility_off' : 'visibility'"
                @click:append="toggleInputType = !toggleInputType"
                :rules="[v => !!v || 'A senha é obrigatória']"
                hide-details
                class="mt-5"
              ></v-text-field>

              <div class="forgot mt-2">
                <v-spacer></v-spacer>
                <span @click="resetPwd">Esqueceu a senha?</span>
              </div>

              <div style="margin-top: 80px">
                <v-btn
                  class="btn-login"
                  :disabled="loading"
                  type="submit"
                  @click.prevent="login"
                  block
                  dark
                  large
                >
                  Entrar
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog
      v-model="resetPwdModal"
      persistent
      overlay-opacity="0.93"
      width="700"
    >
      <v-card>
        <v-toolbar flat color="#f5f5f5">
          <v-toolbar-title class="title-card">
            Recuperação de senha
          </v-toolbar-title>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text class="mb-0 mt-8">
          <div class="text--primary mb-7">
            Digite seu e-mail que lhe enviaremos um link para alteração da sua
            senha de acesso.
          </div>

          <v-form ref="form" lazy-validation>
            <v-text-field
              label="E-mail"
              v-model="emailToResetPwd"
              :rules="emailRules"
              outlined
              required
              hide-details
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small @click="cancelResetPwd"> Cancelar </v-btn>
          <v-btn
            color="#34495e"
            dark
            small
            @click.prevent="aplicateReset"
            elevation="0"
            :loading="loadReset"
          >
            <v-icon small class="mr-1">mail</v-icon>
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase";
import Component from "../Notification.vue";
import { VerifyErrorCode } from "@/utils/functions.js";

export default {
  name: "Login",
  data() {
    return {
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+/.test(v) || "E-mail deve ser válido"
      ],
      email: "",
      password: "",
      toggleInputType: false,
      loading: false,
      bearerToken: "",
      positionX: null,
      positionY: null,
      checkCode: null,
      addMenu: false,
      emailToResetPwd: null,
      resetPwdModal: false,
      loadReset: false,
      windowWidth: null
    };
  },

  created() {
    this.windowWidth = window.innerWidth;
  },

  props: {},

  methods: {
    ...mapActions("LoginStore", ["ADD_JWT", "ADD_STORE"]),

    resetPwd() {
      this.resetPwdModal = true;
    },

    cancelResetPwd() {
      this.$refs.form.reset();
      this.resetPwdModal = false;
    },

    aplicateReset() {
      if (this.emailToResetPwd && this.emailToResetPwd.length > 0) {
        this.loadReset = true;

        firebase.auth().languageCode = "pt";
        firebase
          .auth()
          .sendPasswordResetEmail(this.emailToResetPwd)
          .then(() => {
            this.resetPwdModal = false;

            this.$toast.success(
              <Component
                title="Sucesso!"
                subtitle="Verifique seu e-mail. Lhe enviamos um link e por ele será possível restaurar sua senha"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000
              }
            );

            this.loadReset = false;
          })
          .catch(error => {
            this.$toast.error(
              <Component
                title="Erro ao recuperar senha"
                subtitle={VerifyErrorCode(error.code)}
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000
              }
            );

            this.loadReset = false;
          });
      }
    },

    openMenuAdd(event) {
      this.positionX = event.clientX;
      this.positionY = event.clientY;
      setTimeout(() => {
        this.addMenu = true;
      }, 400);
    },

    login() {
      this.loading = true;
      firebase.auth().languageCode = "pt";
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          res => {
            this.finallyLogin(res);
          },
          error => {
            this.$toast.error(
              <Component
                title="Erro ao logar"
                subtitle={VerifyErrorCode(error.code)}
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000
              }
            );
            this.loading = false;
          }
        );
    },

    finallyLogin(res) {
      const user = JSON.parse(JSON.stringify(res.user));

      this.ADD_JWT(user.stsTokenManager.accessToken).then(() => {
        let userStore = {
          requestToken: user.uid,
          cpf: "XXX.XXX.XXX-XX",
          email: this.email,
          firstPhoneNumber: "(XX) XXXX-XXXX",
          masterName: "ALL",
          userType: "ROOT",
          name: "ROOT"
        };

        this.ADD_STORE(userStore);
        this.$router.replace("home");

        this.$toast.success(
          <Component
            title="Bem vindo"
            subtitle="Login realizado com sucesso!"
          ></Component>,
          {
            hideProgressBar: true,
            timeout: 2000
          }
        );
      });
    }
  },

  components: {}
};
</script>

<style lang="scss" scoped>
.card-content {
  width: 70vw;
  height: 80vh;
  background: unset;
  box-shadow: -20px 20px 20px rgba(0, 0, 0, 0.25),
    20px 20px 20px rgba(0, 0, 0, 0.25);
}

.background-content {
  background: linear-gradient(90.63deg, #34495e 1.12%, #213a53 99.93%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-style {
  color: #ffffff;
  font-size: 25px;
}

.login-card {
  width: 65%;
}

.title-font-login {
  display: flex;
  justify-content: flex-start;
}
.v-text-field {
  padding-top: 0px;
}

.btn-login {
  background: linear-gradient(
    95.11deg,
    #1aa164 0.35%,
    #41b883 56.08%,
    #41b883 100%
  );
  font-size: 18px;
  font-weight: 400;
  text-transform: uppercase;
}

.btn-login:hover {
  transform: scale(1.05);
}

.left-login {
  background-color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  display: flex;
  justify-content: center;
}

.image-content {
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: black;

  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}

.semver {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #e4e4e4;
}

.forgot {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: rgb(150, 150, 150);
  cursor: pointer;
}

/* Add modal CSS */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.title-modal {
  font-size: 16px;
  font-weight: 200;
  color: #333;
}

.img-login {
  height: -webkit-fill-available;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}

::v-deep .v-toolbar__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

::v-deep .v-stepper__header,
.v-stepper {
  box-shadow: none !important;
}

.card-text-login {
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

.display-1 {
  font-weight: 500 !important;
  font-size: 24px !important;
  color: #333;
}

::v-deep .v-input input {
  font-size: 15px;
  font-weight: 400 !important;
}
</style>
