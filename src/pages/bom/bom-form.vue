<template>
  <q-page class="column fit">

    <q-toolbar>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat icon="check" @click="_onDetermineClick" v-if="isDeterminable">확정</q-btn>
      <q-btn flat icon="autorenew" @click="_onNextRevisionClick" v-if="isNextDraftable">새버전</q-btn>
      <q-btn-dropdown label="추가" flat icon="add" :disabled="!isSelectedAddable">
        <!-- dropdown content -->
        <q-list link>
          <q-item @click.native="addBomBySelect" v-close-overlay>
            <q-item-side left icon="add"></q-item-side>
            <q-item-main label="기존 품목"></q-item-main>
          </q-item>
          <q-item @click.native="addBomByNew" v-close-overlay>
            <q-item-side left icon="add"></q-item-side>
            <q-item-main label="신규 품목"></q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn flat icon="remove" label="제거" :disabled="!isSelectedRemovable"></q-btn>
    </q-toolbar>

    <ag-grid ref="grid"
             class="col-grow"
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
                      col-id="xxx"
                      :checkbox-selection="true" :width="400"
                      :cell-renderer-params="{
                            innerRenderer: bomNameRenderer,
                            suppressCount: true,
                            padding: 20
                          }"/>
      <ag-grid-column field="item.code" header-name="코드" :width="150"
                      cell-renderer-framework="ag-grid-router-link-renderer"
                      :cell-renderer-params="{path:'/item/show/${item.id}', innerRenderer: createCellRenderer('item.externalCode')}"/>
      <ag-grid-column field="processId" header-name="공정" :width="180"
                      cell-renderer-framework="bom-process-cell-renderer"
                      :cell-renderer-params="{editHandler: editProcess, removeHandler: removeProcess}"/>
      <ag-grid-column field="itemSpecId" header-name="스펙" :width="160"
                      cell-renderer-framework="bom-item-spec-cell-renderer"
                      :cell-renderer-params="{editHandler: editItemSpec}"/>
      <ag-grid-column field="item.unit" header-name="단위" :width="80"
                      :cell-style="{textAlign: 'center'}"
                      cell-renderer-framework="ag-grid-array-label-renderer"
                      :cell-renderer-params="{array:unitLabels, valueField:'value', labelField: 'label'}"/>
      <ag-grid-column field="quantity" header-name="수량" :width="80"
                      :editable="isQuantityEditable"
                      cell-editor-framework="ag-grid-input-editor"
                      :cell-renderer="quantityCellRenderer" :tooltip="tooltipReversedQuantity"
                      :cell-editor-params="{ type: 'number', decimals: 5, align: 'right' }"
                      :cell-style="{textAlign: 'right'}"/>
      <ag-grid-column field="status" header-name="상태" :width="80"
                      :cell-style="{textAlign: 'center'}"
                      cell-renderer-framework="ag-grid-array-label-renderer"
                      :cell-renderer-params="{array:statusLabels, valueField:'value', labelField: 'label'}"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.total" header-name="단가" :width="100"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.total')"
                      :cell-style="{textAlign: 'right'}" :tooltip="tooltipNumberToWords"/>

      <ag-grid-column field="estimatedAccumulatedUnitCost.directMaterial" header-name="재료비(직접)"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.directMaterial')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                      header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectMaterial"
                      header-name="재료비(간접)"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.indirectMaterial')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                      header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.directLabor" header-name="노무비(직접)"
                      :width="100"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.directLabor')"
                      :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                      header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectLabor" header-name="노무비(간접)"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.indirectLabor')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                      header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectExpenses" header-name="간접경비"
                      :cell-renderer="createCellRenderer('estimatedIsolatedUnitCost.indirectExpenses')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailedUnitCost"
                      header-class="bom-detailed-price" cell-class="bom-detailed-price"/>
      <ag-grid-column field="determinedBy.name" header-name="확정자" :width="100"/>
      <ag-grid-column field="determinedDate" header-name="확정일" :width="200"
                      :cell-renderer-params="{ago: true}"
                      cell-renderer-framework="ag-grid-datetime-renderer"/>
    </ag-grid>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-toggle v-model="detailedUnitCost" label="상세 단가" dark/>
      </q-toolbar>
    </q-page-sticky>

    <q-modal ref="itemFormModal">
      <item-form ref="itemForm" action="create" closable></item-form>
    </q-modal>

    <q-modal ref="processFormModal">
      <process-form ref="processForm" :id="selected.processId" :item-id="selected.itemId"
                    closable></process-form>
    </q-modal>

    <q-modal ref="itemSelectorModal" content-classes="column">
      <item-selector ref="itemSelector" class="col-grow"></item-selector>
    </q-modal>

    <q-modal ref="itemSpecEditorModal" content-classes="column">
      <item-spec-editor ref="itemSpecEditor" :item-id="selected.itemId"
                        :id="selected.itemSpecId"></item-spec-editor>
    </q-modal>

  </q-page>

</template>
<script>
  import { BomModel, BomStatusArray } from 'src/model/bom'
  import { ItemModel, ItemSpecModel } from 'src/model/item'
  import { ProcessModel } from 'src/model/process'
  import { UnitLabelArray } from 'src/model/shared'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import ItemForm from 'src/pages/item/item-form.vue'
  import ItemSelector from 'src/pages/item/item-selector.vue'
  import ProcessForm from 'src/pages/process/process-form.vue'
  import ItemSpecEditor from 'src/pages/item/item-spec-editor.vue'
  import BomProcessCellRenderer from './bom-process-cell-renderer.vue'
  import BomItemSpecCellRenderer from './bom-item-spec-cell-renderer.vue'

  const itemSymbol = Symbol('item')
  const itemSpecSymbol = Symbol('item-spec')
  const processSymbol = Symbol('process')

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
    data () {
      return {
        array: [],
        model: new BomModel(),
        selected: new BomModel({isNull: true}),
        statusLabels: new BomStatusArray(),
        unitLabels: new UnitLabelArray(),
        detailedUnitCost: false
      }
    },
    mounted () {
      this.statusLabels.fetch()
      this.unitLabels.fetch()
      this.$nextTick(() => this.show())
    },
    methods: {
      quantityCellRenderer (params) {
        const value = params.value
        return `${value} <sub>(${params.data.quantityPerRoot})</sub>`
      },
      async onCellValueChanged (e) {
        if (e.newValue == e.oldValue) {
          return
        }
        const data = e.data
        const parent = data.parent
        data.quantity = data.quantity ? data.quantity : 1
        await parent.changeMaterial(data)
        await this.load()
      },
      isQuantityEditable (params) {
        const parent = params.data.parent
        return parent && parent.modifiable
      },
      bomNameRenderer (params) {
        return `${params.value}<sub class="bom-name-sub">[${params.data.revision}]</sub>`
      },
      tooltipNumberToWords (params) {
        return this.$number.words(params.value)
      },
      tooltipReversedQuantity (params) {
        return `역수량 : ${(1 / params.value).toFixed(5)} (${(1 / params.data.quantityPerRoot).toFixed(
          5)})`
      },
      createCellRenderer (additionalField) {
        return function (params) {
          const addition = _.get(params.data, additionalField)
          if (addition == null || addition == undefined) {
            return params.value
          }
          return `${params.value} (${addition})`
        }
      },
      getNodeChildDetails (data) {
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
      async onGridSelectionChanged (event) {
        this.$nextTick(() => {
          this.selected = event.api.getSelectedRows()[0] || new BomModel({isNull: true})
        })
      },
      onGridRowClicked (event) {
        if (!event.node.isSelected()) {
          event.node.setSelected(true, true)
        }
      },
      async show () {
        this.load()
      },
      async load () {
        const grid = this.$refs.grid
        const selectedId = this.selected.id
        this.model = await BomModel.get(this.id)
        await this.model.fetchChildren(true)
        await this.model.visit(async (node) => {
          node[itemSymbol] = await ItemModel.get(node.itemId, true)
          node[itemSpecSymbol] = await ItemSpecModel.get(node.itemSpecId, true)
          node[processSymbol] = await ProcessModel.get(node.processId, true)
          Object.defineProperties(node, {
            'item': {
              get: function () { return this[itemSymbol] }
            },
            'itemSpec': {
              get: function () { return this[itemSpecSymbol] }
            },
            'process': {
              get: function () { return this[processSymbol] }
            }
          })
        })
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
          candidate.setSelected(true)
        })
      },
      async _onNextRevisionClick () {
        let valid = await this.selected.validateNextRevision()
        if (valid) {
          const ok = await this.$alert.confirm('다음 버전으로 진행 하시겠습니까?')
          if (ok) {
            await this.selected.nextRevision()
            this.$alert.positive('버전이 변경 되었습니다')
            this.load()
          }
        } else {
          this.$alert.warning(this.selected.$errors.nextRevision)
        }
      },

      async _onDetermineClick () {
        let valid = await this.selected.validateDetermine()
        if (valid) {
          const ok = await this.$alert.confirm('확정을 진행 하시겠습니까?')
          if (ok) {
            await this.selected.determine()
            this.$alert.positive('확정 되었습니다')
            this.load()
          }
        } else {
          this.$alert.warning(this.selected.$errors.determine)
        }
      },
      /**
       * ItemForm@saved -> BomModel.createByItemId -> selected.addMaterial
       */
      addBomByNew () {
        const selected = this.selected
        const modal = this.$refs.itemFormModal
        const form = this.$refs.itemForm
        modal.show()
        modal.$once('hide', () => {
          form.$off('saved')
        })
        form.$once('saved', async (itemModel) => {
          modal.hide()
          const material = await BomModel.createByItemId(itemModel.id)
          selected.addMaterial(material)
          this.load()
        })
      },

      addBomBySelect () {
        const selected = this.selected
        const modal = this.$refs.itemSelectorModal
        const selector = this.$refs.itemSelector
        modal.show()
        modal.$once('hide', () => {
          selector.$off('selected')
        })
        selector.$once('selected', async (itemModels) => {
          modal.hide()
          itemModels.forEach(async (itemModel) => {
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
          this.load()
        })
      },

      editProcess (data) {
        const modal = this.$refs.processFormModal
        const form = this.$refs.processForm
        const creating = !data.processId
        this.selected = data
        this.$nextTick(() => {
          modal.show()
          if (creating) {
            form.create()
          } else {
            form.show()
          }
          modal.$once('hide', () => {
            form.$off('saved')
          })
          form.$once('saved', async (processModel) => {
            modal.hide()
            data.processId = processModel.id
            if (creating) {
              await data.update()
            }
            await this.load()
          })
        })
      },

      async removeProcess (data) {
        if (!data.processId) {
          this.$alert.warning('삭제할 공정이 없습니다')
        }
        const ok = await this.$alert.confirm('공정을 삭제 하시겠습니까?')
        if (ok) {
          const process = await ProcessModel.get(data.processId)
          await process.delete()
          await this.load()
        }
      },

      editItemSpec (data) {
        const modal = this.$refs.itemSpecEditorModal
        const form = this.$refs.itemSpecEditor
        this.selected = data
        this.$nextTick(() => {
          modal.show()
          if (data.itemSpecId) {
            form.show()
          } else {
            form.create()
          }
          modal.$once('hide', () => {
            form.$off('saved')
          })
          form.$once('saved', async (itemSpecModel) => {
            modal.hide()
            data.itemSpecId = itemSpecModel.id
            const parent = data.parent
            await parent.changeMaterial(data)
            await this.load()
          })
        })
      }

    },
    computed: {
      /**
       * 선택 대상 삭제 여부
       */
      isSelectedRemovable () {
        return this.selected.parent && this.selected.parent.modifiable
      },

      isSelectedAddable () {
        return this.selected.modifiable
      },

      isNextDraftable () {
        return !this.selected.modifiable
      },

      isDeterminable () {
        return this.selected.modifiable
      }
    },
    components: {
      ItemSelector,
      ItemForm,
      ItemSpecEditor,
      ProcessForm,
      AuditViewer,
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
