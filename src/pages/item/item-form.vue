<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        품목 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-input :value="model.code" float-label="코드" readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                   flat></q-btn>
          </q-input>
        </q-field>

        <q-field icon="fa-comment" helper="품목의 상태를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-select float-label="상태" v-model="model.status"
                    :options="statusLabels" readonly hide-underline></q-select>
        </q-field>

        <q-field icon="fa-comment" helper="품목의 유형을 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.type"
                 :error-label="model.$errors.type">
          <q-select float-label="유형" v-model="model.type"
                    :options="typeLabels"></q-select>
        </q-field>

        <q-field icon="account_circle" helper="품목 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active">
            <q-btn icon="content_copy" v-clipboard:copy="model.name" v-clipboard-notify
                   flat></q-btn>
          </q-input>
        </q-field>

        <q-field icon="fa-tag" helper="품목 분류를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.categoryId"
                 :error-label="model.$errors.categoryId">

          <c-autocomplete-select float-label="분류" v-model="model.categoryId"
                                 :label.sync="categoryModel.name" :options="categoryLabels"
                                 label-field="label" value-field="value"
                                 @search="onCategorySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}[{{option.stamp}}]<br>
              {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="chevron_right" helper="품목에서 사용되는 단위를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.unit"
                 :error-label="model.$errors.unit">
          <q-select float-label="단위" v-model="model.unit"
                    :options="unitLabels" filter autofocus-filter></q-select>
        </q-field>

        <q-field icon="monetization_on" helper="구매 가능 여부를 체크하세요(구매시 노출여부가 달라 집니다)"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.purchasable"
                 :error-label="model.$errors.purchasable">
          <q-checkbox label="구매가능" v-model="model.purchasable"/>
        </q-field>

        <q-field icon="monetization_on" helper="판매 가능 여부를 체크하세요(판매시 노출여부가 달라 집니다)"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.saleable"
                 :error-label="model.$errors.saleable">
          <q-checkbox label="판매가능" v-model="model.saleable"/>
        </q-field>

        <q-field icon="monetization_on" helper="공정 비용을 제외한 금액(구매/외주 기준 금액, 직접 재료비)"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.baseUnitCost"
                 :error-label="model.$errors.baseUnitCost">
          <q-input type="number" label="기준 금액" v-model="model.baseUnitCost" align="right"/>
          <q-tooltip>
            {{$number.words(model.baseUnitCost)}}
          </q-tooltip>
        </q-field>

        <q-field icon="description" helper="품목의 설명을 입력하세요"
                 class="col-xs-12 col-md-12 col-xl-12"
                 :error="!!model.$errors.description"
                 :error-label="model.$errors.description"
                 :count="200">
          <q-input type="textarea" v-model="model.description" float-label="설명"
                   rows="5"
                   max-length="200"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        고객 정보
        <span slot="subtitle">고객과 관련된 상품시 입력</span>
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="fa-building" helper="고객사를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabels"
                                 label-field="label" value-field="value"
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="외부에서 식별에 사용되는 코드를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.externalCode"
                 :error-label="model.$errors.externalCode">
          <q-input v-model="model.externalCode" float-label="외부 코드" class="ime-mode-disabled">
            <q-btn icon="content_copy" v-clipboard:copy="model.externalCode" v-clipboard-notify
                   flat></q-btn>
          </q-input>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        기타 정보
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="view_comfy"
                 helper="스펙 유형을 지정하세요(종이와 같이 세부 사항에 따라 단가 정보등이 가변합니다)"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.specTypeId"
                 :error-label="model.$errors.specTypeId">

          <c-autocomplete-select float-label="스펙 유형" v-model="model.specTypeId"
                                 :label.sync="specTypeModel.name" :options="specTypeLabels"
                                 label-field="label" value-field="value"
                                 @search="onSpecTypeSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}[{{option.stamp}}]<br>
              {{option.subLabel}}
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
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating" v-if="$authorized.itemManager">이력
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" :url="`/audit/item/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="play_arrow" v-show="!creating && model.isActivatable" v-if="$authorized.itemManager"
               @click="_onActivateClick">활성화
        </q-btn>
        <q-btn flat icon="pause" v-show="!creating && model.isDeactivatable" v-if="$authorized.itemManager"
               @click="_onDeactivateClick">비활성화
        </q-btn>
        <router-link :to="`/process/show/${processModel.id}`" v-show="!!processModel.id"
                     v-if="$authorized.processManager">
          <q-btn flat icon="settings_applications">공정</q-btn>
        </router-link>
        <router-link :to="`/bom/${model.id}`" v-show="!creating"
                     v-if="$authorized.bomAccessor">
          <q-btn flat icon="playlist_add_check">BOM</q-btn>
        </router-link>
        <q-btn flat icon="save" v-if="$authorized.itemManager" @click="_onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    ItemCategoryLabelArray,
    ItemCategoryModel,
    ItemModel,
    ItemSpecTypeLabelArray,
    ItemSpecTypeModel,
    ItemStatusArray,
    ItemTypeArray
  } from 'src/model/item'
  import { ProcessModel } from 'src/model/process'
  import { CompanyLabelArray, CompanyModel } from 'src/model/company'
  import { UnitLabelArray } from 'src/model/shared'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'

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
    authorized: {
      'itemManager': 'hasRole(\'ITEM_MANAGER\')',
      'processManager': 'hasRole(\'PROCESS_MANAGER\')',
      'bomAccessor': 'hasAnyRole(\'BOM_MANAGER\', \'BOM_ACCESSOR\')'
    },
    data () {
      return {
        model: new ItemModel(),
        companyLabels: new CompanyLabelArray(),
        statusLabels: new ItemStatusArray(),
        typeLabels: new ItemTypeArray(),
        categoryLabels: new ItemCategoryLabelArray(),
        specTypeLabels: new ItemSpecTypeLabelArray(),
        unitLabels: new UnitLabelArray(),
        categoryModel: new ItemCategoryModel(),
        customerModel: new CompanyModel(),
        specTypeModel: new ItemSpecTypeModel(),
        processModel: new ProcessModel(),
        creating: false
      }
    },
    mounted () {
      this.unitLabels.fetch()
      this.statusLabels.fetch()
      this.typeLabels.fetch()
      this.categoryLabels.query()
      this.specTypeLabels.query()
      this.companyLabels.query()
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async onCustomerSearch (keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onCategorySearch (keyword, done) {
        await this.categoryLabels.query(keyword)
        done()
      },
      async onSpecTypeSearch (keyword, done) {
        await this.specTypeLabels.query(keyword)
        done()
      },
      async create () {
        this.creating = true
        this.model = new ItemModel()
      },
      async show () {
        this.creating = false
        this.model = await ItemModel.get(this.id)
        const processExists = await ProcessModel.existsByItemId(this.id)
        this.processModel = processExists ? await ProcessModel.getByItemId(this.id, true)
          : new ProcessModel()
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateCreate()
          : await this.model.validateUpdate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              this.$closeOverlay()
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async _onActivateClick () {
        const ok = await this.$alert.confirm('활성화 하시겠습니까?')
        if (ok) {
          await this.model.activate()
          this.$alert.positive('활성화 되었습니다')
          this.show()
        }
      },
      async _onDeactivateClick () {
        const ok = await this.$alert.confirm('비활성화 하시겠습니까?')
        if (ok) {
          await this.model.deactivate()
          this.$alert.positive('비활성화 되었습니다')
          this.show()
        }
      },
      async save () {
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
        this.$emit('saved', this.model)
      }
    },
    computed: {},
    watch: {
      'model.categoryId': async function (to) {
        this.categoryModel = await ItemCategoryModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.customerModel = await CompanyModel.get(to, true)
      },
      'model.specTypeId': async function (to) {
        this.specTypeModel = await
          ItemSpecTypeModel.get(to, true)
      }
    },
    components: {
      AuditViewer
    }
  }
</script>
