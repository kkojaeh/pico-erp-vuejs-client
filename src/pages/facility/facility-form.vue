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
    FacilityModel
  } from 'src/model/facility'

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
        categoryLabelArray: new FacilityCategoryLabelArray()
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.categoryLabelArray.fetch()
    },
    methods: {
      async create() {
        this.model = new FacilityModel()
      },
      async load(id) {
        this.model = await FacilityModel.get(id)
      },
      async show() {
        this.load(this.id)
      },
      async onSave() {
        let valid = await this.model.validate()
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
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
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
