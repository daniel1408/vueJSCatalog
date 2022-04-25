<template>
  <div class="sign-up">
    <p>Crie uma nova conta</p>
    <input type="text" placeholder="Email" v-model="email" />
    <br />
    <input type="password" placeholder="Senha" v-model="senha" />
    <br />
    <button @click="signUp">Sing Up</button>
    <span>
      Back to
      <router-link to="/login">login.</router-link>
    </span>
  </div>
</template>

<script>
import firebase from "firebase";
import Component from "../Notification.vue";

export default {
  name: "signUp",
  data() {
    return {
      email: "",
      senha: "",
    };
  },
  methods: {
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.senha)
        .then(
          () => {
            this.$toast.success(
              <Component
                title="Conta cadastrada"
                subtitle="Sua conta foi cadastrata com sucesso!"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
            this.$router.replace("home");
          },
          () => {
            this.$toast.error(
              <Component
                title="Erro ao cadastrar"
                subtitle="Aconteceu algo inesperado. Por favor tente novamente"
              ></Component>,
              {
                hideProgressBar: true,
                timeout: 2000,
              }
            );
          }
        );
    },
  },
};
</script>

 <style scoped>
.sign-up {
  margin-top: 40px;
  text-align: center;
}
input {
  margin: 10px 0;
  padding: 15px;
}
button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #1606f3;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
</style>