<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow">

      <!-- action -->

      <div slot="action">
        <router-link :to="{ path: '/process-type/create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/process-type/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="infoTypeName" header-name="분류" :width="150"/>
        <ag-grid-column field="baseUnitCost" header-name="기준단가" :width="150"/>

        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>

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
                               :label.sync="filters.processInfoTypeName" :options="infoTypeLabels"
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
  </q-page>

</template>
<script>
  import { DataAdjuster } from 'src/model/data'
  import { UserLabelArray } from 'src/model/user'
  import { ProcessTypePaginationArray, ProcessInfoTypeLabelArray } from 'src/model/process'
  import * as _ from 'lodash'

  export default {
    data () {
      return {
        array: new ProcessTypePaginationArray(),
        infoTypeLabels: new ProcessInfoTypeLabelArray(),
        filters: {
          name: null,
          processInfoTypeId: null,
          processInfoTypeName: null
        },
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
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      this.infoTypeLabels.query()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onProcessInfoTypeSearch (keyword, done) {
        await this.infoTypeLabels.query(keyword)
        done()
      }
    },
    computed: {}
  }
</script>
