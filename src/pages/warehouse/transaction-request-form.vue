<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        입/출고 요청
        <span slot="subtitle">
          {{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-comment" helper="요청 유형을 지정하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.type"
                 :error-label="model.$errors.type">
          <q-select float-label="요청 유형" v-model="model.type"
                    :options="typeLabelArray" :readonly="!phantom"
                    :hide-underline="!phantom"></q-select>
        </q-field>

        <q-field icon="check" helper="수량이 재고와 정확히 일치되지 않을 때 조정하는 방식입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="수량 조정 정책" v-model="model.quantityCorrectionPolicy"
                    :options="quantityCorrectionPolicyArray"></q-select>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate"
                 :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      type="datetime"/>
        </q-field>

        <q-field icon="check" helper="요청의 상태 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabelArray"></q-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        위치 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="거래사를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.transactionCompanyId"
                 :error-label="model.$errors.transactionCompanyId">
          <c-autocomplete-select float-label="입고사" v-model="model.transactionCompanyId"
                                 :label="transactionCompanyModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 @search="ontransactionCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-building" helper="입고지를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.stationId"
                 :error-label="model.$errors.stationId" v-if="ownerRelated">
          <c-autocomplete-select float-label="입고지" v-model="model.stationId"
                                 :label="stationModel.label" :options="stationLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onStationSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>


      </q-card-main>

    </q-card>

    <div class="row col-12">
      <q-card class="col-7" flat>

        <q-card-title>
          대상 품목
          <div slot="right" class="row items-center">
            <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItem"
                   v-if="modifiable"/>
            <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.item"
                   v-if="modifiable"
                   @click="onRemoveItem"/>
          </div>
        </q-card-title>

        <q-card-separator/>


        <q-card-main class="row">

          <ag-grid class="col"
                   :grid-auto-height="true"
                   row-selection="single"
                   enable-col-resize
                   :editable="true"
                   suppress-no-rows-overlay
                   @selection-changed="onItemSelectionChanged"
                   :row-data="itemArray">
            <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
            <ag-grid-column field="item.code" header-name="품목 코드" :width="200"/>
            <ag-grid-column field="item.name" header-name="품목 이름" :width="300"/>
            <ag-grid-column field="quantity" header-name="수량" :width="100"
                            :cell-style="{textAlign: 'right'}" :editable="modifiable"
                            cell-renderer-framework="ag-grid-number-renderer"
                            cell-editor-framework="ag-grid-input-editor"
                            :cell-editor-params="{ type: 'number', align: 'right' }"
                            :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          </ag-grid>

        </q-card-main>

      </q-card>

      <q-card class="col-5" flat>

        <q-card-title>
          LOT
          <div slot="right" class="row items-center">
            <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItemLot"
                   v-if="modifiable" :disabled="!selected.item"/>
            <q-btn flat color="secondary" label="삭제" icon="remove" @click="onRemoveItemLot"
                   v-if="modifiable" :disabled="!selected.itemLot"/>
          </div>
        </q-card-title>

        <q-card-separator/>


        <q-card-main class="row">

          <ag-grid class="col"
                   :grid-auto-height="true"
                   row-selection="single"
                   enable-col-resize
                   :editable="true"
                   suppress-no-rows-overlay
                   @selection-changed="onItemLotSelectionChanged"
                   :row-data="itemLotArray">
            <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
            <ag-grid-column field="itemLot.code" header-name="LOT" :width="200"/>
            <ag-grid-column field="quantity" header-name="수량" :width="100"
                            :cell-style="{textAlign: 'right'}" :editable="modifiable"
                            cell-renderer-framework="ag-grid-number-renderer"
                            cell-editor-framework="ag-grid-input-editor"
                            :cell-editor-params="{ type: 'number' }"
                            :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          </ag-grid>

        </q-card-main>

      </q-card>

    </div>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat icon="send" @click="onCommit()" v-show="committable" label="제출"></q-btn>
        <q-btn flat icon="save" @click="onSave()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ItemLotSelector, ItemSelector} from 'src/model/item'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import CommentList from 'src/pages/comment/comment-list.vue'

  import {
    WarehouseStationLabelArray,
    WarehouseStationModel,
    WarehouseTransactionQuantityCorrectionPolicyArray,
    WarehouseTransactionRequestItemArray,
    WarehouseTransactionRequestItemLotModel,
    WarehouseTransactionRequestItemModel,
    WarehouseTransactionRequestModel,
    WarehouseTransactionRequestStatusArray,
    WarehouseTransactionTypeArray
  } from 'src/model/warehouse'

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
      }
    },
    data() {
      return {
        model: new WarehouseTransactionRequestModel(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        managerModel: new UserModel(),
        stationModel: new WarehouseStationModel(),
        transactionCompanyModel: new CompanyModel(),
        itemArray: new WarehouseTransactionRequestItemArray(),
        itemLotArray: [],
        statusLabelArray: new WarehouseTransactionRequestStatusArray(),
        typeLabelArray: new WarehouseTransactionTypeArray(),
        stationLabelArray: new WarehouseStationLabelArray(),
        quantityCorrectionPolicyArray: new WarehouseTransactionQuantityCorrectionPolicyArray(),
        enabled: true,
        selected: {
          item: null,
          itemLot: null
        },
        owner: new CompanyModel()
      }
    },
    async mounted() {
      this.owner = await CompanyModel.owner()
      await Promise.all([
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.typeLabelArray.fetch(),
        this.stationLabelArray.fetch(),
        this.quantityCorrectionPolicyArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      isChargeEditable(params) {
        return params.data.phantom;
      },
      async ontransactionCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onStationSearch(keyword) {
        await this.stationLabelArray.fetch(keyword)
      },
      onItemSelectionChanged(event) {
        const item = event.api.getSelectedRows()[0]
        this.selected.item = item
        if (item) {
          this.itemLotArray = this.selected.item.lots
        } else {
          this.itemLotArray = []
        }
      },

      onItemLotSelectionChanged(event) {
        const itemLot = event.api.getSelectedRows()[0]
        this.selected.itemLot = itemLot
      },

      async create() {
        this.model = new WarehouseTransactionRequestModel()
        this.itemArray = new WarehouseTransactionRequestItemArray(this.model)
        this.model.transactionCompanyId = this.owner.id
      },
      async show() {
        this.load(this.id)
      },
      async load(id) {
        const model = await WarehouseTransactionRequestModel.get(id)
        const itemArray = new WarehouseTransactionRequestItemArray(model)
        await itemArray.fetch()
        this.model = model
        this.itemArray = itemArray
      },
      async onSave() {
        let valid = ![
          await this.model.validate(),
          await this.itemArray.validate()
        ].includes(false)
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.load(this.model.id)
            if (this.closable) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async onCommit() {
        let valid = await this.model.validateCommit()
        if (valid) {
          const ok = await this.$alert.confirm('제출 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.commit()
            this.$alert.positive('제출 되었습니다')
            await this.load(this.model.id)
            if (this.closable) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async save() {
        await this.model.save()
        await this.itemArray.save()
      },

      async onAddItem() {
        const itemSelector = new ItemSelector(this)
        const itemModels = await itemSelector.show()
        if (!itemModels) {
          return
        }
        itemModels.forEach(async (itemModel) => {
          const itemId = itemModel.id
          const requestItem = new WarehouseTransactionRequestItemModel({
            itemId: itemId
          })
          await requestItem.fetchReference()
          this.itemArray.push(requestItem)
        })
      },

      async onAddItemLot() {
        const selector = new ItemLotSelector(this)
        selector.itemId = this.selected.item.itemId
        const itemLots = selector.show()
        if (itemLots && itemLots.length) {
          itemLots.forEach(async (itemLot) => {
            const requestItemLot = new WarehouseTransactionRequestItemLotModel({
              itemLotId: itemLot.id
            })
            await requestItemLot.fetchReference()
            this.itemLotArray.push(requestItemLot)
          })
        }
      },

      async onRemoveItem() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.itemArray.remove(this.selected.item)
          this.selected.item = null
        }
      },

      async onRemoveItemLot() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.itemLotArray.remove(this.selected.charge)
          this.selected.charge = null
        }
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      },
      modifiable() {
        return this.model.modifiable
      },
      committable() {
        return this.model.committable
      },
      ownerRelated() {
        return this.owner.id == this.model.transactionCompanyId
      },

    },
    watch: {
      'model.stationId': async function (to) {
        this.stationModel = await WarehouseStationModel.get(to, true)
      },
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'model.transactionCompanyId': async function (to) {
        this.transactionCompanyModel = await CompanyModel.get(to, true)
        if (!this.ownerRelated) {
          this.model.stationId = null
        }
      }
    },
    components: {
      CommentList
    }
  }
</script>
