<template>
  <v-container class="base-upload" fluid @mousedown.stop>
    <v-row dense>
      <v-col cols="12" md="12">
        <div>
          <v-row dense class="d-flex justify-center">
            <v-col
              cols="12"
              md="12"
              class="file-upload__wrap"
              :style="'min-height: 20vh'"
            >
              <div class="file-upload__wrap-input" :style="warpStyle">
                <input
                  class="file-upload__input"
                  type="file"
                  ref="fileInput"
                  id="fileInputDress"
                  :disabled="imageData"
                  @change="previewImage"
                />

                <div class="file-upload__txt-wrap">
                  <h3 class="file-upload__txt">
                    Clique ou arraste o arquivo
                    <span class="info-size">
                      {{ filesType }}
                    </span>
                  </h3>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="12" v-if="uploadValue > 0">
              <p>
                Carregando: {{ uploadValue.toFixed() + "%" }}
                <progress
                  id="progress"
                  :value="uploadValue"
                  max="100"
                ></progress>
              </p>
            </v-col>

            <v-col cols="12" md="12" v-if="imageData">
              <span>
                {{ imageData.name }}
              </span>
            </v-col>

            <div
              class="d-flex mt-2"
              v-if="imageList.length && imageData == null && type === 'budget'"
              style="overflow: auto"
            >
              <v-img
                v-for="(item, index) in imageList"
                :key="index"
                :src="
                  checkIsImage(item)
                    ? item
                    : 'https://cdn-icons-png.flaticon.com/512/534/534074.png'"
                :lazy-src="checkIsImage(item)
                    ? item
                    : 'https://cdn-icons-png.flaticon.com/512/534/534074.png'"
                position="top center"
                class="image-behind"
              ></v-img>
            </div>

            <div
              class="mt-2"
              v-if="
                imageList.length && imageData == null && type === 'proposal'
              "
            >
              <span v-if="imageList.length === 1">
                {{ imageList.length + " ARQUIVO ADICIONADO" }}
              </span>
              <span v-else>
                {{ imageList.length + " ARQUIVOS ADICIONADOS" }}
              </span>
            </div>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" md="12" v-if="imageData != null">
        <v-btn text small color="#34495e" @click="back">Cancelar</v-btn>

        <v-btn
          dark
          small
          color="#34495e"
          @click="onUpload"
          :loading="isLoadingFile"
        >
          <v-icon small class="mr-2" color="#FFF">check</v-icon> 
          Adicionar arquivo
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
import Component from "../Notification.vue";
import "cropperjs/dist/cropper.css";

export default {
  name: "BaseUploadComponent",

  data: () => ({
    data: null,
    imageList: [],
    imageData: null,
    uploadValue: 0,
    isLoadingFile: false,
  }),

  created() {},
  computed: {
    warpStyle() {
      return {
        height: `100% !important`,
        width: `auto !important`,
      };
    },

    conainerUploadStyle() {
      return {
        height: "55vh",
        width: "100%",
      };
    },

    dataImageInfo() {
      return {
        icon: {
          name: "arrow_back",
          size: 40,
        },
        title: "Dica para uma melhor arquivo",
        subtitle:
          "Selecione a arquivo de maneira legível e entre os limites pretos.",
      };
    },
  },

  props: {
    savedBudgetId: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
    filesType: {
      type: String,
      default: "Você pode adicionar imagens do tipo: JPEG, PNG e GIF",
    },
    acceptType: {
      type: String,
      default: "image/*",
    },
  },

  components: {},

  methods: {
    back() {
      this.imageData = null;
      this.$emit("change-loading-file", false);
    },

    previewImage(event) {
      this.uploadValue = 0;
      this.imageData = event.target.files[0];
      this.$emit("change-loading-file", true);
    },

    onUpload() {
      this.isLoadingFile = true;

      const storageRef = firebase
        .storage()
        .ref(`${this.type}-${this.savedBudgetId}/${this.imageData.name}`)
        .put(this.imageData);

      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          this.$toast.error(
            <Component
              title="Erro ao adicionar arquivo"
              subtitle={error.message}
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        },

        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.imageList.push(url);
            this.uploadValue = 0;
            this.isLoadingFile = false;
            this.imageData = null;
            this.$emit("change-loading-file", false);
          });
        }
      );
    },

    checkIsImage(item) {
      return (
        item.includes("jpg") ||
        item.includes("jpeg") ||
        item.includes("png") ||
        item.includes("gif")
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/styles.scss";

.icon-align {
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file-upload__wrap {
  .file-upload__wrap-input {
    border-radius: 10px;
    border: 1px dashed #34495e;
    background: #f9f9f9;
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .file-upload__txt-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      .file-upload__txt {
        margin-left: 10px;
        font-size: 22px;
        font-weight: 200;
        color: gray;
      }
    }
    .file-upload__input {
      position: absolute;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .file-upload__wrap-input:hover {
    background-color: #f1f1f1;
    border: 1px dashed #34495e;
  }
  .file-upload__wrap-img {
    text-align: center;
    .file-upload__img {
      max-height: 100%;
      max-width: 100%;
      cursor: pointer;
    }
  }
}

.btn-apply {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-size {
  font-size: 13px;
  color: gray;
  display: flex;
  justify-content: center;
}

.v-text-field {
  font-size: 90%;
}

.image-behind {
  width: 120px;
  height: 150px;
  margin-right: 6px;
  border-radius: 5px;
}

.base-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
}
</style>
