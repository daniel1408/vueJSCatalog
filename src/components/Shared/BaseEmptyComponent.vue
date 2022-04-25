<template>
  <transition name="fade-slide-fade">
    <div class="base-empty-component" :style="customHeight">
      <img
        v-if="data.useImage"
        :src="data.icon.name"
        alt="preview image"
        :height="data.icon.size"
      />
      <v-icon v-else :size="data.icon.size">{{ data.icon.name }}</v-icon>
      <span class="base-empty-component__title">{{ data.title }}</span>
      <p class="base-empty-component__sub" v-html="data.subtitle"></p>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    height: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
      default: "relative",
    },
  },
  computed: {
    customHeight() {
      return this.height
        ? `height: ${this.height}; justify-content: center;`
        : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.base-empty-component {
  padding: 10px;
  color: #808080;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &__title {
    font-size: 20px;
    margin-top: 3px;
  }
  &__sub {
    font-size: 15px;
    font-weight: 200;
  }
  &__img {
    align-self: center;
  }
}
</style>
