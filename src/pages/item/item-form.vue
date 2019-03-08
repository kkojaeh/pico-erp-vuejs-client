<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        품목 정보
        <span slot="right" v-if="!!model.code">{{model.code}}
            <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                   flat></q-btn>
          </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="품목 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"
                   :readonly="!updatable" :hide-underline="!updatable">
            <q-btn icon="content_copy" v-clipboard:copy="model.name" v-clipboard-notify slot="after"
                   flat></q-btn>
          </q-input>
        </q-field>

        <q-field icon="fas fa-comment" helper="품목의 상태를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status"
                    :options="statusLabelArray" readonly hide-underline></q-select>
        </q-field>

        <q-field icon="fas fa-comment" helper="품목의 유형을 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.type"
                 :error-label="model.$errors.type">
          <q-select float-label="유형" v-model="model.type"
                    :options="typeLabelArray"
                    :readonly="!updatable" :hide-underline="!updatable"></q-select>
        </q-field>

        <q-field icon="fas fa-tag" helper="품목 분류를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.categoryId"
                 :error-label="model.$errors.categoryId">

          <c-autocomplete-select float-label="분류" v-model="model.categoryId"
                                 :label="categoryModel.name" :options="categoryLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCategorySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}[{{option.stamp}}]<br>
              {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="chevron_right" helper="품목에서 사용되는 단위를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.unit"
                 :error-label="model.$errors.unit">
          <q-select float-label="단위" v-model="model.unit"
                    :options="unitLabelArray" filter autofocus-filter
                    :readonly="!updatable" :hide-underline="!updatable"></q-select>
        </q-field>

        <q-field icon="monetization_on" helper="구매 가능 여부를 체크하세요(구매시 노출여부가 달라 집니다)"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.purchasable"
                 :error-label="model.$errors.purchasable">
          <q-checkbox label="구매가능" v-model="model.purchasable" :readonly="!updatable"/>
        </q-field>

        <!--        <q-field icon="monetization_on" helper="판매 가능 여부"
                         class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                         :error="!!model.$errors.salable"
                         :error-label="model.$errors.salable">
                  <q-checkbox label="판매가능" v-model="model.salable" readonly hide-underline/>
                </q-field>-->

        <q-field icon="monetization_on" helper="공정 비용을 제외한 금액(구매/외주 기준 금액, 직접 재료비)"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.baseUnitCost"
                 :error-label="model.$errors.baseUnitCost">
          <q-input type="number" float-label="재료비" v-model="model.baseUnitCost" align="right"
                   :readonly="!updatable" :hide-underline="!updatable"/>
          <q-tooltip>
            {{$number.words(model.baseUnitCost)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-barcode" helper="바코드 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.barcodeNumber"
                 :error-label="model.$errors.barcodeNumber">
          <q-input v-model="model.barcodeNumber" float-label="바코드 번호" class="ime-mode-disabled"
                   :readonly="!updatable" :hide-underline="!updatable">
            <q-btn icon="content_copy" v-clipboard:copy="model.barcodeNumber" v-clipboard-notify
                   slot="after"
                   flat></q-btn>
          </q-input>
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

        <q-field icon="fas fa-building" helper="고객사를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="외부에서 식별에 사용되는 코드를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.externalCode"
                 :error-label="model.$errors.externalCode">
          <q-input v-model="model.externalCode" float-label="외부 코드" class="ime-mode-disabled"
                   :readonly="!updatable" :hide-underline="!updatable">
            <q-btn icon="content_copy" v-clipboard:copy="model.externalCode" v-clipboard-notify
                   slot="after"
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
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.specTypeId"
                 :error-label="model.$errors.specTypeId">

          <c-autocomplete-select float-label="스펙 유형" v-model="model.specTypeId"
                                 :label.sync="specTypeModel.name" :options="specTypeLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!phantom" :hide-underline="!phantom"
                                 @search="onSpecTypeSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}[{{option.stamp}}]<br>
              {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        설명 및 관련 파일
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="description" helper="품목의 설명을 입력하세요"
                 class="col-xs-12 col-md-10 col-xl-8"
                 :error="!!model.$errors.description"
                 :error-label="model.$errors.description"
                 :count="200">
          <q-input type="textarea" v-model="model.description" float-label="설명"
                   rows="5" :readonly="!updatable" :hide-underline="!updatable"
                   max-length="200"/>
        </q-field>

        <q-field icon="attachment" helper="품목 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-10 col-xl-8">

          <c-attachment ref="attachment" v-model="model.attachmentId" category="item"
                        multiple :readonly="!updatable"></c-attachment>
        </q-field>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom">삭제</q-btn>
        -->
        <q-btn flat icon="play_arrow" v-show="!phantom && model.isActivatable"
               v-if="$authorized.itemManager"
               @click="onActivate">활성화
        </q-btn>
        <q-btn flat icon="pause" v-show="!phantom && model.isDeactivatable"
               v-if="$authorized.itemManager"
               @click="onDeactivate">비활성화
        </q-btn>

        <q-btn flat icon="fast_forward" v-show="!phantom"
               v-if="$authorized.processAccessor"
               @click="onShowProcess">공정
        </q-btn>

        <q-btn flat icon="library_books" v-show="!phantom"
               v-if="$authorized.productSpecificationAccessor"
               @click="onShowProductSpecification">사양서
        </q-btn>

        <router-link :to="`/bom/${model.id}`" v-show="!phantom"
                     v-if="$authorized.bomAccessor">
          <q-btn flat icon="playlist_add_check">BOM</q-btn>
        </router-link>
        <q-btn flat icon="save" v-if="updatable" @click="onSaveClick()">저장</q-btn>
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
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {ItemProcessesViewer} from 'src/model/process'
  import {
    ProductSpecificationModel,
    ProductSpecificationViewer
  } from 'src/model/product-specification'
  import {UnitLabelArray} from 'src/model/shared'

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
      },
      predefined: {
        type: Object,
        default: () => {
        }
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    authorized: {
      'itemManager': 'hasRole(\'ITEM_MANAGER\')',
      'processAccessor': 'hasRole(\'PROCESS_MANAGER\', \'PROCESS_ACCESSOR\')',
      'bomAccessor': 'hasAnyRole(\'BOM_MANAGER\', \'BOM_ACCESSOR\')',
      'productSpecificationWriter': 'hasAnyRole(\'PRODUCT_SPECIFICATION_WRITER\', \'PRODUCT_SPECIFICATION_MANAGER\')',
      'productSpecificationAccessor':
          'hasAnyRole(\'PRODUCT_SPECIFICATION_WRITER\', \'PRODUCT_SPECIFICATION_MANAGER\', \'PRODUCT_SPECIFICATION_ACCESSOR\')'
    },
    data() {
      return {
        model: new ItemModel(),
        companyLabelArray: new CompanyLabelArray(),
        statusLabelArray: new ItemStatusArray(),
        typeLabelArray: new ItemTypeArray(),
        categoryLabelArray: new ItemCategoryLabelArray(),
        specTypeLabelArray: new ItemSpecTypeLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        categoryModel: new ItemCategoryModel(),
        customerModel: new CompanyModel(),
        specTypeModel: new ItemSpecTypeModel(),
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.typeLabelArray.fetch(),
        this.categoryLabelArray.fetch(),
        this.specTypeLabelArray.fetch(),
        this.companyLabelArray.fetch(),
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async onCustomerSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onCategorySearch(keyword) {
        await this.categoryLabelArray.fetch(keyword)
      },
      async onSpecTypeSearch(keyword) {
        await this.specTypeLabelArray.fetch(keyword)
      },
      async create() {
        this.model = new ItemModel()
        _.forIn(this.predefined, (value, key) => {
          this.model[key] = value
        })
      },
      async show() {
        this.model = await ItemModel.get(this.id)
      },
      async onSaveClick() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable && !this.closeConfirmed) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async onActivate() {
        const ok = await this.$alert.confirm('활성화 하시겠습니까?')
        if (ok) {
          await this.model.activate()
          this.$alert.positive('활성화 되었습니다')
          this.show()
        }
      },
      async onDeactivate() {
        const ok = await this.$alert.confirm('비활성화 하시겠습니까?')
        if (ok) {
          await this.model.deactivate()
          this.$alert.positive('비활성화 되었습니다')
          this.show()
        }
      },
      async onShowProcess() {
        const viewer = new ItemProcessesViewer(this)
        viewer.itemId = this.model.id
        viewer.updatable = true
        await viewer.show()
      },

      async onShowProductSpecification() {
        const exists = await ProductSpecificationModel.existsByItemId(this.model.id)
        if (!exists && this.$authorized.productSpecificationWriter) {
          const ok = await this.$alert.confirm('사양서가 존재하지 않습니다. 생성 하시겠습니까?')
          if (ok) {
            await ProductSpecificationModel.draft(this.model.id)
          }
        }
        const specification = await ProductSpecificationModel.getByItemId(this.model.id)
        const viewer = new ProductSpecificationViewer(this)
        viewer.id = specification.id
        await viewer.show()
      },
      async save() {
        const attachment = this.$refs.attachment
        await attachment.save()
        await this.model.save()
        this.$emit('saved', this.model)
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      },
      updatable() {
        return this.$authorized.itemManager
      }
    },
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
    components: {}
  }
</script>
