<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <router-link :to="{ path: '/project/create', query: $route.query}">
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
        <ag-grid-column field="name" header-name="이름" :width="200"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/project/show/${id}', query:$route.query}"/>

        <ag-grid-column field="customer.name" header-name="고객사명" :width="150"/>
        <ag-grid-column field="manager.name" header-name="담당자명" :width="120"/>

        <ag-grid-column field="customerManagerContact.name" header-name="고객사 담당자명" :width="120"/>
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

      <q-field slot="filter" icon="account_box" helper="담당자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="담당자" v-model="filters.managerId"
                               :label.sync="filters.managerName" :options="userLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onManagerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="생성일 ~부터" v-model="filters.startCreatedDate"
                    type="date"/>
        <!--filters.startCreatedDate-->
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(까지)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime prefix="~" float-label="생성일 ~까지" v-model="filters.endCreatedDate"
                    type="date"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="품목을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input :prefix="filters.itemCode" float-label="품목" :value="filters.itemName" clearable
                 readonly
                 :after="[{ icon:'search', handler:onItemSearch}, { icon:'clear', condition: !!filters.itemId, handler:onItemClear}]"/>
      </q-field>


      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.customerId"
                           :print-value="filters.customerName" label="고객사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.managerId"
                           :print-value="filters.managerName" label="담당자"/>
      <c-list-filter-label slot="filter-label" v-model="filters.itemId"
                           :print-value="`[${filters.itemCode}] ${filters.itemName}`" label="품목"
                           @remove="onItemClear"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ProjectPaginationArray} from 'src/model/project'

  export default {
    data () {
      return {
        array: new ProjectPaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        filters: {
          name: null,
          customerId: null,
          customerName: null,
          managerId: null,
          managerName: null,
          customerManagerName: null,
          startCreatedDate: null,
          endCreatedDate: null,
          itemId: null,
          itemCode: null,
          itemName: null
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
      this.companyLabelArray.fetch()
      this.userLabelArray.fetch()
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
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onCustomerSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onItemSearch() {
        const itemModels = await this.$selectItem({})
        if (!itemModels) {
          return
        }
        itemModels.forEach(itemModel => {
          this.filters.itemCode = itemModel.code
          this.filters.itemName = itemModel.name
          this.filters.itemId = itemModel.id
        })
      },
      onItemClear() {
        this.filters.itemCode = null
        this.filters.itemName = null
        this.filters.itemId = null
      },
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
              e.customer = await CompanyModel.get(e.customerId, true)
              e.manager = await UserModel.get(e.managerId, true)
            })
        )
        this.$redrawGrids()
      }
    },
    computed: {}
  }
</script>
