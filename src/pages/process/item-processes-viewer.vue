<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        공정
        <q-btn flat icon="help" @click="onHelpProcessesEditor"></q-btn>
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAdd" v-show="updatable"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" @click="onRemove"
                 v-show="updatable"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row" style="min-height: 300px;">
        <ag-grid class="col-grow"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 style="min-width: 500px;"
                 :row-data="processes"
                 @cell-clicked="onGridCellClicked"
                 @selection-changed="onGridSelectionChanged">
          <ag-grid-column :checkbox-selection="true" field="name" header-name="이름"
                          :cell-style="{'text-decoration': 'underline', 'cursor': 'pointer'}"
                          :width="150"/>
          <ag-grid-column field="status" header-name="상태" :width="100"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"
                          :cell-style="{textAlign: 'center'}"/>
          <ag-grid-column field="difficulty" header-name="난이도" :width="100"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-style="{textAlign: 'center'}"
                          :cell-renderer-params="{array:difficultyLabelArray, valueField:'value', labelField: 'label'}"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-btn-dropdown label="이동" flat icon="unfold_more" v-show="isUpMovable || isDownMovable"
                        v-if="updatable">
          <q-btn flat icon="arrow_drop_up" :disabled="!isUpMovable" @click="onMoveUp">위로</q-btn>
          <q-btn flat icon="arrow_drop_down" :disabled="!isDownMovable" @click="onMoveDown">아래로
          </q-btn>
        </q-btn-dropdown>
        <q-toolbar-title>
        </q-toolbar-title>

        <q-btn flat v-show="updatable" icon="save" @click="onSave()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    ItemProcessArray,
    ProcessDifficultyArray,
    ProcessStatusArray,
    ProcessViewer
  } from 'src/model/process'

  export default {
    props: {
      itemId: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      },
      updatable: {
        type: Boolean,
        default: true
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    authorized: {
      'bomManager': 'hasRole(\'BOM_MANAGER\')'
    },
    data() {
      return {
        processes: new ItemProcessArray(),
        selected: null,
        statusLabelArray: new ProcessStatusArray(),
        difficultyLabelArray: new ProcessDifficultyArray()
      }
    },
    async mounted() {
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.difficultyLabelArray.fetch()
      ])
      this.refresh()
      this.onHelpProcessesEditor()
    },
    methods: {
      async refresh() {
        this.load(this.itemId)
      },
      async onGridSelectionChanged(event) {
        this.$nextTick(() => {
          this.selected = event.api.getSelectedRows()[0]
        })
      },
      async onGridCellClicked(event) {
        if (event.colDef.field == "name") {
          const data = event.data
          const viewer = new ProcessViewer(this)
          viewer.id = data.id

          const changed = await viewer.show()
          if (changed) {
            await this.refresh()
            this.$emit('changed')
          }
        }
      },
      onHelpProcessesEditor() {
        this.$alert.info('위의 공정부터 아래의 공정으로 진행됩니다')
      },
      async load(itemId) {
        await this.processes.fetch(itemId)
      },
      async onAdd() {
        const viewer = new ProcessViewer(this)
        viewer.itemId = this.itemId

        const created = await viewer.create()
        if (created) {
          this.$emit('changed')
          await this.refresh()
        }
      },
      async onRemove() {
        const ok = await this.$alert.confirm('해당 공정을 삭제 하시겠습니까?')
        if (ok) {
          const selected = this.selected
          await selected.delete()
          this.$emit('changed')
          await this.refresh()
        }
      },

      async onMoveUp() {
        const selected = this.selected
        const order = selected.order
        const index = this.processes.indexOf(selected)
        const previous = this.processes[index - 1]
        const previousOrder = previous.order
        await previous.changeOrder(order)
        await selected.changeOrder(previousOrder)
        await this.refresh()
      },

      async onMoveDown() {
        const selected = this.selected
        const order = selected.order
        const index = this.processes.indexOf(selected)
        const previous = this.processes[index + 1]
        const previousOrder = previous.order
        await previous.changeOrder(order)
        await selected.changeOrder(previousOrder)
        await this.refresh()
      }
    },
    computed: {
      isUpMovable() {
        const selected = this.selected
        if (!selected) {
          return false
        }
        const index = this.processes.indexOf(selected)
        return index > 0
      },

      isDownMovable() {
        const selected = this.selected
        if (!selected) {
          return false
        }
        const index = this.processes.indexOf(selected)
        return index < this.processes.length - 1
      }
    },
    components: {}
  }
</script>
<style lang="stylus">

  .json-schema-editor-container
    .row
      margin-bottom: 20px
      > div
        width: 100%
    .form-control
      width: 100%
      *
        width: 100%
      input
        border-top: none
        border-left: none
        border-right: none
      input[type="number"]
        text-align: right

    h3
      display: block
      font-size: 1.17em
      margin-top: 1em
      margin-bottom: 1em
      margin-left: 0
      margin-right: 0
      font-weight: bold

</style>
