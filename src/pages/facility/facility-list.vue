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
        <router-link :to="{ path: '/facility/create', query: $route.query}"
                     v-if="$authorized.facilityManager">
          <q-btn flat icon="add">생성</q-btn>
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
        <ag-grid-column field="name" header-name="이름" :width="300"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/facility/show/${id}', query:$route.query}"/>
        <ag-grid-column field="categoryId" header-name="분류" :width="150"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:categoryLabelArray, valueField:'value', labelField: 'label'}"
                        :cell-style="{textAlign: 'center'}"/>
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

        <c-autocomplete-select float-label="분류" v-model="filters.categoryId"
                               :label.sync="filters.categoryName" :options="categoryLabelArray"
                               label-field="label" value-field="value" clearable>
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.categoryId"
                           :print-value="filters.categoryName" label="분류"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {FacilityCategoryLabelArray, FacilityPaginationArray} from 'src/model/facility'

  export default {
    authorized: {
      'facilityManager': 'hasRole(\'FACILITY_MANAGER\')'
    },
    data() {
      return {
        array: new FacilityPaginationArray(),
        categoryLabelArray: new FacilityCategoryLabelArray(),
        filters: {
          name: null,
          categoryId: null,
          categoryName: null
        },
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
    mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      this.categoryLabelArray.fetch()
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      }
    },
    computed: {}
  }
</script>
