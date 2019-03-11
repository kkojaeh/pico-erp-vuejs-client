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
        <router-link :to="{ path: '/warehouse-transaction-request/create', query: $route.query}">
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
        <ag-grid-column field="code" header-name="코드" :width="100"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/warehouse-transaction-request/show/${id}', query:$route.query}"
                        :cell-style="{textAlign: 'center'}"/>

        <ag-grid-column field="transactionCompany.name" header-name="거래 회사" :width="150"
                        suppress-sorting/>
        <ag-grid-column field="station.name" header-name="거래 위치" :width="120"/>
        <ag-grid-column field="dueDate" header-name="만기 일시" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-style="{textAlign: 'center'}"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="committedDate" header-name="제출시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="코드에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="코드" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="거래 회사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="입/출고사" v-model="filters.transactionCompanyId"
                               :label.sync="filters.transactionCompanyName"
                               :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCompanySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="요청자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="요청자" v-model="filters.createdById"
                               :label.sync="filters.createdByName" :options="userLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCreatedBySearch">
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
  import {UserLabelArray} from 'src/model/user'
  import {ItemSelector} from 'src/model/item'
  import {
    WarehouseStationModel,
    WarehouseTransactionRequestPaginationArray,
    WarehouseTransactionRequestStatusArray
  } from 'src/model/warehouse'

  export default {
    data() {
      return {
        array: new WarehouseTransactionRequestPaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        statusLabelArray: new WarehouseTransactionRequestStatusArray(),
        filters: {
          code: null,
          transactionCompanyId: null,
          transactionCompanyName: null,
          createdById: null,
          createdByName: null,
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
        handler() {
          this.dataAdjuster.adjust()
        }
      }
    },
    async mounted() {
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
      await Promise.all([
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.statusLabelArray.fetch()
      ])
    },
    methods: {
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
              e.transactionCompany = await CompanyModel.get(e.transactionCompanyId, true)
              e.station = await WarehouseStationModel.get(e.stationId, true)
            })
        )
        this.$redrawGrids()
      },
      async retrieve() {
        await this.$refs.listView.retrieve()
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onCreatedBySearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onItemSearch() {
        const itemSelector = new ItemSelector(this)
        if (!itemModels && itemModels.length) {
          return
        }
        const itemModels = await itemSelector.show()
        const itemModel = itemModels[0]
        this.filters.itemCode = itemModel.code
        this.filters.itemName = itemModel.name
        this.filters.itemId = itemModel.id
      },
      onItemClear() {
        this.filters.itemCode = null
        this.filters.itemName = null
        this.filters.itemId = null
      },
    },
    computed: {}
  }
</script>
