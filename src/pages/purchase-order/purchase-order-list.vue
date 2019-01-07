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
        <router-link :to="{ path: '/purchase-order/order/create', query: $route.query}">
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
        <ag-grid-column field="code" header-name="발주번호" :width="100"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/purchase-order/order/show/${id}', query:$route.query}"/>
        <ag-grid-column field="supplier.name" header-name="공급사" :width="120"/>
        <ag-grid-column field="receiver.name" header-name="인수사" :width="120"/>
        <ag-grid-column field="charger.name" header-name="담당자" :width="120"/>
        <ag-grid-column field="status" header-name="상태" :width="100"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="sentDate" header-name="전송일" :width="150"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="dueDate" header-name="만기일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="receivedDate" header-name="완료일" :width="150"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="발주번호에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="발주번호" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="프로젝트를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="프로젝트" v-model="filters.projectId"
                               :label.sync="filters.projectName" :options="projectLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onProjectSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="공급사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="공급사" v-model="filters.supplierId"
                               :label.sync="filters.supplierName" :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCompanySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="인수사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="인수사" v-model="filters.receiverId"
                               :label.sync="filters.receiverName" :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCompanySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="담당자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="담당자" v-model="filters.chargerId"
                               :label.sync="filters.chargerName" :options="userLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onUserSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="발주의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabelArray" multiple></q-select>
      </q-field>


      <q-field slot="filter" icon="fas fa-calendar" helper="만기일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="만기일 ~부터" v-model="filters.startDueDate"
                    type="date"/>
        <!--filters.startDueDate-->
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="만기일 범위(까지)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime prefix="~" float-label="만기일 ~까지" v-model="filters.endDueDate"
                    type="date"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-gift" helper="품목을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input :prefix="filters.itemCode" float-label="품목" :value="filters.itemName" clearable
                 readonly
                 :after="[{ icon:'search', handler:onItemSearch}, { icon:'clear', condition: !!filters.itemId, handler:onItemClear}]"/>
      </q-field>


      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.code" label="구매요청번호"/>
      <c-list-filter-label slot="filter-label" v-model="filters.projectId"
                           :print-value="filters.projectName" label="프로젝트"/>
      <c-list-filter-label slot="filter-label" v-model="filters.receiverId"
                           :print-value="filters.receiverName" label="인수사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.chargerId"
                           :print-value="filters.chargerName" label="담당자"
                           :immutable="!$authorized.purchaseRequestManager"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses"
                           :print-value="statusesLabel" :clear-value="[]"
                           label="상태"/>
      <c-list-filter-label slot="filter-label" v-model="filters.itemId"
                           :print-value="`[${filters.itemCode}] ${filters.itemName}`" label="품목"
                           @remove="onItemClear"/>
      <c-list-filter-label slot="filter-label" v-model="filters.startDueDate"
                           suffix="~" label="만기일"/>
      <c-list-filter-label slot="filter-label" v-model="filters.endDueDate"
                           prefix="~" label="만기일"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {
    PurchaseOrderPaginationArray,
    PurchaseOrderStatusArray
  } from 'src/model/purchase-order'

  export default {
    authorized: {
      'purchaseOrderManager': 'hasRole(\'PURCHASE_ORDER_MANAGER\')'
    },
    data() {
      return {
        array: new PurchaseOrderPaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        projectLabelArray: new ProjectLabelArray(),
        statusLabelArray: new PurchaseOrderStatusArray(),
        filters: {
          code: null,
          supplierId: null,
          supplierName: null,
          receiverId: null,
          receiverName: null,
          chargerId: null,
          chargerName: null,
          statuses: [],
          startDueDate: null,
          endDueDate: null,
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
        startDueDate: {
          type: Date,
          firstTime: true
        },
        endDueDate: {
          type: Date,
          lastTime: true
        }
      })
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch()
      ])
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
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
              e.supplier = await CompanyModel.get(e.supplierId, true)
              e.receiver = await CompanyModel.get(e.receiverId, true)
              e.charger = await UserModel.get(e.chargerId, true)
            })
        )
        this.$redrawGrids()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      statusesLabel() {
        return this.filters.statuses.map(
            value => this.statusLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
