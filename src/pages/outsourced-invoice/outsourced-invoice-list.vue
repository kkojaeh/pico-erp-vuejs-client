<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 @fetched="onFetched" :sorts="sorts">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <router-link :to="{ path: '/outsourced-invoice/create', query: $route.query}">
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
        <ag-grid-column field="invoice.code" header-name="송장번호" :width="120"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/outsourced-invoice/show/${id}', query:$route.query, innerRenderer: invoiceCodeRenderer}"/>
        <ag-grid-column field="project.name" header-name="프로젝트" :width="170" suppress-sorting/>
        <ag-grid-column field="sender.name" header-name="고객사" :width="120" suppress-sorting/>
        <ag-grid-column field="receiver.name" header-name="인수사" :width="120" suppress-sorting/>
        <ag-grid-column field="status" header-name="상태" :width="100"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="dueDate" header-name="예정일시" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="100"/>
        <ag-grid-column field="createdDate" header-name="인수일시" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->
      <!--
            <q-field slot="filter" icon="account_circle" helper="송장번호에 포함된 글자를 입력하세요"
                     class="col-xs-11 col-md-4 col-xl-3">
              <q-input v-model="filters.code" float-label="송장번호" clearable
                       @keyup.enter="retrieve()"/>
            </q-field>-->

      <q-field slot="filter" icon="fas fa-building" helper="발송사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="인수사" v-model="filters.senderId"
                               :label.sync="filters.senderName" :options="companyLabelArray"
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

      <q-field slot="filter" icon="fas fa-building" helper="상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabelArray" multiple></q-select>
      </q-field>


      <q-field slot="filter" icon="fas fa-calendar" helper="만기일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="만기일 ~부터" v-model="filters.startDueDate"
                    type="date"/>
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

      <!--<c-list-filter-label slot="filter-label" v-model="filters.code" label="송장번호"/>-->
      <c-list-filter-label slot="filter-label" v-model="filters.senderId"
                           :print-value="filters.supplierName" label="발송사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.receiverId"
                           :print-value="filters.receiverName" label="인수사"/>
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
  import Sort from 'src/model/sort'
  import {mapGetters} from 'vuex'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {InvoiceModel} from 'src/model/invoice'
  import {ProjectModel} from 'src/model/project'
  import {UserLabelArray} from 'src/model/user'
  import {ItemSelector} from 'src/model/item'
  import {
    OutsourcedInvoicePaginationArray,
    OutsourcedInvoiceStatusArray
  } from 'src/model/outsourced-invoice'

  import moment from 'moment'

  export default {
    authorized: {
      'outsourceInvoiceManager': 'hasRole(\'OUTSOURCED_INVOICE_MANAGER\')'
    },
    data() {
      return {
        array: new OutsourcedInvoicePaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        statusLabelArray: new OutsourcedInvoiceStatusArray(),
        sorts: [Sort.createSort('dueDate', 'ASC')],
        filters: {
          /*code: null,*/
          receiverId: null,
          receiverName: null,
          senderId: null,
          senderName: null,
          statuses: [],
          startDueDate: null,
          endDueDate: null,
          itemId: null,
          itemCode: null,
          itemName: null
        },
        owner: new CompanyModel(),
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
      this.owner = await CompanyModel.owner()
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch()
      ])
      /*
      if (!this.filters.receiverId) {
        this.filters.receiverId = this.owner.id
        this.filters.receiverName = this.owner.name
      }
      */
      if (!this.filters.startDueDate) {
        this.filters.startDueDate = moment().subtract(1, 'weeks').toDate()
      }
      this.retrieve()
    },
    methods: {
      invoiceCodeRenderer(params) {
        return params.value || 'N/A'
      },
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onItemSearch() {
        const itemSelector = new ItemSelector(this)
        const itemModels = await itemSelector.show()
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
              e.sender = await CompanyModel.get(e.senderId, true)
              e.receiver = await CompanyModel.get(e.receiverId, true)
              e.invoice = await InvoiceModel.get(e.invoiceId, true)
              e.project = await ProjectModel.get(e.projectId, true)
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
