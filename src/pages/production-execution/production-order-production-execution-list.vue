<template>
  <q-page class="row fit">
    <!-- child -->

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination
                 @fetched="onFetched" hide-trigger filter-always>

      <!-- action -->

      <div slot="action" class="row">
        <q-btn flat icon="arrow_drop_down" class="col">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <div class="row justify-between col-grow">
          <q-btn flat icon="add" label="생성"
                 @click="onCreate" v-if="isCreatable"></q-btn>
          <q-btn flat icon="check" label="완료"
                 @click="onComplete" v-if="isCompletable"></q-btn>
        </div>

      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-server-side-sorting
               suppress-row-click-selection
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="quantity" header-name="수량" :width="100"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="errorQuantity" header-name="불량수량" :width="100"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="unit" header-name="단위" :width="80"
                        :cell-style="{textAlign: 'center'}"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="executor.name" header-name="작업자" :width="120"/>
        <ag-grid-column field="startDate" header-name="시작일시" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="endDate" header-name="종료일시" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-card class="col-12" flat slot="filter">

        <q-card-main class="row gutter-md">

          <q-field icon="fas fa-gift" helper="작업 대상 품목입니다"
                   :error="!!model.$errors.itemId"
                   :error-label="model.$errors.itemId"
                   class="col-xs-12 col-md-6 col-lg-8 col-xl-9">
            <q-input :prefix="itemModel.code" float-label="품목" :value="itemModel.name" clearable
                     readonly hide-underline
                     :before="[{icon: 'open_in_new', condition: !!model.itemId, handler: onShowItem}]"/>
          </q-field>

          <q-field icon="fas fa-building" helper="작업 공정 입니다"
                   class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                   :error="!!model.$errors.processId"
                   :error-label="model.$errors.processId">
            <q-select float-label="공정" v-model="model.processId" :disabled="!model.itemId"
                      readonly hide-underline
                      :options="processLabels"></q-select>
          </q-field>

          <q-field icon="info" helper="목표 수량입니다"
                   class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                   :error="!!model.$errors.quantity"
                   :error-label="model.$errors.quantity">
            <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                     readonly hide-underline :suffix="unitLabel"/>
            <q-tooltip>
              {{$number.words(model.quantity)}}
            </q-tooltip>
          </q-field>

          <q-field icon="info" helper="여분 수량입니다"
                   class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                   :error="!!model.$errors.spareQuantity"
                   :error-label="model.$errors.spareQuantity">
            <q-input type="number" float-label="여분 수량" v-model="model.spareQuantity" align="right"
                     readonly hide-underline :suffix="unitLabel"/>
            <q-tooltip>
              {{$number.words(model.spareQuantity)}}
            </q-tooltip>
          </q-field>

          <q-field icon="fas fa-calendar" helper="만기일 입니다"
                   class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                   :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
            <q-datetime float-label="만기일자" v-model="model.dueDate"
                        readonly hide-underline
                        type="date"/>
          </q-field>

          <q-field icon="info" helper="완료 수량입니다"
                   class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <q-input type="number" float-label="진행 수량" v-model="model.progressedQuantity"
                     align="right"
                     readonly hide-underline :suffix="unitLabel" :color="statusProgressedQuantity"
                     inverted/>
            <q-tooltip>
              {{$number.words(model.progressedQuantity)}}
            </q-tooltip>
          </q-field>

        </q-card-main>

      </q-card>

      <!-- filters -->

      <!-- filter -->

      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {
    ProductionOrderModel
  } from 'src/model/production-order'
  import {UserModel} from 'src/model/user'
  import {
    ProductionExecutionPaginationArray,
    ProductionExecutionViewer
  } from 'src/model/production-execution'
  import {OutsourcingOrderModel} from 'src/model/outsourcing-order'
  import {UnitLabelArray} from 'src/model/shared'
  import {ItemModel} from "../../model/item";
  import {ItemProcessArray} from "../../model/process";

  export default {
    authorized: {},
    props: {
      id: {
        type: String
      }
    },
    data() {
      return {
        model: new ProductionOrderModel(),
        processes: new ItemProcessArray(),
        array: new ProductionExecutionPaginationArray(),
        itemModel: new ItemModel(),
        unitLabelArray: new UnitLabelArray(),
        ordererModel: new UserModel(),
        accepterModel: new UserModel(),
        processLabels: [],
        selected: [],
        filters: {
          orderId: null
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
      'model.ordererId': async function (to) {
        this.ordererModel = await UserModel.get(to, true)
      },
      'model.accepterId': async function (to) {
        this.accepterModel = await UserModel.get(to, true)
      }
    },
    async mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      await Promise.all([
        this.unitLabelArray.fetch()
      ])
      this.filters.orderId = this.id
      await this.reload()

    },
    methods: {
      async reload() {
        this.model = await ProductionOrderModel.get(this.id)
        await this.$refs.listView.retrieve(true)
      },
      onShowItem() {
        this.$showItem(this.model.itemId)
      },
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
              e.executor = await UserModel.get(e.executorId, true)
            })
        )
        this.$redrawGrids()
      },
      async onCreate() {
        const viewer = new ProductionExecutionViewer(this)
        viewer.order = this.model
        const result = await viewer.create()
        if (result) {
          await this.$await(1000)
          await this.reload()
        }
      },

      async onComplete() {
        const validComplete = await this.model.validateComplete()
        if (validComplete) {
          const ok = await this.$alert.confirm('생산을 완료 하시겠습니까?')
          if (ok) {
            await this.model.complete()
            this.$alert.positive('완료 되었습니다')
            await this.$await(1000)
            await this.reload()
          }
        } else {
          this.$alert.warning(this.model.$errors.complete)
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      unitLabel() {
        const unit = this.model.unit
        const found = this.unitLabelArray.find(e => e.value == unit) || {}
        return found.label || ''
      },
      statusProgressedQuantity() {
        if (this.model.quantity + this.model.spareQuantity < this.model.progressedQuantity) {
          return 'positive';
        } else {
          return 'warning';
        }
      },
      isCompletable() {
        return this.model.completable && this.model.quantity + this.model.spareQuantity
            < this.model.progressedQuantity
      },
      isCreatable() {
        return this.model.progressable
      }
    }
  }
</script>
