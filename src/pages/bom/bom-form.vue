<template>
  <!-- style="min-width: 70vw; max-width:95vw" -->
  <q-layout class="row items-baseline layout-padding" view="hHh Lpr fFf">

    <q-card class="col-12" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="공정 유형을 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!creating" :hide-underline="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="공정 유형의 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="fa-user" helper="공정 유형의 분류를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.processInfoTypeId"
                 :error-label="model.$errors.processInfoTypeId">
          <c-autocomplete-select float-label="분류" v-model="model.processInfoTypeId"
                                 :label.sync="model.processInfoTypeName" :options="infoTypeLabels"
                                 label-field="label" value-field="value"
                                 @search="onProcessInfoTypeSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="pie_chart" helper="공정의 단가 비율을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-6"
                 :error="!!model.$errors.costRates"
                 :error-label="model.$errors.costRates">
          <q-list highlight separator>
            <q-list-header class="row justify-between">
              <div>공정단가 비율</div>
              <div style="padding-right: 10px;">{{totalCostRate * 100}}% / 100%</div>

            </q-list-header>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  직접 노무비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.directLaborCostRate"
                    label-always
                    :label-value="model.costRates.directLaborCostRate * 100 + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 노무비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectLaborCostRate"
                    label-always
                    :label-value="model.costRates.indirectLaborCostRate * 100 + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 재료비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectMaterialCostRate"
                    label-always
                    :label-value="model.costRates.indirectMaterialCostRate * 100 + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 경비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectExpensesRate"
                    label-always
                    :label-value="model.costRates.indirectExpensesRate * 100 + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
          </q-list>
        </q-field>
      </q-card-main>

    </q-card>

    <q-layout-footer>
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="$emit('close')" v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating">이력
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" url="/audit/process-type/${id}"
                          :data="model"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-layout-footer>


  </q-layout>

</template>
<script>
  import { ProcessTypeModel } from './bom-model'
  import { ProcessInfoTypeLabelArray } from './process-info-type-model'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import * as _ from 'lodash'

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
    data () {
      return {
        model: new ProcessTypeModel(),
        infoTypeLabels: new ProcessInfoTypeLabelArray(),
        creating: false
      }
    },
    mounted () {
      this.$nextTick(() => this[this.action]())
    },
    methods: {
      async onProcessInfoTypeSearch (keyword, done) {
        await this.infoTypeLabels.query(keyword)
        done()
      },
      async create () {
        this.creating = true
      },
      async show () {
        this.creating = false
        this.model.id = this.id
        await this.model.fetch()
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateForCreate()
          : await this.model.validateForUpdate()
        if (valid) {
          await this.save()
          this.$alert.positive('저장 되었습니다')
          this.$emit('close')
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save () {
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
      }
    },
    computed: {
      totalCostRate () {
        let sum = 0
        _.forIn(this.model.costRates, (value, key) => {
          sum += value
        })
        return sum
      }
    },
    components: {
      AuditViewer
    }
  }
</script>
