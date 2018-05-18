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
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="name" header-name="이름" :width="300"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/process/show/${id}', query:$route.query}"/>
        <ag-grid-column field="typeName" header-name="분류" :width="150"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabels, valueField:'value', labelField: 'label'}"
                        :cell-style="{textAlign: 'center'}"/>
        <ag-grid-column field="difficulty" header-name="난이도" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-style="{textAlign: 'center'}"
                        :cell-renderer-params="{array:difficultyLabels, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="managerName" header-name="담당자" :width="150"/>

        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="150"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="유형을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="유형" v-model="filters.processTypeId"
                               :label.sync="filters.processTypeName" :options="typeLabels"
                               label-field="label" value-field="value" clearable
                               @search="onProcessTypeSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="품목을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="품목" v-model="filters.itemId"
                               :label.sync="filters.itemName" :options="itemLabels"
                               label-field="label" value-field="value" clearable
                               @search="onItemSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
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

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.processTypeId"
                           :print-value="filters.processTypeName" label="유형"/>
      <c-list-filter-label slot="filter-label" v-model="filters.itemId"
                           :print-value="filters.itemName" label="품목"/>
      <c-list-filter-label slot="filter-label" v-model="filters.managerId"
                           :print-value="filters.managerName" label="담당자"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import { DataAdjuster } from 'src/model/data'
  import { UserLabelArray } from 'src/model/user'
  import {
    ProcessDifficultyArray,
    ProcessPaginationArray,
    ProcessStatusArray,
    ProcessTypeLabelArray
  } from 'src/model/process'
  import { ItemLabelArray } from 'src/model/item'

  export default {
    data () {
      return {
        array: new ProcessPaginationArray(),
        typeLabels: new ProcessTypeLabelArray(),
        itemLabels: new ItemLabelArray(),
        userLabels: new UserLabelArray(),
        statusLabels: new ProcessStatusArray(),
        difficultyLabels: new ProcessDifficultyArray(),
        filters: {
          name: null,
          processTypeId: null,
          processTypeName: null,
          itemId: null,
          itemName: null,
          managerId: null,
          managerName: null
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
      this.typeLabels.query()
      this.statusLabels.fetch()
      this.difficultyLabels.fetch()
      this.userLabels.query()
      this.itemLabels.query()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onProcessTypeSearch (keyword, done) {
        await this.typeLabels.query(keyword)
        done()
      },
      async onItemSearch (keyword, done) {
        await this.itemLabels.query(keyword)
        done()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },

    },
    computed: {}
  }
</script>
