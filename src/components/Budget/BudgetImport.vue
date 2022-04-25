<template>
  <v-container class="base-upload" fluid @mousedown.stop>
    <v-row dense>
      <v-col cols="12" md="12">
        <div>
          <v-row dense class="d-flex justify-center">
            <v-col cols="12" md="12">
              <v-text-field
                dense
                color="#34495e"
                v-model="splitedText"
                outlined
                label="Separador"
                class="mt-1"
              ></v-text-field>
            </v-col>

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
                      Você pode adicionar arquivos: TXT e CSV
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
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "cropperjs/dist/cropper.css";

export default {
  name: "BaseUploadComponent",

  data: () => ({
    data: null,
    imageData: null,
    uploadValue: 0,
    isLoadingFile: false,
    splitedText: ";",
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
  },

  components: {},

  methods: {
    back() {
      this.imageData = null;
    },

    previewImage(event) {
      var files = event.target.files;
      const self = this;
      var reader = new FileReader();
      reader.onload = function (event) {
        self.$emit("save-import-data", {
          result: event.target.result,
          splitedText: self.splitedText,
        });
      };
      reader.readAsText(files[0]);
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
