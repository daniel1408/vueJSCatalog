<template>
  <v-row class="background ma-0 pa-0" style="border-radius: 5px">
    <v-toolbar flat color="#304156" dark>
      <v-toolbar-title class="title-card">
        Detalhes do orçamento
      </v-toolbar-title>

      <v-btn icon @click="$emit('close-detail')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-tabs
      active-class="active-tab"
      slider-color="#da7c02"
      v-model="tab"
      centered
      background-color="#f5f5f5"
      color="#41b883"
      :icons-and-text="true"
      :grow="true"
    >
      <v-tab :href="`#tab-1`">Dados gerais</v-tab>
      <v-tab :href="`#tab-2`">Arquivos</v-tab>
      <v-tab :href="`#tab-3`">Adicionais</v-tab>

      <v-tab-item
        :value="'tab-1'"
        style="margin: 0; overflow: auto; height: 65vh"
      >
        <v-col cols="12" class="px-3 mt-4">
          <span class="details">Franqueado:</span>
          <span class="details-result">
            {{ getConsulor(selectedBudget.requestToken) }}
          </span>
          <br />

          <span class="details">Master:</span>
          <span class="details-result">
            {{ translate[selectedBudget.masterName] }}
          </span>
          <br />

          <v-divider class="my-3"></v-divider>

          <span class="details">Cliente:</span>
          <span class="details-result"> {{ selectedBudget.client.name }} </span>
          <br />

          <span
            class="details"
            v-if="selectedBudget.client.personType === 'JURIDICA'"
          >
            CNPJ:
          </span>

          <span
            class="details-result"
            v-if="selectedBudget.client.personType === 'JURIDICA'"
          >
            {{ selectedBudget.client.cnpj }}
          </span>

          <span
            class="details"
            v-if="selectedBudget.client.personType === 'FISICA'"
          >
            CPF:
          </span>
          <span
            class="details-result"
            v-if="selectedBudget.client.personType === 'FISICA'"
          >
            {{ selectedBudget.client.cpf }}
          </span>
          <br />

          <span class="details">CEP:</span>
          <span class="details-result">
            {{ selectedBudget.postalCode }}
          </span>
          <br />
          <span class="details">Endereço:</span>
          <span class="details-result">
            {{ selectedBudget.address1 }} - {{ selectedBudget.address2 }}
            {{ selectedBudget.complement }}
          </span>
          <br />
          <span class="details">Cidade:</span>
          <span class="details-result">
            {{ selectedBudget.city }} / {{ selectedBudget.state }}
          </span>
          <br />

          <span class="details">Estrutura:</span>
          <span class="details-result">
            {{ selectedBudget.structure }}
          </span>
          <br />
          <span class="details">Tecnologia:</span>
          <span class="details-result">
            {{ selectedBudget.technology }}
          </span>
          <br />
          <span class="details">Voltagem:</span>
          <span class="details-result">
            {{ selectedBudget.voltage }}
          </span>
          <br />
          <span class="details">Classe:</span>
          <span class="details-result">
            {{ selectedBudget.classes }}
          </span>
          <br />
          <span class="details">Deseja financiamento?</span>
          <span class="details-result">
            {{ selectedBudget.financing ? "SIM" : "NÃO" }}
          </span>
          <br />
          <span class="details">Observação:</span>
          <span class="details-result">
            {{ selectedBudget.observations }}
          </span>
          <br />
        </v-col>

        <v-col cols="12" class="px-3">
          <span class="span-legend">NÚMERO DA PROPOSTA</span>
          <v-text-field
            placeholder="Número da proposta"
            v-model="proposalToSave.proposalNumber"
            color="#34495e"
            outlined
            dense
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="12" class="px-3">
          <span class="span-legend">CONDIÇÃO DA PROPOSTA</span>
          <v-select
            :items="conditionList"
            color="#34495e"
            v-model="proposalToSave.situation"
            placeholder="Condição da proposta"
            outlined
            hide-details
            dense
            item-text="name"
            item-value="value"
          ></v-select>
        </v-col>

        <v-col
          cols="12"
          v-if="proposalToSave.situation === 'PENDENTE'"
          class="px-3"
        >
          <span class="span-legend">Descrição da pendência</span>
          <v-textarea
            placeholder="Descrição da pendência"
            v-model="proposalToSave.pendenceDetail"
            hide-details
            outlined
          ></v-textarea>
        </v-col>

        <v-col cols="12">
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
      </v-tab-item>

      <v-tab-item
        :value="'tab-2'"
        style="margin: 0; overflow: auto; height: 65vh"
      >
        <v-col cols="12" class="pa-2 mt-4" v-if="imageList.length">
          <v-card
            class="image-behind"
            v-for="(item, index) in imageList"
            :key="index"
            @click="enlargeImage(item)"
          >
            <v-img
              position="top center"
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
            >
            </v-img>
          </v-card>
        </v-col>
        <v-col v-else>
          <base-empty
            :data="dataEmpty"
            style="width: 100%; height: 20vh"
          ></base-empty>
        </v-col>
      </v-tab-item>

      <v-tab-item
        :value="'tab-3'"
        style="margin: 0; overflow: auto; height: 65vh"
      >
        <v-col cols="12" class="ma-0 mt-5">
          <span class="span-legend">VALOR DA PROPOSTA</span>
          <money
            v-model="proposalToSave.value"
            v-bind="money"
            class="form-input mb-6"
          >
          </money>

          <span class="span-legend">DATA DA PROPOSTA</span>
          <v-text-field
            placeholder="DATA DA PROPOSTA"
            v-model="proposalToSave.inverterBrand"
            color="#34495e"
            outlined
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <span class="span-legend">VALIDADE DA PROPOSTA - DIAS ÚTEIS</span>
          <v-text-field
            placeholder="VALIDADE DA PROPOSTA"
            v-model="proposalToSave.supplierName"
            color="#34495e"
            outlined
            dense
            v-mask="'##/##/####'"
          ></v-text-field>

          <span class="span-legend">POTÊNCIA DO SISTEMA EM KWP</span>
          <v-text-field
            placeholder="POTÊNCIA  DO SISTEMA"
            v-model="proposalToSave.systemPower"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">CONSUMO CONSIDERADO EM KWH</span>
          <v-text-field
            placeholder="CONSUMO CONSIDERADO"
            v-model="proposalToSave.consideredConsumption"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">GERAÇÃO EM KWH</span>
          <v-text-field
            placeholder="GERAÇÃO EM KWH"
            v-model="proposalToSave.typeOfModules"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">VALOR DA CONTA ATUAL</span>
          <money
            v-model="proposalToSave.newAccountValue"
            v-bind="money"
            class="form-input mb-6"
          >
          </money>

          <span class="span-legend">VALOR DA NOVA CONTA</span>
          <money
            v-model="proposalToSave.kitValue"
            v-bind="money"
            class="form-input mb-6"
          >
          </money>

          <span class="span-legend">QUANTIDADE DE MÓDULOS</span>
          <v-text-field
            placeholder="QUANTIDADE DE MÓDULOS"
            v-model="proposalToSave.quantityModules"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">MÓDULOS</span>
          <v-text-field
            placeholder="MÓDULOS"
            v-model="proposalToSave.brandOfModules"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">QUANT. INVERSOR 1</span>
          <v-text-field
            placeholder="QUANT. INVERSOR 1"
            v-model="proposalToSave.quantityInverter1"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">INVERSOR 1</span>
          <v-text-field
            placeholder="INVERSOR 1"
            v-model="proposalToSave.inverterType1"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">QUANT. INVERSOR 2</span>
          <v-text-field
            placeholder="QUANT. INVERSOR 2"
            v-model="proposalToSave.quantityInverter2"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">INVERSOR 2</span>
          <v-text-field
            placeholder="INVERSOR 2"
            v-model="proposalToSave.inverterType2"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">ÁREA NECESSÁRIA EM M²</span>
          <v-text-field
            placeholder="ÁREA NECESSÁRIA"
            v-model="proposalToSave.requiredArea"
            color="#34495e"
            outlined
            dense
            suffix="M²"
          ></v-text-field>

          <span class="span-legend">MODALIDADE</span>
          <v-text-field
            placeholder="MODALIDADE"
            v-model="proposalToSave.modality"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">MARGEM DE LUCRO LÍQUIDO</span>
          <v-text-field
            placeholder="MARGEM DE LUCRO LÍQUIDO"
            v-model="proposalToSave.typeOfPlant"
            color="#34495e"
            outlined
            dense
          ></v-text-field>

          <span class="span-legend">VALOR DA COMISSÃO</span>
          <money
            v-model="proposalToSave.laborValue"
            v-bind="money"
            class="form-input mb-6"
          >
          </money>

          <span class="span-legend">SITUAÇÃO</span>
          <v-select
            placeholder="SITUAÇÃO"
            outlined
            dense
            color="#34495e"
            v-model="proposalToSave.commissionValue"
            :items="situationList"
          ></v-select>

          <span
            class="span-legend"
            v-if="proposalToSave.commissionValue === 'FECHADA'"
          >
            DATA DE FECHAMENTO
          </span>
          <v-text-field
            placeholder="DATA DE FECHAMENTO"
            v-model="proposalToSave.averageAccountValue"
            color="#34495e"
            outlined
            dense
            type="date"
            v-if="proposalToSave.commissionValue === 'FECHADA'"
          ></v-text-field>

          <span
            class="span-legend"
            v-if="proposalToSave.commissionValue === 'HOMOLOGADO'"
          >
            DATA DE HOMOLOGAÇÃO
          </span>
          <v-text-field
            placeholder="DATA DE HOMOLOGAÇÃO"
            v-model="proposalToSave.homologDate"
            color="#34495e"
            outlined
            dense
            type="date"
            v-if="proposalToSave.commissionValue === 'HOMOLOGADO'"
          ></v-text-field>

          <span
            class="span-legend"
            v-if="proposalToSave.commissionValue === 'PERDIDA'"
          >
            MOTIVO DA PERDA
          </span>
          <v-textarea
            placeholder="MOTIVO DA PERDA"
            v-model="proposalToSave.losteMotive"
            color="#34495e"
            outlined
            dense
            v-if="proposalToSave.commissionValue === 'PERDIDA'"
          ></v-textarea>
        </v-col>
      </v-tab-item>
    </v-tabs>

    <v-col cols="12" v-if="!lockFields" class="pa-0">
      <v-card class="d-flex justify-center footer" elevation="2">
        <v-btn
          text
          class="mt-2 mr-2 btn-option"
          @click="exportData"
          :loading="loadingExport"
          small
        >
          Exportar
        </v-btn>

        <v-btn
          text
          class="mt-2 mr-2 btn-option"
          @click="importData"
          :loading="loadingImport"
          small
        >
          Importar
        </v-btn>

        <v-btn
          text
          class="mt-2 mr-2 btn-option"
          @click="saveAsProposal(false)"
          :loading="loadingSaveProposal"
          small
          :disabled="!proposalToSave.situation"
        >
          Finalizar
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
                `Todos os dados deste orçamento serão perdidos. Deseja continuar com a deleção?`
              }}
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text small @click="deleteMenu = false"> Cancelar </v-btn>
              <v-btn small text @click="deleteBudget" color="#b51414">
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-card>
    </v-col>

    <v-col cols="12" v-else class="d-flex justify-center footer">
      <v-btn text class="mt-2 mr-2 btn-option" @click="addFile = true" small>
        Adicionar arquivo
      </v-btn>

      <v-btn
        text
        class="mt-2 mr-2 btn-option"
        @click="importData"
        :loading="loadingImport"
        small
      >
        Importar
      </v-btn>

      <v-btn
        text
        class="mt-2 mr-2 btn-option"
        @click="saveAsProposal(true)"
        :loading="loadingSaveProposal"
        small
        :disabled="
          !proposalToSave.value ||
          !proposalToSave.laborValue ||
          !proposalToSave.situation
        "
      >
        Salvar Edição
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
              `Todos os dados deste orçamento serão perdidos. Deseja continuar com a deleção?`
            }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text small @click="deleteMenu = false"> Cancelar </v-btn>
            <v-btn small text @click="deleteBudget" color="#b51414">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-col>

    <v-dialog
      v-model="importModal"
      persistent
      max-width="1000"
      overlay-opacity="0.93"
    >
      <v-card min-height="400">
        <v-toolbar flat color="#304156" dark>
          <v-toolbar-title class="title-card"> Importar </v-toolbar-title>
          <v-btn icon @click="importModal = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mb-0 mt-3">
          <div class="text--primary mb-5">
            <span class="desc-fields">
              <b style="font-weight: 500">
                Lembre-se de seguir a ordem a seguir dos campos:
              </b>
              Valor da proposta, Data da proposta, Validade da proposta,
              Potência do sistema, Consumo considerado, Geração em kWh, Valor da
              conta atual, Valor da nova conta, Quantidade de módulos, Módulos,
              Quant. inversor 1, Inversor 1, Quant. inversor 2, Inversor 2, Área
              necessária, Modalidade, Margem de lucro líquido, Valor da
              comissão, Situação e Data de fechamento.
            </span>
          </div>

          <budget-import
            ref="importUpload"
            class="upload-container"
            type="import"
            @save-import-data="saveImportData"
          >
          </budget-import>
        </v-card-text>

        <v-card-actions class="pb-4 mr-4">
          <v-spacer></v-spacer>
          <v-btn @click="importModal = false" color="#34495e" small dark>
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addFile"
      persistent
      max-width="1000"
      overlay-opacity="0.93"
    >
      <v-card>
        <v-toolbar flat color="#304156" dark>
          <v-toolbar-title class="title-card">
            Adicionar arquivo
          </v-toolbar-title>
          <v-btn icon @click="addFile = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mb-0 mt-6">
          <base-upload
            ref="baseUpload"
            class="upload-container"
            type="proposal"
            :savedBudgetId="proposalToSave.id"
            filesType="Você pode adicionar arquivos do tipo CSV ou TXT"
            acceptType=""
          ></base-upload>
        </v-card-text>

        <v-card-actions class="pb-4 mr-4">
          <v-spacer></v-spacer>
          <v-btn @click="sendFile" color="#34495e" small dark>
            <v-icon small class="mr-1">check</v-icon>
            Pronto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import Component from "../Notification.vue";
import BaseEmpty from "@/components/Shared/BaseEmptyComponent";
import BaseUpload from "@/components/Shared/BaseUploadComponent";
import BudgetImport from "./BudgetImport.vue";
import {
  postProposal,
  putProposal,
  deleteBudget,
} from "@/services/OrderService.js";
import { mapState } from "vuex";

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

const fieldList = [
  "value",
  "inverterBrand",
  "supplierName",
  "systemPower",
  "consideredConsumption",
  "typeOfModules",
  "newAccountValue",
  "kitValue",
  "quantityModules",
  "brandOfModules",
  "quantityInverter1",
  "inverterType1",
  "quantityInverter2",
  "inverterType2",
  "requiredArea",
  "modality",
  "typeOfPlant",
  "laborValue",
  "commissionValue",
  "averageAccountValue",
];

export default {
  data: () => ({
    emailRules: [
      (v) => !!v || "E-mail é obrigatório",
      (v) => /.+@.+/.test(v) || "E-mail deve ser válido",
    ],

    price: 123.45,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "R$ ",
      suffix: "",
      precision: 2,
      masked: false,
    },

    isReq1: false,
    isReq2: false,
    isReq3: false,
    isReq4: false,
    positionX: null,
    positionY: null,
    menuTrackCode: false,
    trackCode: "",
    importModal: false,
    emailToSend: "",
    proposalToSave: {},
    lockFields: false,
    loadingSaveProposal: false,
    loadingImport: false,
    loadingExport: false,
    deleteMenu: false,
    conditionList: [
      {
        name: "COM PENDÊNCIAS",
        value: "PENDENTE",
      },
      {
        name: "VÁLIDA",
        value: "FINALIZADO",
      },
    ],

    translate: {
      UBERLANDIA: "Uberlândia",
      BRASILIA: "Brasília",
      FRANCA: "Franca",
      PASSOS: "Passos",
      ALL: "Usuário ROOT",
    },

    situationList: [
      "PRONTO",
      "VISITA TÉCNICA",
      "FECHADA",
      "EM OBRAS",
      "INSTALADO",
      "HOMOLOGADO",
      "PERDIDA",
    ],

    imageList: [],
    imageProposalList: [],
    tab: "tab-1",
    addFile: false,
    budget: [],
    client: [],
  }),

  created() {
    this.listFiles();
    this.listProposalFiles();

    if (this.selectedBudget) {
      this.selectedBudget.email &&
        (this.emailToSend = this.selectedBudget.email);

      this.selectedBudget.id &&
        (this.proposalToSave.proposalNumber = this.selectedBudget.id);
    }

    const self = this;
    if (this.selectedBudget) {
      Object.keys(this.selectedBudget).forEach(function (item) {
        if (
          item !== "fileList" &&
          item !== "client" &&
          item !== "proposalResponseDTOS"
        ) {
          if (self.selectedBudget[item]) {
            if (
              item !== "masterName" &&
              item !== "createdDate" &&
              item !== "requestToken"
            ) {
              self.budget.push({
                title: translate[item],
                description: self.selectedBudget[item],
              });
            } else if (item === "createdDate") {
              self.budget.push({
                title: translate[item],
                description: self.formatDate(self.selectedBudget[item]),
              });
            } else if (item === "masterName") {
              self.budget.push({
                title: translate[item],
                description: masterList[self.selectedBudget[item]],
              });
            } else {
              self.budget.push({
                title: translate[item],
                description: self.getConsulor(self.selectedBudget[item]),
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

      Object.keys(this.selectedBudget.client).forEach(function (item) {
        if (
          item !== "id" &&
          item !== "requestToken" &&
          item !== "budgetResponseDTOList" &&
          item !== "logResponseDTOList" &&
          item !== "masterName"
        ) {
          if (self.selectedBudget.client[item]) {
            if (item !== "personType") {
              self.client.push({
                title: translate[item],
                description: self.selectedBudget.client[item],
              });
            } else {
              self.client.push({
                title: translate[item],
                description: personList[self.selectedBudget.client[item]],
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
    }

    if (
      this.selectedBudget &&
      this.selectedBudget.proposalResponseDTOS &&
      this.selectedBudget.proposalResponseDTOS[0] &&
      this.selectedBudget.proposalResponseDTOS[0].id
    ) {
      this.proposalToSave = this.selectedBudget.proposalResponseDTOS[0];
      this.lockFields = true;
    } else {
      this.lockFields = false;
    }
  },

  methods: {
    checkIsImage(item) {
      return (
        item.includes("jpg") ||
        item.includes("jpeg") ||
        item.includes("png") ||
        item.includes("gif")
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
        return "Não informado";
      }
    },

    confirmClotheSent() {
      this.$toast.success(
        <Component title="Sucesso" subtitle="Pedido foi enviado."></Component>,
        { hideProgressBar: true, timeout: 2000 }
      );
    },

    saveImportData(data) {
      const importDataContent = data.result.replace(/(\r\n|\n|\r)/gm, "");
      const splitedText = data.splitedText;
      this.loadingImport = true;

      fieldList.forEach((element) => {
        this.proposalToSave[element] = null;
      });

      if (importDataContent) {
        const splitedDate = importDataContent.split(splitedText);
        splitedDate.forEach((element, index) => {
          if (fieldList[index]) {
            this.proposalToSave[fieldList[index]] = element;
          }
        });
      }

      this.importModal = false;
      this.loadingImport = false;
      this.tab = "tab-3";

      this.$toast.success(
        <Component title="Sucesso" subtitle="Dados importados."></Component>,
        {
          hideProgressBar: true,
          timeout: 2000,
        }
      );
    },

    exportData() {
      let csvContent = "data:text/csv;charset=utf-8,";
      let budgetList = "";
      let clientList = "";

      this.budget.forEach((element) => {
        const value = element.description;
        budgetList =
          budgetList === ""
            ? budgetList + `${element.title};${value}`
            : budgetList + "\r\n" + `${element.title};${value}`;
      });

      this.client.forEach((element) => {
        const value = element.description;
        clientList =
          clientList === ""
            ? clientList + `${element.title};${value}`
            : clientList + "\r\n" + `${element.title};${value}`;
      });

      csvContent += "CLIENTE\r\n" + clientList + "\r\n" + "\r\n" + "\r\n";
      csvContent +=
        "DADOS DO ORÇAMENTO\r\n" + budgetList + "\r\n" + "\r\n" + "\r\n";

      var encodedUri = encodeURI(csvContent);

      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", this.selectedBudget.client.name + ".csv");
      document.body.appendChild(link);
      link.click();
    },

    importData() {
      this.importModal = true;
    },

    deleteBudget() {
      deleteBudget(this.selectedBudget.id)
        .then(() => {
          this.$toast.success(
            <Component
              title="Sucesso"
              subtitle="Orcamento deletado com sucesso."
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
              subtitle="Infelizmente não é possível deletar este orçamento"
            ></Component>,
            {
              hideProgressBar: true,
              timeout: 2000,
            }
          );
        })
        .finally(() => {
          this.isLoading = true;
          this.loadingSaveProposal = true;
          this.$emit("reload-list");
        });
    },

    saveAsProposal(isEdit = false) {
      this.loadingSaveProposal = true;
      this.proposalToSave.requestToken = this.selectedBudget.requestToken;
      this.proposalToSave.updateDate = new Date().toISOString().substr(0, 10);
      this.proposalToSave.masterName = this.selectedBudget.masterName;
      this.proposalToSave.budgetId = this.selectedBudget.id;
      this.proposalToSave.budgetist = this.storeUser.name;

      isEdit
        ? putProposal(this.proposalToSave)
            .then(() => {
              this.$toast.success(
                <Component
                  title="Sucesso"
                  subtitle="Proposta editada."
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
                  title="Erro ao editar proposta"
                  subtitle="Por favor revise os dados e tente novamente"
                ></Component>,
                {
                  hideProgressBar: true,
                  timeout: 2000,
                }
              );
            })
            .finally(() => {
              this.isLoading = true;
              this.loadingSaveProposal = true;
              this.$emit("reload-list");
            })
        : postProposal(this.proposalToSave)
            .then(() => {
              this.$toast.success(
                <Component
                  title="Sucesso"
                  subtitle="Proposta adicionado."
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
                  title="Erro ao cadastrar proposta"
                  subtitle="Por favor revise os dados e tente novamente"
                ></Component>,
                {
                  hideProgressBar: true,
                  timeout: 2000,
                }
              );
            })
            .finally(() => {
              this.isLoading = true;
              this.loadingSaveProposal = true;
              this.$emit("reload-list");
            });
    },

    listFiles() {
      var storageRef = firebase
        .storage()
        .ref(`budget-${this.selectedBudget.id}/`);

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
        .ref(`proposal-${this.proposalToSave.id}/`);

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

    sendFile() {
      this.imageProposalList = [];
      this.listProposalFiles();
      this.addFile = false;
      this.$toast.success(
        <Component
          title="Sucesso"
          subtitle="Arquivos adicionados com sucesso."
        ></Component>,
        { hideProgressBar: true, timeout: 2000 }
      );
    },

    openUrl(item) {
      window.open(item);
    },

    enlargeImage(item) {
      window.open(item, "_blank");
    },
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
  },

  props: {
    selectedBudget: {
      type: Object,
      required: true,
      default: () => {},
    },
    type: {
      type: String,
    },

    userList: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  components: {
    BaseEmpty,
    BaseUpload,
    BudgetImport,
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

.desc-fields {
  font-weight: 300;
  font-size: 12px;
  text-transform: uppercase;
}
</style>
