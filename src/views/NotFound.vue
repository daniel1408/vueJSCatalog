<template>
  <div class="empty-data">
    <h1>Roterização desativada</h1>
    <p class="label">Por favor, navegue pela estrura de abas da plataforma</p>
    <v-btn small outlined dark @click="$router.push('/')">Voltar</v-btn>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style lang="scss" scoped>
// @import "@/assets/scss/styles.scss";

.empty-data {
  height: 100% !important;
  color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .label {
    font-size: 15px;
    font-weight: normal;
  }
}
</style>