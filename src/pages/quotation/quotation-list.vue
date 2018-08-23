<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <router-link :to="{ path: '/quotation/create', query: $route.query}">
          <q-btn flat icon="add" label="생성"></q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="name" header-name="이름" :width="230"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/quotation/show/${id}', query:$route.query}"/>
        <ag-grid-column field="revision" header-name="버전" :width="90"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabels, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="projectName" header-name="프로젝트" :width="170"/>
        <ag-grid-column field="customerName" header-name="고객사" :width="170"/>
        <ag-grid-column field="managerName" header-name="담당자" :width="120"/>
        <ag-grid-column field="committedDate" header-name="제출시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
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

      <q-field slot="filter" icon="account_box" helper="담당자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="담당자" v-model="filters.managerId"
                               :label.sync="filters.managerName" :options="userLabels"
                               label-field="label" value-field="value" clearable
                               @search="onManagerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="프로젝트를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="프로젝트" v-model="filters.projectId"
                               :label.sync="filters.projectName" :options="projectLabels"
                               label-field="label" value-field="value" clearable
                               @search="onProjectSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="고객사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="고객사" v-model="filters.customerId"
                               :label.sync="filters.customerName" :options="companyLabels"
                               label-field="label" value-field="value" clearable
                               @search="onCustomerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="견적의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabels" multiple></q-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="생성일 ~부터" v-model="filters.startCreatedDate"
                    type="date"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(까지)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime prefix="~" float-label="생성일 ~까지" v-model="filters.endCreatedDate"
                    type="date"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.projectId"
                           :print-value="filters.projectName" label="프로젝트"/>
      <c-list-filter-label slot="filter-label" v-model="filters.customerId"
                           :print-value="filters.customerName" label="고객사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses"
                           :print-value="statusesLabel" :clear-value="[]"
                           label="상태"/>
      <c-list-filter-label slot="filter-label" v-model="filters.startCreatedDate"
                           suffix="~" label="생성일"/>
      <c-list-filter-label slot="filter-label" v-model="filters.endCreatedDate"
                           prefix="~" label="생성일"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {
    QuotationExpiryPolicyArray,
    QuotationPaginationArray,
    QuotationStatusArray
  } from 'src/model/quotation'

  import {CompanyLabelArray} from 'src/model/company'
  import {ProjectLabelArray} from 'src/model/project'
  import {UserLabelArray} from 'src/model/user'

  export default {
    data () {
      return {
        array: new QuotationPaginationArray(),
        statusLabels: new QuotationStatusArray(),
        expiryPolicyLabels: new QuotationExpiryPolicyArray(),
        companyLabels: new CompanyLabelArray(),
        projectLabels: new ProjectLabelArray(),
        userLabels: new UserLabelArray(),
        filters: {
          name: null,
          projectId: null,
          projectName: null,
          customerId: null,
          customerName: null,
          managerId: null,
          managerName: null,
          startCreatedDate: null,
          endCreatedDate: null,
          statuses: ['DRAFT', 'COMMITTED', 'IN_NEGOTIATION', 'PREPARED']
        },
        dataAdjuster: null
      }
    },
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {
        startCreatedDate: {
          type: Date,
          firstTime: true
        },
        endCreatedDate: {
          type: Date,
          lastTime: true
        }
      })
      this.statusLabels.fetch()
      this.expiryPolicyLabels.fetch()
      this.companyLabels.query()
      this.projectLabels.query()
      this.userLabels.query()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onCustomerSearch (keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onProjectSearch (keyword, done) {
        await this.projectLabels.query(keyword)
        done()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
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
