<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 prevent-route filter-opened prevent-query-string>

      <!-- action -->

      <div slot="action">
        <q-item-tile label>품목 검색</q-item-tile>
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
        <ag-grid-column field="code" header-name="코드" :width="120"/>
        <ag-grid-column field="externalCode" header-name="외부코드" :width="150"/>
        <ag-grid-column field="name" header-name="이름" :width="300"/>
        <ag-grid-column field="customerName" header-name="고객사" :width="150"/>
        <ag-grid-column field="categoryPath" header-name="분류" :width="250"/>
        <ag-grid-column field="unit" header-name="단위" :width="90" align="center"/>
        <ag-grid-column field="type" header-name="유형" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:typeLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>

        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="200"
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

      <q-field slot="filter" icon="account_circle" helper="코드와 외부코드에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="코드" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-comment" helper="품목의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabelArray" multiple chips></q-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-comment" helper="품목의 유형을 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="유형" v-model="filters.types"
                  :options="typeLabelArray" multiple chips></q-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="고객사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="고객사" v-model="filters.customerId"
                               :label.sync="filters.customerName" :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCustomerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-tag" helper="품목 분류를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="분류" v-model="filters.categoryId"
                               :label.sync="filters.categoryName" :options="categoryLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCategorySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}[{{option.stamp}}]<br>
            {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="monetization_on" helper="구매 가능 여부를 체크하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-checkbox label="구매가능" v-model="filters.purchasable"/>
      </q-field>

      <q-field slot="filter" icon="monetization_on" helper="판 가능 여부를 체크하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-checkbox label="판매가능" v-model="filters.salable"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.code" label="코드"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses" label="상태"
                           :print-value="statusesLabel" :clear-value="[]"/>
      <c-list-filter-label slot="filter-label" v-model="filters.types" label="유형"
                           :print-value="typesLabel" :clear-value="[]"/>
      <c-list-filter-label slot="filter-label" v-model="filters.customerId"
                           :print-value="filters.customerName" label="고객사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.categoryId"
                           :print-value="filters.categoryName" label="분류"/>
      <c-list-filter-label slot="filter-label" v-model="filters.purchasable" label="구매가능"
                           true-label="가능" false-label="불가" :clear-value="null"/>
      <c-list-filter-label slot="filter-label" v-model="filters.salable" label="판매가능"
                           true-label="가능" false-label="불가" :clear-value="null"/>

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
  import {
    ItemCategoryLabelArray,
    ItemPaginationArray,
    ItemStatusArray,
    ItemTypeArray
  } from 'src/model/item'
  import {CompanyLabelArray} from 'src/model/company'
  import * as _ from 'lodash'

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      defaultFilters: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        array: new ItemPaginationArray(),
        categoryLabelArray: new ItemCategoryLabelArray(),
        statusLabelArray: new ItemStatusArray(),
        typeLabelArray: new ItemTypeArray(),
        companyLabelArray: new CompanyLabelArray(),
        filters: {
          name: null,
          code: null,
          customerId: null,
          customerName: null,
          categoryId: null,
          categoryName: null,
          purchasable: null,
          salable: null,
          statuses: [],
          types: []
        },
        selectable: false,
        dataAdjuster: null
      }
    },
    watch: {
      'filters': {
        deep: true,
        handler () {
          this.dataAdjuster.adjust()
        }
      }
    },
    async mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.typeLabelArray.fetch(),
        this.categoryLabelArray.fetch(),
        this.companyLabelArray.fetch()
      ]),
          _.assign(this.filters, this.defaultFilters)
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onCustomerSearch (keyword, done) {
        await this.companyLabelArray.fetch(keyword)
        done()
      },
      async onCategorySearch (keyword, done) {
        await this.categoryLabelArray.fetch(keyword)
        done()
      },
      async onGridSelectionChanged (event) {
        const selected = event.api.getSelectedRows()
        this.selectable = selected.length > 0
      },
      onSelected() {
        const selected = this.$refs.grid.api.getSelectedRows()
        if (selected.length) {
          this.$emit('selected', selected)
        } else {
          this.$alert.warning('선택한 품목이 없습니다')
        }
      }
    },
    computed: {
      rowSelection () {
        return this.multiple ? 'multiple' : 'single'
      },
      statusesLabel () {
        return this.filters.statuses.map(
            value => this.statusLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      },
      typesLabel () {
        return this.filters.types.map(
            value => this.typeLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
