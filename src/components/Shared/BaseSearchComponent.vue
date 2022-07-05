<template>
  <v-container class="py-0 px-1 base-search" fluid>
    <v-row dense>
      <v-text-field
        v-model="search"
        solo
        :label="$t('GLOBAL.search')"
        clearable
        :value="$emit('filteredDataList', filteredDataList)"
        :hide-details="true"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "BaseSearch",
  data() {
    return {
      search: null
    };
  },
  watch: {
    search(value) {
      this.$emit("termOfSearch", value);
    }
  },
  props: {
    dataList: {
      type: Array,
      required: true
    },
    typeFilter: {
      type: String,
      required: true
    },
    termToSearch: {
      type: String,
      required: true
    }
  },
  computed: {
    filteredDataList() {
      return this.search && this.dataList[0]
        ? this.getFilterType()
        : this.dataList;
    }
  },
  methods: {
    simpleFilter() {
      return this.dataList.filter(
        data =>
          this.dataList &&
          data[this.termToSearch]
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    },
    someValueToReturnObject() {
      return this.dataList.map(
        (obj) =>
          obj.nodes.some(node =>
            node[this.termToSearch]
              .toLowerCase()
              .includes(this.search.toLowerCase())
          ) && obj
      );
    },
    getFilterType() {
      if (this.typeFilter === "simpleFilter") {
        return this.simpleFilter();
      } else if (this.typeFilter === "someValueToReturnObject") {
        return this.someValueToReturnObject();
      }
    }
  }
};
</script>

<style lang="scss">
</style>

