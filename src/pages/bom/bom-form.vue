<template>
  <q-page class="row">

    <q-card class="col-12" flat>

      <q-card-main class="row">

        <ag-grid ref="grid"
                 class="col-grow"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 enable-sorting
                 :get-node-child-details="getNodeChildDetails"
                 @selection-changed="onGridSelectionChanged"
                 @row-clicked="onGridRowClicked"
                 @cell-value-changed="onCellValueChanged"
                 enable-group-edit
                 :row-data="array">
          <ag-grid-column field="item.name" header-name="이름" cellRenderer="agGroupCellRenderer"
                          :checkbox-selection="true" :width="400"
                          :cell-renderer-params="{
                            innerRenderer: bomNameRenderer,
                            suppressCount: true,
                            padding: 20
                          }"/>
          <ag-grid-column field="item.code" header-name="코드" :width="150"
                          cell-renderer-framework="ag-grid-router-link-renderer"
                          :cell-renderer-params="{path:'/item/show/${item.id}', innerRenderer: bomAdditionalFieldRenderer}"/>
          <ag-grid-column field="processesNames" header-name="공정" :width="220"
                          cell-renderer-framework="bom-process-cell-renderer"
                          :cell-renderer-params="{openHandler: onOpenProcesses}"/>
          <ag-grid-column field="itemSpecId" header-name="스펙" :width="160"
                          cell-renderer-framework="bom-item-spec-cell-renderer"
                          :cell-renderer-params="{openHandler: onOpenItemSpec}"/>
          <ag-grid-column field="quantity" header-name="수량" :width="80"
                          :editable="isQuantityEditable"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-renderer="quantityCellRenderer" :tooltip="tooltipReversedQuantity"
                          :cell-editor-params="{ type: 'number', decimals: 5, align: 'right' }"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="item.unit" header-name="단위" :width="80"
                          :cell-style="{textAlign: 'center'}"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
          <ag-grid-column field="status" header-name="상태" :width="80"
                          :cell-style="{textAlign: 'center'}"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>
          <ag-grid-column field="estimatedAccumulatedUnitCost.total" header-name="단가" :width="100"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :cell-style="{textAlign: 'right'}"/>

          <ag-grid-column field="estimatedAccumulatedUnitCost.directMaterial" header-name="재료비(직접)"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                          header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
          <ag-grid-column field="estimatedAccumulatedUnitCost.indirectMaterial"
                          header-name="재료비(간접)"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                          header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
          <ag-grid-column field="estimatedAccumulatedUnitCost.directLabor" header-name="노무비(직접)"
                          :width="100"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                          header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
          <ag-grid-column field="estimatedAccumulatedUnitCost.indirectLabor" header-name="노무비(간접)"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                          header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
          <ag-grid-column field="estimatedAccumulatedUnitCost.indirectExpenses" header-name="간접경비"
                          :cell-renderer="bomAdditionalFieldRenderer"
                          :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                          header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
          <ag-grid-column field="determinedBy.name" header-name="확정자" :width="100"/>
          <ag-grid-column field="determinedDate" header-name="확정일" :width="200"
                          :cell-renderer-params="{ago: true}"
                          cell-renderer-framework="ag-grid-datetime-renderer"/>
        </ag-grid>
      </q-card-main>
    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-btn flat icon="refresh" @click="onRefresh">새로고침</q-btn>
        <q-toggle v-model="detailedUnitCost" label="상세 단가" dark/>
        <q-btn-dropdown label="이동" flat icon="unfold_more" v-show="isUpMovable || isDownMovable">
          <q-btn flat icon="arrow_drop_up" :disabled="!isUpMovable" @click="onMoveUp">위로</q-btn>
          <q-btn flat icon="arrow_drop_down" :disabled="!isDownMovable" @click="onMoveDown">아래로
          </q-btn>
        </q-btn-dropdown>
        <q-toolbar-title>

        </q-toolbar-title>
        <q-btn flat icon="check" @click="onDetermine" v-if="isDeterminable">확정</q-btn>
        <q-btn flat icon="autorenew" @click="onNextRevision" v-if="isNextDraftable">새버전
        </q-btn>
        <q-btn-dropdown label="추가" flat icon="add" :disabled="!isSelectedAddable">
          <!-- dropdown content -->
          <q-list link>
            <q-item @click.native="onAddBomBySelect" v-close-overlay>
              <q-item-side left icon="add"></q-item-side>
              <q-item-main label="기존 품목"></q-item-main>
            </q-item>
            <q-item @click.native="onAddBomByNew" v-close-overlay>
              <q-item-side left icon="add"></q-item-side>
              <q-item-main label="신규 품목"></q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat icon="remove" label="제거" :disabled="!isSelectedRemovable"
               @click="onRemoveMaterial()"></q-btn>
      </q-toolbar>
    </q-page-sticky>

    <q-inner-loading :visible="loading">
    </q-inner-loading>

  </q-page>

</template>
<script>
  import {BomModel, BomStatusArray} from 'src/model/bom'
  import {ItemSelector, ItemSpecViewer, ItemViewer} from 'src/model/item'
  import {ItemProcessesViewer} from 'src/model/process'
  import {UnitLabelArray} from 'src/model/shared'
  import BomProcessCellRenderer from './bom-process-cell-renderer.vue'
  import BomItemSpecCellRenderer from './bom-item-spec-cell-renderer.vue'

  const additionalFields = {
    'item.code': 'item.externalCode',
    'estimatedAccumulatedUnitCost.total': 'estimatedIsolatedUnitCost.total',
    'estimatedAccumulatedUnitCost.directMaterial': 'estimatedIsolatedUnitCost.directMaterial',
    'estimatedAccumulatedUnitCost.indirectMaterial': 'estimatedIsolatedUnitCost.indirectMaterial',
    'estimatedAccumulatedUnitCost.directLabor': 'estimatedIsolatedUnitCost.directLabor',
    'estimatedAccumulatedUnitCost.indirectLabor': 'estimatedIsolatedUnitCost.indirectLabor',
    'estimatedAccumulatedUnitCost.indirectExpenses': 'estimatedIsolatedUnitCost.indirectExpenses'
  }

  export default {
    props: {
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
        array: [],
        model: new BomModel(),
        selected: new BomModel({isNull: true}),
        statusLabelArray: new BomStatusArray(),
        unitLabelArray: new UnitLabelArray(),
        detailedUnitCost: false,
        loading: false
      }
    },
    async mounted() {
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.unitLabelArray.fetch()
      ])
      this.$nextTick(() => this.show())
    },
    methods: {

      async onRefresh() {
        await this.refresh()
      },
      quantityCellRenderer(params) {
        const value = params.value
        return `${value} <sub>(${params.data.quantityPerRoot})</sub>`
      },
      async onCellValueChanged(e) {
        if (e.newValue == e.oldValue) {
          return
        }
        const data = e.data
        const parent = data.parent
        data.quantity = data.quantity ? data.quantity : 1
        await parent.changeMaterial(data)
        await this.refresh()
      },
      isQuantityEditable(params) {
        const parent = params.data.parent
        return parent && parent.updatable
      },
      bomNameRenderer(params) {
        return `${params.value}<sub class="bom-name-sub">[${params.data.revision}]</sub>`
      },
      tooltipReversedQuantity(params) {
        return `역수량 : ${(1 / params.value).toFixed(5)} (${(1 / params.data.quantityPerRoot).toFixed(
            5)})`
      },

      bomAdditionalFieldRenderer(params) {
        const additionalField = additionalFields[params.colDef.field]
        const addition = _.get(params.data, additionalField)
        if (addition == null || addition == undefined) {
          return params.value
        }
        return `${params.value} (${addition})`
      },
      getNodeChildDetails(data) {
        const children = data.children
        if (children && children.length) {
          return {
            group: true,
            expanded: true,
            // provide ag-Grid with the children of this group
            children: children,
            // the key is used by the default group cellRenderer
            key: `${data.id}`
          }
        }
        return null
      },
      async onGridSelectionChanged(event) {
        this.$nextTick(() => {
          this.selected = event.api.getSelectedRows()[0] || new BomModel({isNull: true})
        })
      },
      onGridRowClicked(event) {
        if (!event.node.isSelected()) {
          event.node.setSelected(true, true)
        }
      },
      async show() {
        this.load(this.id)
      },
      async refresh() {
        await this.load(this.id)
      },
      async load(id) {
        const grid = this.$refs.grid
        const selectedId = this.selected.id
        this.model = await BomModel.get(id)
        await this.model.fetchChildren(true, true)
        this.array = [this.model]
        // 첫행 선택
        this.$nextTick(() => {
          let candidate
          grid.api.forEachNode((node) => {
            if (node.rowIndex == 0) {
              candidate = node
            }
            if (selectedId && selectedId == node.data.id) {
              candidate = node
            }
          })
          if (candidate) {
            candidate.setSelected(true)
          }
        })
      },
      async onNextRevision() {
        let valid = await this.selected.validateNextRevision()
        if (valid) {
          const ok = await this.$alert.confirm('다음 버전으로 진행 하시겠습니까?')
          if (ok) {
            this.loading = true
            await this.selected.nextRevision()
            await this.$await(1000)
            if (this.selected != this.model) {
              this.model = await BomModel.getByItemId(this.model.itemId, this.model.revision + 1)
            }
            this.$router.replace({path: `/bom/${this.model.itemId}/${this.model.id}`})
            await this.$await(1000)
            await this.refresh()
            await this.$alert.positive('버전이 변경 되었습니다')
            this.loading = false
          }
        } else {
          this.$alert.warning(this.selected.$errors.nextRevision)
        }
      },

      async onDetermine() {
        let valid = await this.selected.validateDetermine()
        if (valid) {
          const ok = await this.$alert.confirm('확정을 진행 하시겠습니까?')
          if (ok) {
            await this.selected.determine()
            await this.refresh()
            this.$alert.positive('확정 되었습니다')
          }
        } else {
          this.$alert.warning(this.selected.$errors.determine)
        }
      },

      async onRemoveMaterial() {
        const ok = await this.$alert.confirm('상위 품목에서 해당 자재를 삭제하시겠습니까?')
        if (ok) {
          await this.selected.parent.removeMaterial(this.selected)
          this.$alert.positive('자재가 삭제 되었습니다')
          await this.refresh()
        }
      },
      /**
       * ItemForm@saved -> BomModel.createByItemId -> selected.addMaterial
       */
      async onAddBomByNew() {
        const selected = this.selected
        this.loading = true
        const viewer = new ItemViewer(this)
        viewer.predefined = {customerId: this.model.customerId}
        const itemModel = await viewer.create()
        if (itemModel) {
          const material = await BomModel.createByItemId(itemModel.id)
          await selected.addMaterial(material)
          await this.refresh()
        }
        this.loading = false
      },

      async onAddBomBySelect() {
        const selected = this.selected
        const itemSelector = new ItemSelector(this)
        const itemModels = await itemSelector.show()
        if (!itemModels || !itemModels.length) {
          return
        }
        this.loading = true
        await Promise.all(
            itemModels.map(async (itemModel) => {
              const itemId = itemModel.id
              const exists = await BomModel.existsByItemId(itemId)
              let material
              if (exists) {
                material = await BomModel.getByItemId(itemId)
              } else {
                material = await BomModel.createByItemId(itemModel.id)
              }
              await selected.addMaterial(material)
            })
        )
        await this.refresh()
        this.loading = false
      },

      async onOpenProcesses(data) {
        this.selected = data
        const viewer = new ItemProcessesViewer(this)
        viewer.itemId = this.selected.itemId
        viewer.updatable = this.selected.processable && this.selected.updatable
        const changed = await viewer.show()
        if (changed) {
          await this.refresh()
        }

      },
      async onOpenItemSpec(data) {
        this.selected = data
        this.loading = true
        if (data.itemSpecId) {
          const viewer = new ItemSpecViewer(this)
          viewer.id = data.itemSpecId
          viewer.editable = true
          const changed = await viewer.show()
          if (changed) {
            await this.$await(1000)
            await this.refresh()
          }
        } else {
          const viewer = new ItemSpecViewer(this)
          viewer.itemId = data.itemId
          const created = await viewer.create()
          if (created) {
            data.itemSpecId = created.id
            const parent = data.parent
            await parent.changeMaterial(data)
            await this.$await(1000)
            await this.refresh()
          }
        }
        this.loading = false
      },

      async onMoveUp() {
        await this.selected.moveUp()
        await this.refresh()
      },

      async onMoveDown() {
        await this.selected.moveDown()
        await this.refresh()
      }

    },
    computed: {
      /**
       * 선택 대상 삭제 여부
       */
      isSelectedRemovable() {
        return this.selected.parent && this.selected.parent.updatable
      },

      isSelectedAddable() {
        return this.selected.updatable
      },

      isNextDraftable() {
        return !this.selected.updatable
      },

      isDeterminable() {
        return this.selected.updatable
      },

      isUpMovable() {
        return this.selected.upMovable
      },

      isDownMovable() {
        return this.selected.downMovable
      }
    },
    components: {
      BomProcessCellRenderer,
      BomItemSpecCellRenderer
    }
  }

</script>
<style lang="stylus">
  .bom-name-sub
    margin-left: 5px
    color: gray

  .bom-detailed-price
    font-size: 10px !important
    color: lightslategray
    opacity: 0.7
</style>
