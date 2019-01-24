<template>
  <q-search ref="input" v-model="text">
    <q-autocomplete
        ref="autocomplete"
        @search="onSearch"
        @selected="onSelected"
        @show="onShow"
        @hide="onHide"
        :min-characters="0"
        :value-field="valueField"
    />
  </q-search>
  <!--
  <c-autocomplete-select ref="input" v-model="model"
                         :label="label" :options="options"
                         :label-field="labelField" :value-field="valueField"
                         @search="onSearch">
    <template slot="option" slot-scope="option">
      {{option.label}}<br>
      {{option.stamp}} - {{option.subLabel}}
    </template>
  </c-autocomplete-select>
  -->
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-autocomplete-select-editor',
    methods: {
      refresh() {
      },
      getValue() {
        return this.model
      },
      isPopup() {
        return true
      },
      async afterGuiAttached() {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      },
      async onSearch(keyword, done) {
        await this.params.onSearch(keyword)
        done(this.options)
      },
      async onSelected(item, keyword) {
        this.model = item[this.valueField]
        this.params.api.stopEditing()
      },
      onShow() {
        const popover = this.$refs.autocomplete.$refs.popover.$el
        const activePopupElements = this.params.api.gridCore.popupService.activePopupElements
        activePopupElements.push(popover)
      },
      onHide() {
        const popover = this.$refs.autocomplete.$refs.popover.$el
        const activePopupElements = this.params.api.gridCore.popupService.activePopupElements
        const index = activePopupElements.indexOf(popover)
        this.params.api.gridCore.popupService.activePopupElements.slice(index, 1)
      }
    },
    data() {
      return {
        text: '',
        model: null
      }
    },
    watch: {},
    computed: {
      options() {
        return this.params.options
      },
      labelField() {
        return this.params.labelField
      },
      valueField() {
        return this.params.valueField
      }
    },
    mounted() {
      /*this.$el.querySelector('input').addEventListener('input', (event) => {
        this.model = event.target.value
      })*/
    }
  }
</script>

<style>
</style>
