export default Object.freeze({
  REGEXP: {
    onlyNumbers: /^[0-9.]+$/,
    singleBrackets: /\${([^)]+)\}/g,
    multipleBrackets: /\$(.*?)\$/g,
    /*eslint-disable */
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    /*eslint-enable */
  },

  TYPE: {
    LONG: "Longo",
    SHORT: "Curto",
    MID: "Médio",
  },

  CATEGORY: {
    PARTY_DRESS: "Festa",
    CASUAL_DRESS: "Casual",
    FORMAL_DRESS: "Formal",
    MARRIAGE_DRESS: "Casamento",
    PROM_DRESS: "Promoção",
  },

  FIELDS: {
    proposalNumber: "NÚMERO DA PROPOSTA",
    value: "VALOR",
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
  }
});
