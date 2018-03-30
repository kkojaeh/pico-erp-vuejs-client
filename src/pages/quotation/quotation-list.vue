<template>
  <div>
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination>

      <!-- action -->

      <div slot="action">
        <router-link :to="{ path: '/company/create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid" class="ag-theme-material"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-link-renderer"
                        :cell-renderer-params="{path:'/company/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="registrationNumber" header-name="사업자(DUNS)번호" :width="170"
                        cell-renderer-framework="ag-grid-cleave-renderer"
                        :cell-renderer-params="{cleaveOptions:{ delimiter: '-', blocks: [3, 2, 5]}}"/>
        <ag-grid-column field="representative" header-name="대표자" :width="100"/>
        <ag-grid-column field="telephoneNumber" header-name="전화번호" :width="130"
                        cell-renderer-framework="ag-grid-phone-number-renderer"/>
        <ag-grid-column field="mobilePhoneNumber" header-name="핸드폰번호" :width="130"
                        cell-renderer-framework="ag-grid-phone-number-renderer"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fa-building-o" helper="견적의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select ref="statuses" float-label="상태" v-model="filters.statuses"
                  :options="statusLabels" multiple></q-select>
      </q-field>

      <q-field slot="filter" icon="check_circle" helper="활성화된 회사만 포함 합니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-toggle label="활성화 여부" clearable v-model="filters.enabled"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses"
                           :print-value="statusesLabel"
                           label="상태"/>
      <!-- filter -->

    </c-list-view>
  </div>

</template>
<script>
  import { DataAdjuster } from 'src/model/data'
  import {
    QuotationPaginationArray,
    QuotationSatusArray,
    QuotationExpiryPolicyArray
  } from './quotation-model'

  import { CompanyLabelArray } from 'src/pages/company/company-model'

  export default {
    data () {
      return {
        array: new QuotationPaginationArray(),
        statusLabels: new QuotationSatusArray(),
        expiryPolicyLabels: new QuotationExpiryPolicyArray(),
        companies: new CompanyLabelArray(),
        filters: new {
          name: null,
          statuses: []
        },
        dataAdjuster: null
      }
    },
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      this.statusLabels.fetch()
      this.expiryPolicyLabels.fetch()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      }
    },
    computed: {
      statusesLabel () {
        return this.filters.statuses.map(
          value => this.statusLabels.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
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

    components: {}
  }
</script>
