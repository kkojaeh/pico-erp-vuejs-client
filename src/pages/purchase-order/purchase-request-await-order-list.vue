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
        <q-btn flat icon="add" label="발주생성" :disabled="!selected.length"
               @click="onGenerate"></q-btn>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="multiple"
               enable-server-side-sorting
               suppress-row-click-selection
               enable-col-resize
               enable-sorting
               :row-data="array"
               @selection-changed="onSelectionChanged">
        <ag-grid-column :checkbox-selection="checkboxSelectionFn" :width="60"/>
        <!--<ag-grid-column field="project.name" header-name="프로젝트명" :width="120"/>-->
        <ag-grid-column field="item.code" header-name="품목 코드" :width="150"/>
        <ag-grid-column field="item.name" header-name="품목 이름" :width="150"/>
        <ag-grid-column field="itemSpec.summary" header-name="품목 스펙" :width="150"/>

        <ag-grid-column field="quantity" header-name="수량" :width="100"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="item.unit" header-name="단위" :width="80"
                        :cell-style="{textAlign: 'center'}"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="receiver.name" header-name="인수사" :width="120"/>
        <ag-grid-column field="receiveSite.name" header-name="인수지" :width="120"/>
        <ag-grid-column field="requester.name" header-name="요청자" :width="120"/>
        <ag-grid-column field="dueDate" header-name="만기일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="committedDate" header-name="제출일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

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


      <q-field slot="filter" icon="account_box" helper="요청자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="요청자" v-model="filters.requesterId"
                               :label.sync="filters.requesterName" :options="userLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onUserSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
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

      <c-list-filter-label slot="filter-label" v-model="filters.projectId"
                           :print-value="filters.projectName" label="프로젝트"/>
      <c-list-filter-label slot="filter-label" v-model="filters.receiverId"
                           :print-value="filters.receiverName" label="인수사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.requesterId"
                           :print-value="filters.requesterName" label="요청자"/>
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
  import {PurchaseRequestAwaitOrderPaginationArray} from 'src/model/purchase-request'
  import {PurchaseOrderModel} from 'src/model/purchase-order'
  import {ItemModel, ItemSpecModel} from 'src/model/item'
  import {UnitLabelArray} from 'src/model/shared'
  import {WarehouseSiteModel} from 'src/model/warehouse'

  export default {
    authorized: {},
    data() {
      return {
        array: new PurchaseRequestAwaitOrderPaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        projectLabelArray: new ProjectLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        selected: [],
        filters: {
          code: null,
          receiverId: null,
          receiverName: null,
          accepterId: null,
          accepterName: null,
          requesterId: null,
          requesterName: null,
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
        this.unitLabelArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
      ])
    },
    methods: {
      checkboxSelectionFn(params) {
        const data = params.data
        if (!this.selected.length) {
          return true
        } else {
          const selected = this.selected[0]
          const selectedDey = selected.receiverId + selected.receiveSiteId
          const key = data.receiverId + data.receiveSiteId
          return selectedDey == key
        }
      },
      onSelectionChanged(event) {
        this.selected = event.api.getSelectedRows()
        this.$redrawGrids()
      },
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
              e.receiver = await CompanyModel.get(e.receiverId, true)
              e.project = await ProjectModel.get(e.projectId, true)
              e.requester = await UserModel.get(e.requesterId, true)
              e.item = await ItemModel.get(e.itemId, true)
              e.itemSpec = await ItemSpecModel.get(e.itemSpecId, true)
              e.receiveSite = await WarehouseSiteModel.get(e.receiveSiteId, true)
            })
        )
        this.$redrawGrids()
      },
      async onGenerate() {
        const ok = await this.$alert.confirm('선택한 내역으로 발주를 생성 하시겠습니까?')
        if (ok) {
          const purchaseRequestItemIds = this.selected.map(e => e.requestItemId)
          const order = await PurchaseOrderModel.generate(purchaseRequestItemIds)
          this.$router.push({
            path: `/purchase-order/order/show/${order.id}`
          })
          await this.$alert.positive('발주가 생성 되었습니다')
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    }
  }
</script>
