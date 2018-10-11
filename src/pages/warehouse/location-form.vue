<template>
  <q-page class="column fit">

    <q-toolbar>
      <q-btn flat icon="search" label="검색">
      </q-btn>
    </q-toolbar>

    <q-card class="col-grow column" flat>

      <q-card-separator/>

      <q-card-main class="row col-grow location-grid-wrap">

        <div class="col-2 column">
          <ag-grid ref="siteGrid"
                   class="col-grow"
                   row-selection="single"
                   @selection-changed="onGridSelectionChanged($event, 'site')"
                   auto-size-columns-to-fit
                   suppress-no-rows-overlay
                   :row-data="siteArray">
            <ag-grid-column field="code" header-name="창고(Site)"
                            cell-renderer-framework="location-cell-renderer"
                            :cell-renderer-params="{innerRenderer: siteRenderer, editHandler: ()=> onEdit('site')}"/>
          </ag-grid>
          <div class="row justify-around">
            <q-btn color="secondary" outline flat icon="add" @click="onAdd('site')"/>
          </div>
        </div>
        <div class="col-2 column">
          <ag-grid ref="zoneGrid"
                   class="col-grow"
                   row-selection="single"
                   @selection-changed="onGridSelectionChanged($event, 'zone')"
                   auto-size-columns-to-fit
                   suppress-no-rows-overlay
                   :row-data="zoneArray">
            <ag-grid-column field="locationCode" header-name="구역(Zone)"
                            cell-renderer-framework="location-cell-renderer"
                            :cell-renderer-params="{innerRenderer: locationRenderer, editHandler: ()=> onEdit('zone')}"/>
          </ag-grid>
          <div class="row justify-around">
            <q-btn color="secondary" outline flat icon="add" @click="onAdd('zone')"
                   :disabled="!selected.site"/>
          </div>
        </div>
        <div class="col-2 column">
          <ag-grid ref="rackGrid"
                   class="col-grow"
                   row-selection="single"
                   @selection-changed="onGridSelectionChanged($event, 'rack')"
                   auto-size-columns-to-fit
                   suppress-no-rows-overlay
                   :row-data="rackArray">
            <ag-grid-column field="locationCode" header-name="랙(Rack)"
                            cell-renderer-framework="location-cell-renderer"
                            :cell-renderer-params="{innerRenderer: locationRenderer, editHandler: ()=> onEdit('rack')}"/>
          </ag-grid>
          <div class="row justify-around">
            <q-btn color="secondary" outline flat icon="add" :disabled="!selected.zone"
                   @click="onAdd('rack')"/>
          </div>
        </div>
        <div class="col-2 column">
          <ag-grid ref="bayGrid"
                   class="col-grow"
                   row-selection="single"
                   @selection-changed="onGridSelectionChanged($event, 'bay')"
                   auto-size-columns-to-fit
                   suppress-no-rows-overlay
                   :row-data="bayArray">
            <ag-grid-column field="locationCode" header-name="베이(Bay)"
                            cell-renderer-framework="location-cell-renderer"
                            :cell-renderer-params="{innerRenderer: locationRenderer, editHandler: ()=> onEdit('bay')}"/>
          </ag-grid>
          <div class="row justify-around">
            <q-btn color="secondary" outline flat icon="add" :disabled="!selected.rack"
                   @click="onAdd('bay')"/>
          </div>
        </div>
        <div class="col-2 column">
          <ag-grid ref="levelGrid"
                   class="col-grow"
                   row-selection="single"
                   @selection-changed="onGridSelectionChanged($event, 'level')"
                   auto-size-columns-to-fit
                   suppress-no-rows-overlay
                   :row-data="levelArray">
            <ag-grid-column field="locationCode" header-name="층(Level)"
                            cell-renderer-framework="location-cell-renderer"
                            :cell-renderer-params="{innerRenderer: locationRenderer, editHandler: ()=> onEdit('level')}"/>
          </ag-grid>
          <div class="row justify-around">
            <q-btn color="secondary" outline flat icon="add" :disabled="!selected.bay"
                   @click="onAdd('level')"/>
          </div>
        </div>
      </q-card-main>
    </q-card>

    <q-inner-loading :visible="loading">
    </q-inner-loading>

    <q-modal v-model="editing.site">
      <q-card class="col-12" flat>
        <q-card-title>
          창고(Site)
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="fas fa-asterisk" helper="구별할 코드를 입력하세요"
                   class="col-12"
                   :error="!!edit.site.$errors.code"
                   :error-label="edit.site.$errors.code">
            <q-input v-model="edit.site.code" float-label="코드"/>
          </q-field>
          <q-field icon="account_circle" helper="이름을 입력하세요"
                   class="col-12"
                   :error="!!edit.site.$errors.name"
                   :error-label="edit.site.$errors.name">
            <q-input v-model="edit.site.name" float-label="이름"/>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat color="negative" icon="delete" @click="onDelete('site')"
                 v-show="!edit.site.phantom">삭제
          </q-btn>
          <q-btn flat icon="arrow_back" v-close-overlay>취소</q-btn>
          <q-btn flat icon="save" label="저장" @click="onSave('site')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="editing.zone">
      <q-card class="col-12" flat>
        <q-card-title>
          구역(Zone)
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="fas fa-asterisk" helper="알파벳 대문자 한글자를 입력하세요"
                   class="col-12"
                   :error="!!edit.zone.$errors.code"
                   :error-label="edit.zone.$errors.code">
            <q-input v-model="edit.zone.code" float-label="코드"/>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat color="negative" icon="delete" @click="onDelete('zone')"
                 v-show="!edit.zone.phantom">삭제
          </q-btn>
          <q-btn flat icon="arrow_back" v-close-overlay>취소</q-btn>
          <q-btn flat icon="save" label="저장" @click="onSave('zone')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="editing.rack">
      <q-card class="col-12" flat>
        <q-card-title>
          랙(Rack)
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="fas fa-asterisk" helper="구별할 코드를 입력하세요"
                   class="col-12"
                   :error="!!edit.rack.$errors.code"
                   :error-label="edit.rack.$errors.code">
            <q-input v-model="edit.rack.code" type="number" float-label="코드"/>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat color="negative" icon="delete" @click="onDelete('rack')"
                 v-show="!edit.rack.phantom">삭제
          </q-btn>
          <q-btn flat icon="arrow_back" v-close-overlay>취소</q-btn>
          <q-btn flat icon="save" label="저장" @click="onSave('rack')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="editing.bay">
      <q-card class="col-12" flat>
        <q-card-title>
          베이(Bay)
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="fas fa-asterisk" helper="구별할 코드를 입력하세요"
                   class="col-12"
                   :error="!!edit.bay.$errors.code"
                   :error-label="edit.bay.$errors.code">
            <q-input v-model="edit.bay.code" type="number" float-label="코드"/>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat color="negative" icon="delete" @click="onDelete('bay')"
                 v-show="!edit.bay.phantom">삭제
          </q-btn>
          <q-btn flat icon="arrow_back" v-close-overlay>취소</q-btn>
          <q-btn flat icon="save" label="저장" @click="onSave('bay')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="editing.level">
      <q-card class="col-12" flat>
        <q-card-title>
          층(Level)
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="fas fa-asterisk" helper="구별할 코드를 입력하세요"
                   class="col-12"
                   :error="!!edit.level.$errors.code"
                   :error-label="edit.level.$errors.code">
            <q-input v-model="edit.level.code" type="number" float-label="코드"/>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat color="negative" icon="delete" @click="onDelete('level')"
                 v-show="!edit.level.phantom">삭제
          </q-btn>
          <q-btn flat icon="arrow_back" v-close-overlay>취소</q-btn>
          <q-btn flat icon="save" label="저장" @click="onSave('level')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

  </q-page>

</template>
<script>
  import {
    WarehouseBayArray,
    WarehouseBayModel,
    WarehouseLevelArray,
    WarehouseLevelModel,
    WarehouseRackArray,
    WarehouseRackModel,
    WarehouseSiteArray,
    WarehouseSiteModel,
    WarehouseZoneArray,
    WarehouseZoneModel
  } from 'src/model/warehouse'
  import {Model} from 'src/model/model'
  import LocationCellRenderer from './location-cell-renderer.vue'

  export default {
    props: {},
    data() {
      return {
        editing: {
          site: false,
          zone: false,
          rack: false,
          bay: false,
          level: false
        },
        selected: {
          site: null,
          zone: null,
          rack: null,
          bay: null,
          level: null
        },
        edit: {
          site: new Model(),
          zone: new Model(),
          rack: new Model(),
          bay: new Model(),
          level: new Model()
        },
        siteArray: new WarehouseSiteArray(),
        zoneArray: new WarehouseZoneArray(),
        rackArray: new WarehouseRackArray(),
        bayArray: new WarehouseBayArray(),
        levelArray: new WarehouseLevelArray(),
        loading: false
      }
    },
    mounted() {
      this.siteArray.fetch()
    },
    methods: {
      siteRenderer(params) {
        return `${params.data.code} <sub>(${params.data.name})</sub>`
      },
      locationRenderer(params) {
        return `${params.data.code} <sub>(${params.data.locationCode})</sub>`
      },
      async onGridSelectionChanged(event, type) {
        this.$nextTick(() => this.selected[type] = event.api.getSelectedRows()[0])
      },
      async onAdd(type) {
        const factories = {
          site: () => {
            const model = new WarehouseSiteModel()
            return model
          },
          zone: () => {
            const model = new WarehouseZoneModel()
            model.siteId = this.selected.site.id
            return model
          },
          rack: () => {
            const model = new WarehouseRackModel()
            model.zoneId = this.selected.zone.id
            return model
          },
          bay: () => {
            const model = new WarehouseBayModel()
            model.rackId = this.selected.rack.id
            return model
          },
          level: () => {
            const model = new WarehouseLevelModel()
            model.bayId = this.selected.bay.id
            return model
          }
        }
        this.editing[type] = true
        this.edit[type] = factories[type]()
      },
      async onEdit(type) {
        this.editing[type] = true
        this.edit[type] = this.selected[type]
      },
      async onSave(type) {
        const arrays = {
          site: this.siteArray,
          zone: this.zoneArray,
          rack: this.rackArray,
          bay: this.bayArray,
          level: this.levelArray
        }
        const model = this.edit[type]
        const valid = await model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await model.save()
            await arrays[type].fetch()
            const selected = this.selected[type]
            this.selected[type] = null
            this.selected[type] = selected
            this.editing[type] = false
            this.edit[type] = new Model()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async onDelete(type) {
        const arrays = {
          site: this.siteArray,
          zone: this.zoneArray,
          rack: this.rackArray,
          bay: this.bayArray,
          level: this.levelArray
        }
        const model = this.edit[type]
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          await model.delete()
          await arrays[type].fetch()
          const selected = this.selected[type]
          this.selected[type] = null
          this.selected[type] = selected
          this.editing[type] = false
          this.edit[type] = new Model()
        }
      },
      async show(id) {

      }
    },
    computed: {},
    components: {
      LocationCellRenderer
    },
    watch: {
      'selected.site': async function (value) {
        this.$refs.zoneGrid.api.deselectAll()
        this.$refs.zoneGrid.api.clearFocusedCell()
        this.zoneArray = new WarehouseZoneArray(value)
        if (value) {
          await this.zoneArray.fetch()
        }
      },
      'selected.zone': async function (value) {
        this.$refs.rackGrid.api.deselectAll()
        this.$refs.rackGrid.api.clearFocusedCell()
        this.rackArray = new WarehouseRackArray(value)
        if (value) {
          await this.rackArray.fetch()
        }
      },
      'selected.rack': async function (value) {
        this.$refs.bayGrid.api.deselectAll()
        this.$refs.bayGrid.api.clearFocusedCell()
        this.bayArray = new WarehouseBayArray(value)
        if (value) {
          await this.bayArray.fetch()
        }
      },
      'selected.bay': async function (value) {
        this.$refs.levelGrid.api.deselectAll()
        this.$refs.levelGrid.api.clearFocusedCell()
        this.levelArray = new WarehouseLevelArray(value)
        if (value) {
          await this.levelArray.fetch()
        }
      },
      'selected.level': async function (value) {

      }
    }
  }

</script>
<style lang="stylus">
  .location-grid-wrap
    > div
      border-right: dotted gray 1px
</style>
