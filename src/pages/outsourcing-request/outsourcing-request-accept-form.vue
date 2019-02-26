<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        외주 요청 정보
        <span slot="right" v-if="!!model.code">
          {{statusLabel}} - {{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-gift" helper="품목을 선택하세요"
                 :error="!!model.$errors.itemId"
                 :error-label="model.$errors.itemId"
                 class="col-xs-12 col-md-6 col-lg-8 col-xl-9">
          <q-input :prefix="itemModel.code" float-label="품목" :value="itemModel.name" clearable
                   readonly hide-underline
                   :before="[{icon: 'open_in_new', condition: !!model.itemId, handler: onShowItem}]"/>
        </q-field>

        <q-field icon="fas fa-building" helper="공정을 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.processId"
                 :error-label="model.$errors.processId">
          <q-select float-label="공정" v-model="model.processId" :disabled="!model.itemId"
                    readonly hide-underline
                    :options="processLabels"></q-select>
        </q-field>

        <q-field icon="info" helper="요청 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.quantity"
                 :error-label="model.$errors.quantity">
          <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                   readonly hide-underline :suffix="unitLabel"/>
          <q-tooltip>
            {{$number.words(model.quantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="info" helper="여분 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.spareQuantity"
                 :error-label="model.$errors.spareQuantity">
          <q-input type="number" float-label="여분 수량" v-model="model.spareQuantity" align="right"
                   readonly hide-underline :suffix="unitLabel"/>
          <q-tooltip>
            {{$number.words(model.spareQuantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      readonly hide-underline
                      type="date"/>
        </q-field>


        <q-field icon="account_box" helper="요청자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.requesterId"
                 :error-label="model.$errors.requesterId">
          <c-autocomplete-select float-label="요청자" v-model="model.requesterId"
                                 :label="requesterModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_box" helper="접수자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.accepterId"
                 :error-label="model.$errors.accepterId">
          <c-autocomplete-select float-label="접수자" v-model="model.accepterId"
                                 :label="accepterModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="description" helper="비고 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.remark"
                 :error-label="model.$errors.remark"
                 :count="50">
          <q-input type="textarea" v-model="model.remark" float-label="비고"
                   rows="4"
                   readonly hide-underline
                   max-length="50"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        인수 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="품목을 인수할 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiverId"
                 :error-label="model.$errors.receiverId">
          <c-autocomplete-select float-label="인수사" v-model="model.receiverId"
                                 :label="receiverModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>


        <q-field icon="fas fa-building" helper="인수지를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiveSiteId"
                 :error-label="model.$errors.receiveSiteId" v-if="ownerRelated">
          <q-select float-label="인수지" v-model="model.receiveSiteId"
                    :display-value="receiveSiteModel.name || null"
                    readonly hide-underline
                    :options="siteArray" clearable></q-select>
        </q-field>

        <q-field icon="fas fa-building" helper="인수지(상세)를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiveStationId"
                 :error-label="model.$errors.receiveStationId" v-if="ownerRelated">
          <q-select float-label="인수지" v-model="model.receiveStationId"
                    :display-value="receiveStationModel.name || null"
                    readonly hide-underline
                    :options="stationArray" clearable></q-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        재료 품목
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 :row-data="itemArray">
          <ag-grid-column field="item.code" header-name="품목 코드" :width="100"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="200"/>
          <ag-grid-column field="itemSpecCode" header-name="품목 스펙" :width="140"/>
          <ag-grid-column field="quantity" header-name="수량" :width="100"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number' }"/>
          <ag-grid-column field="unit" header-name="단위" :width="80"
                          :cell-style="{textAlign: 'center'}"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
          <ag-grid-column field="supplierId" header-name="공급사" :width="150"
                          :cell-editor-params="{ options: companyLabelArray,  labelField: 'label' , valueField: 'value', onSearch:onCompanySearch}"
                          :cell-renderer="supplierRenderer"
                          cell-editor-framework="ag-grid-autocomplete-select-editor"/>
          <ag-grid-column field="estimatedSupplyDate" header-name="예상 공급 시간" :width="170"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          cell-editor-framework="ag-grid-datetime-editor"
                          :cell-style="{textAlign: 'center'}"
                          :cell-renderer-params="{ago:true}"
                          :cell-editor-params="{ type: 'datetime', format24h:true }"/>
          <ag-grid-column field="remark" header-name="비고" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="cancel" @click="onReject()" label="반려" v-if="rejectable"></q-btn>
        <q-btn flat icon="done" @click="onAccept()" label="접수" v-if="acceptable"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ItemModel} from 'src/model/item'
  import {
    OutsourcingRequestMaterialArray,
    OutsourcingRequestModel,
    OutsourcingRequestStatusArray
  } from 'src/model/outsourcing-request'
  import {ItemProcessArray, ProcessModel} from 'src/model/process'
  import {
    WarehouseSiteArray,
    WarehouseSiteModel,
    WarehouseStationArray,
    WarehouseStationModel,
  } from 'src/model/warehouse'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import {UnitLabelArray} from 'src/model/shared'

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new OutsourcingRequestModel(),
        processes: new ItemProcessArray(),
        processLabels: [],
        itemArray: new OutsourcingRequestMaterialArray(),
        itemModel: new ItemModel(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        requesterModel: new UserModel(),
        accepterModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        receiverModel: new CompanyModel(),
        purchaserModel: new CompanyModel(),

        receiverModel: new CompanyModel(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new OutsourcingRequestStatusArray(),
        receiveStationModel: new WarehouseStationModel(),
        receiveSiteModel: new WarehouseSiteModel(),
        siteArray: new WarehouseSiteArray(),
        stationArray: new WarehouseStationArray(),

        enabled: true,
        selected: {
          item: null
        },
        owner: new CompanyModel()
      }
    },
    async mounted() {
      this.owner = await CompanyModel.owner()
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.siteArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.statusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.siteArray.forEach(site => {
        site.value = site.id
        site.label = site.name
      })
    },
    methods: {
      supplierRenderer(params) {
        return params.data.supplier.name
      },
      onShowItem() {
        this.$showItem(this.model.itemId)
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      onItemSelectionChanged(event) {
        this.selected.item = event.api.getSelectedRows()[0]
      },

      async onOpenItemSpec(data) {
        this.selected.item = data
        if (data.itemSpecId) {
          const changed = await this.$showItemSpec(data.itemSpecId, {
            editable: false
          })
          if (changed) {
            await data.fetchReference()
          }
        } else {
          const created = await this.$createItemSpec({
            itemId: data.itemId
          })
          if (created) {
            data.itemSpecId = created.id
            await data.fetchReference()
          }
        }
        this.$redrawGrids()
      },

      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await OutsourcingRequestModel.get(id)
        const itemArray = new OutsourcingRequestMaterialArray(model)
        await itemArray.fetch()
        this.model = model
        this.itemArray = itemArray
      },

      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },

      async onReject() {
        await this.model.fetchReference()
        const validReject = await this.model.validateReject()
        if (validReject) {
          const ok = await this.$alert.confirm('요청을 반려 하시겠습니까?')
          if (ok) {
            const reason = await this.$alert.prompt('반려 사유를 입력하세요')
            if (!reason) {
              this.$alert.warning("반려 사유가 없습니다")
              return
            }
            await this.model.reject(reason)
            this.$alert.positive('반려 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.reject)
        }
      },

      async onAccept() {
        await this.model.fetchReference()
        const validCancel = await this.model.validateAccept()
        if (validCancel) {
          const ok = await this.$alert.confirm('요청을 접수 하시겠습니까?')
          if (ok) {
            await this.model.accept()
            this.$alert.positive('접수 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.accept)
        }
      }

    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      phantom() {
        return this.model.phantom
      },
      rejectable() {
        return this.model.rejectable
      },
      acceptable() {
        return this.model.acceptable
      },
      ownerRelated() {
        return this.owner.id == this.model.receiverId
      },
      statusLabel() {
        const status = this.model.status
        const found = this.statusLabelArray.find(e => e.value == status) || {}
        return found.label || ''
      },
      unitLabel() {
        const unit = this.model.unit
        const found = this.unitLabelArray.find(e => e.value == unit) || {}
        return found.label || ''
      }
    },
    watch: {
      'model.requesterId': async function (to) {
        this.requesterModel = await UserModel.get(to, true)
      },
      'model.accepterId': async function (to) {
        this.accepterModel = await UserModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
      },
      'model.purchaserId': async function (to) {
        this.purchaserModel = await CompanyModel.get(to, true)
      },
      'model.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
        if (to != this.owner.id) {
          this.model.receiveSiteId = null
          this.model.receiveStationId = null
        }
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
      },
      'model.receiveStationId': async function (to) {
        this.receiveStationModel = await WarehouseStationModel.get(to, true)
      },
      'model.receiveSiteId': async function (to) {
        this.receiveSiteModel = await WarehouseSiteModel.get(to, true)
        const stationArray = new WarehouseStationArray(this.receiveSiteModel)
        await stationArray.fetch()
        this.stationArray = stationArray.map(station => {
          return {
            value: station.id,
            label: station.name
          }
        })
      },
      'model.itemId': async function (to) {
        this.itemModel = await ItemModel.get(to, true)
        await this.processes.fetch(to)
        this.processLabels = this.processes.map(process => {
          return {
            value: process.id,
            label: process.name
          }
        })
      },
      'model.processId': async function (to) {
        const process = await ProcessModel.get(to, true)
        this.model.itemSpecCode = process.itemSpecCode
      }
    },
    components: {
      CommentList
    }
  }
</script>
