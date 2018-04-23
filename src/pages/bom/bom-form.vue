<template>
  <q-page class="row">

    <q-card class="col-md-8 col-xl-8 col-xs-12 column" flat>

      <q-card-main class="col-12" style="height:auto;">

        <ag-grid ref="grid"
                 row-selection="single"
                 enable-col-resize
                 enable-sorting
                 style="width: 100%;height:100%;"
                 :get-node-child-details="getNodeChildDetails"
                 @selection-changed="onGridSelectionChanged"
                 @row-clicked="onGridRowClicked"
                 :embed-full-width-rows="true"
                 auto-size-columns-to-fit
                 :row-data="array">
          <ag-grid-column field="id" header-name="이름" cellRenderer="agGroupCellRenderer"
                          :checkbox-selection="true" :min-width="500"
                          :cell-renderer-params="{
                            innerRenderer: cellRenderer,
                            suppressCount: true
                          }"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-card class="col-md-4 col-xl-4 col-xs-12 scroll">

      <q-card-separator v-show="!isSelectedRoot"/>

      <q-card-main class="row gutter-md" v-show="!isSelectedRoot">

        <q-field icon="perm_identity" helper="상위 BOM 품목의 1개 수량에 필요한 수량을 의미합니다"
                 class="col-12">
          <q-input type="number" v-model="selected.quantity"
                   :prefix="`역비율 : ${reversedQuantityRate}`" float-label="필요 수량" align="right"
                   :readonly="!isQuantityModifiable" :hide-underline="!isQuantityModifiable"
                   @blur="onQuantityBlur"/>
        </q-field>

        <q-field v-show="isSelectedSpecifiable" icon="fa-comment"
                 helper="상위 BOM 품목에서 사용할 스펙을 정의합니다"
                 class="col-12 justify-end">
          <q-input value="" float-label="품목 스펙" readonly hide-underline>
            <q-btn icon="add_circle" flat v-if="!selected.itemSpecId" @click="editItemSpec"></q-btn>
            <q-btn icon="settings" flat v-if="selected.itemSpecId" @click="editItemSpec"></q-btn>
          </q-input>
        </q-field>

      </q-card-main>

      <q-card-separator v-show="!isSelectedRoot"/>

      <q-card-main class="row gutter-md">

        <q-field icon="shopping_cart" helper="BOM 대상 품목입니다"
                 class="col-12">
          <q-input v-model="itemModel.code" float-label="품목 코드" readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="itemModel.code" v-clipboard-notify
                   flat></q-btn>
          </q-input>
          <q-input v-model="itemModel.name" float-label="품목 이름" readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="itemModel.name" v-clipboard-notify
                   flat></q-btn>
          </q-input>
        </q-field>

        <q-field icon="fa-user" helper="공정을 지정 하세요(원재료의 경우 공정이 없습니다)"
                 class="col-12"
                 :error="!!selected.$errors.processId"
                 :error-label="selected.$errors.processId">
          <q-input :value="processName" float-label="공정" readonly hide-underline>
            <q-btn icon="add_circle" flat v-if="isProcessAddable" @click="editProcess"></q-btn>
            <q-btn icon="settings" flat v-if="isProcessModifiable" @click="editProcess"></q-btn>
            <q-btn icon="remove_circle" flat v-if="isProcessRemovable"
                   @click="removeProcess"></q-btn>
          </q-input>
        </q-field>

        <q-field icon="attach_money" helper="BOM 의 단가 (공정단가 또는 구입/외주단가)"
                 class="col-12">
          <q-input type="number" v-model="selected.estimatedUnitCost.accumulated"
                   float-label="BOM 단가" readonly hide-underline align="right">
            <q-tooltip>
              {{$number.words(selected.estimatedUnitCost.accumulated)}}
            </q-tooltip>
          </q-input>
        </q-field>

        <q-field icon="perm_identity" helper="BOM이 변경된 횟수를 의미합니다"
                 class="col-12">
          <q-input v-model="selected.revision" float-label="버전" readonly hide-underline
                   align="right"/>
        </q-field>

        <q-field icon="fa-comment" helper="BOM 의 상태입니다"
                 class="col-12">
          <q-select float-label="상태" v-model="selected.status"
                    :options="statusLabels" readonly hide-underline></q-select>
        </q-field>

        <q-field icon="fa-calendar" helper="BOM 을 확정한 사용자입니다"
                 class="col-12" v-if="selected.determinedBy">
          <q-input float-label="확정자"
                   :value="selected.determinedBy ? selected.determinedBy.name : ''"
                   readonly hide-underline/>
        </q-field>

        <q-field icon="fa-calendar" helper="BOM 을 확정한 일자입니다"
                 class="col-12" v-if="selected.determinedBy">
          <q-input float-label="확정일"
                   :value="`${$date.format(selected.determinedDate)}  (${$date.ago(selected.determinedDate)})`"
                   readonly hide-underline/>
        </q-field>

      </q-card-main>

    </q-card>


    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <router-link :to="`/bom/revision/${selected.itemId}`" target="_blank">
          <q-btn flat icon="open_in_new">버전 목록</q-btn>
        </router-link>
        <router-link :to="`/item/show/${selected.itemId}`" target="_blank">
          <q-btn flat icon="open_in_new">품목</q-btn>
        </router-link>

        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="check" @click="_onDetermineClick" v-if="isDeterminable">확정</q-btn>
        <q-btn flat icon="autorenew" @click="_onNextRevisionClick" v-if="isNextDraftable">새버전
        </q-btn>

        <q-card-actions align="end" :disabled="!isSelected">
          <q-btn flat icon="remove" label="제거" :disabled="!isSelectedRemovable"></q-btn>
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
        </q-card-actions>
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
  import { ItemModel } from 'src/model/item'
  import { ProcessModel } from 'src/model/process'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import ItemForm from 'src/pages/item/item-form.vue'
  import ItemSelector from 'src/pages/item/item-selector.vue'
  import ProcessForm from 'src/pages/process/process-form.vue'
  import ItemSpecEditor from 'src/pages/item/item-spec-editor.vue'

  const itemSymbol = Symbol('item')

  export default {
    props: {
      id: {
        type: String
      },
      itemId: {
        type: String
      },
      revision: {
        type: Number
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
        itemModel: new ItemModel(),
        processModel: new ProcessModel(),
        selected: new BomModel({isNull: true}),
        statusLabels: new BomStatusArray(),
      }
    },
    mounted () {
      this.statusLabels.fetch()
      this.$nextTick(() => this.show())
    },
    methods: {
      cellRenderer (params) {
        const status = this.statusLabel(params.data.status)
        const item = params.data[itemSymbol]
        const quantity = params.data.quantity
        const prefix = `<small>[${item.code}]</small> `
        const postfix = `<small class="bom-row-tip">(${quantity}) [${status}]</small>`
        return `${prefix}${item.name}${postfix}`
      },
      statusLabel (value) {
        const label = this.statusLabels.find(data => data.value == value)
        return label ? label.label : ''
      },
      getNodeChildDetails (data) {
        const children = data.getChildren()
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
        this.selected = event.api.getSelectedRows()[0] || new BomModel({isNull: true})
        this.itemModel = this.selected[itemSymbol]
        this.processModel = await ProcessModel.get(this.selected.processId, true)
      },
      onGridRowClicked (event) {
        if (!event.node.isSelected()) {
          event.node.setSelected(true)
        }
      },
      async onProcessTypeSearch (keyword, done) {
        await this.processTypeLabels.query(keyword)
        done()
      },
      async show () {
        this.load()
      },
      async load () {
        const grid = this.$refs.grid
        const selectedId = this.selected.id
        if (this.id) {
          this.model = await BomModel.get(this.id)
        } else {
          this.model = await BomModel.getByItemId(this.itemId, this.revision)
        }
        await this.model.fetchChildren(true)
        await this.model.visit(async (node) => {
          node[itemSymbol] = await ItemModel.get(node.itemId, true)
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

      editProcess () {
        const modal = this.$refs.processFormModal
        const form = this.$refs.processForm
        const selected = this.selected
        const creating = !selected.processId
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
          selected.processId = processModel.id
          if (creating) {
            await selected.update()
          }
          await this.load()
        })
      },

      async removeProcess () {
        const selected = this.selected
        if (!selected.processId) {
          this.$alert.warning('삭제할 공정이 없습니다')
        }
        const ok = await this.$alert.confirm('공정을 삭제 하시겠습니까?')
        if (ok) {
          const process = await ProcessModel.get(selected.processId)
          await process.delete()
          await this.load()
        }
      },

      editItemSpec () {
        const modal = this.$refs.itemSpecEditorModal
        const form = this.$refs.itemSpecEditor
        const selected = this.selected
        modal.show()
        if (selected.itemSpecId) {
          form.show()
        } else {
          form.create()
        }
        modal.$once('hide', () => {
          form.$off('saved')
        })
        form.$once('saved', async (itemSpecModel) => {
          modal.hide()
          selected.itemSpecId = itemSpecModel.id
          const parent = this.selected.getParent()
          await parent.changeMaterial(selected)
          await this.load()
        })
      },

      async onQuantityBlur () {
        const parent = this.selected.getParent()
        this.selected.quantity = this.selected.quantity ? this.selected.quantity : 1
        await parent.changeMaterial(this.selected)
        await this.load()
      }
    },
    computed: {
      /**
       * 선택 여부
       */
      isSelected () {
        return !this.selected.isNull
      },
      /**
       * 최상위 선택 여부
       */
      isSelectedRoot () {
        return this.selected.id == this.model.id
      },
      /**
       * 선택 대상 삭제 여부
       */
      isSelectedRemovable () {
        return this.isSelected && !this.isSelectedRoot && this.selected.getParent().modifiable
      },
      /**
       * 선택 대상 품목 스펙 정의 여부
       */
      isSelectedSpecifiable () {
        return !!this.selected.specifiable
      },

      isSelectedAddable () {
        return this.isSelected && this.selected.modifiable
      },
      /**
       * 공정 이름 (없을 때 없음으로 표시)
       */
      processName () {
        return this.selected.processId ? this.processModel.name : 'N/A'
      },
      /**
       * 공정 추가 가능 여부
       */
      isProcessAddable () {
        return this.isSelected && this.selected.modifiable && !this.selected.processId
      },

      isProcessModifiable () {
        return this.isSelected && this.selected.processId
      },

      isProcessRemovable () {
        return this.isSelected && this.selected.modifiable && this.selected.processId
      },

      isQuantityModifiable () {
        const parent = this.selected.getParent()
        return this.isSelected && parent && parent.modifiable
      },

      isNextDraftable () {
        return this.isSelected && !this.selected.modifiable
      },

      isDeterminable () {
        return this.isSelected && this.selected.modifiable
      },

      reversedQuantityRate () {
        const quantity = this.selected.quantity
        if (quantity) {
          return Number((1 / quantity).toFixed(5))
        }
      }
    },
    components: {
      ItemSelector,
      ItemForm,
      ItemSpecEditor,
      ProcessForm,
      AuditViewer
    }
  }
</script>
<style>
  .bom-row-tip {
    position: absolute;
    top: 0px;
    right: 0px;
    color: gray;
  }
</style>
