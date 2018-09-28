<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        설비 정보
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="설비 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"
                   :readonly="!modifiable" :hide-underline="!modifiable"/>
        </q-field>

        <q-field icon="account_box" helper="설비 분류를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.categoryId"
                 :error-label="model.$errors.categoryId">
          <c-autocomplete-select float-label="설비 분류" v-model="model.categoryId"
                                 :label="categoryModel.name" :options="categoryLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!modifiable" :hide-underline="!modifiable">
            <template slot="option" slot-scope="option">
              {{option.label}}<!--<br>
              {{option.stamp}} - {{option.subLabel}}-->
            </template>
          </c-autocomplete-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        공정 유형
        <span slot="subtitle">해당 설비에서 진행할 수 있는 공정 유형입니다</span>
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddProcessType"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.processType"
                 @click="onRemoveProcessType"/>
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
                 @selection-changed="onProcessTypeSelectionChanged"
                 :row-data="processTypeArray">

          <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
          <ag-grid-column field="processType.id" header-name="아이디" :width="150"/>
          <ag-grid-column field="processType.name" header-name="이름" :width="200"/>
          <ag-grid-column field="speedVariationRate" header-name="속도 증감율" :width="100"
                          :editable="modifiable"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'0.00%', words:false}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number',decimals: 2, prefix:'+', suffix:'%', align:'right', getValue: percentGetValue, setValue: percentSetValue }"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="defectiveVariationRate" header-name="불량 증감율" :width="100"
                          :editable="modifiable"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'0.00%', words:false}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number',decimals: 2, prefix:'+', suffix:'%', align:'right', getValue: percentGetValue, setValue: percentSetValue }"
                          :cell-style="{textAlign: 'right'}"/>

        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn v-if="modifiable" flat icon="save" @click="onSave()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    FacilityCategoryLabelArray,
    FacilityCategoryModel,
    FacilityModel,
    FacilityProcessTypeArray,
    FacilityProcessTypeModel
  } from 'src/model/facility'
  import Big from 'big.js'

  export default {
    authorized: {
      'facilityManager': 'hasRole(\'FACILITY_MANAGER\')'
    },
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      itemId: {
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
        model: new FacilityModel(),
        categoryModel: new FacilityCategoryModel(),
        categoryLabelArray: new FacilityCategoryLabelArray(),
        processTypeArray: new FacilityProcessTypeArray(),
        selected: {
          processType: null
        }
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.categoryLabelArray.fetch()
    },
    methods: {
      percentGetValue(value) {
        return Number(new Big(value).times(100).round(2))
      },
      percentSetValue(value) {
        return Number(new Big(value).div(100))
      },
      async onAddProcessType() {
        const processTypes = await this.$selectProcessType({multiple: false})
        if (processTypes && processTypes.length) {
          const processType = processTypes[0]
          const model = new FacilityProcessTypeModel({
            processTypeId: processType.id
          })
          await model.fetchReference()
          this.processTypeArray.push(model)
        }
      },
      async onRemoveProcessType() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.processTypeArray.remove(this.selected.processType)
          this.selected.processType = null
        }
      },
      onProcessTypeSelectionChanged(event) {
        this.selected.processType = event.api.getSelectedRows()[0]
      },
      async create() {
        this.model = new FacilityModel()
        this.processTypeArray = new FacilityProcessTypeArray(this.model)
      },
      async load(id) {
        this.model = await FacilityModel.get(id)
        const processTypeArray = new FacilityProcessTypeArray(this.model)
        await processTypeArray.fetch()
        this.processTypeArray = processTypeArray
      },
      async show() {
        this.load(this.id)
      },
      async onSave() {
        let valid = ![
          await this.model.validate(),
          await this.processTypeArray.validate()
        ].includes(false)
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$emit('saved', this.model)
            this.$alert.positive('저장 되었습니다')
            if (this.closable && !this.closeConfirmed) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
                return
              }
            }
            this.load(this.model.id)
          }
        } else {
          this.$redrawGrids()
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
        await this.processTypeArray.save()
      }
    },
    computed: {
      modifiable() {
        return this.$authorized.facilityManager && !this.model.deleted
      },
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'model.categoryId': async function (to) {
        this.categoryModel = await FacilityCategoryModel.get(to, true)
      }
    },
    components: {}
  }
</script>
