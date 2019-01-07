<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" class="col-grow"
                 prevent-route filter-opened prevent-query-string>

      <!-- action -->

      <div slot="action">
        <q-item-tile label>공정 유형 검색</q-item-tile>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               :row-selection="rowSelection"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               @selection-changed="onGridSelectionChanged"
               :row-data="array">
        <ag-grid-column :checkbox-selection="true" :width="60"/>
        <ag-grid-column field="id" header-name="아이디" :width="150"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="infoTypeName" header-name="분류" :width="150"/>

        <ag-grid-column field="baseUnitCost" header-name="기준단가" :width="100"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"
                        :cell-style="{textAlign: 'right'}"/>

        <ag-grid-column field="createdBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="분류를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="분류" v-model="filters.processInfoTypeId"
                               :label.sync="filters.processInfoTypeName"
                               :options="infoTypeLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onProcessInfoTypeSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.processInfoTypeId"
                           :print-value="filters.processInfoTypeName" label="분류"/>
      <!-- filter -->

    </c-list-view>

    <q-toolbar>
      <q-btn flat icon="arrow_back" v-close-overlay>이전</q-btn>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat icon="check" @click="onSelected" :disabled="!selectable">선택</q-btn>
    </q-toolbar>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {ProcessInfoTypeLabelArray, ProcessTypePaginationArray} from 'src/model/process'

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        array: new ProcessTypePaginationArray(),
        infoTypeLabelArray: new ProcessInfoTypeLabelArray(),
        filters: {
          name: null
        },
        selectable: false,
        dataAdjuster: null
      }
    },
    watch: {
      'filters': {
        deep: true,
        handler() {
          this.dataAdjuster.adjust()
        }
      }
    },
    async mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      await this.infoTypeLabelArray.fetch()
      await this.array.fetch()
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onProcessInfoTypeSearch(keyword) {
        await this.infoTypeLabelArray.fetch(keyword)
      },
      async onGridSelectionChanged(event) {
        const selected = event.api.getSelectedRows()
        this.selectable = selected.length > 0
      },
      onSelected() {
        const selected = this.$refs.grid.api.getSelectedRows()
        if (selected.length) {
          this.$emit('selected', selected)
        } else {
          this.$alert.warning('선택한 공정 유형이 없습니다')
        }
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      }
    }
  }
</script>
