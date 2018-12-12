<template>
  <q-page class="column fit">
    <!-- child -->
    <router-view></router-view>

    <!-- child -->
    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
            <q-btn flat icon="cloud_download" label="Export">
              <q-popover style="width: 300px;">
                <q-card flat>
                  <q-card-main>
                    <q-toggle v-model="exportOptions.empty" label="템플릿 전용"/>
                  </q-card-main>
                  <q-card-actions align="end">
                    <q-btn flat icon="cloud_upload" label="Export" @click="exportAsXlsx()"
                           v-close-overlay></q-btn>
                  </q-card-actions>
                </q-card>
              </q-popover>
            </q-btn>
            <q-btn flat icon="cloud_upload" label="Import">
              <q-popover style="width: 300px; min-height: 500px;">
                <q-card flat>
                  <q-card-main>
                    <q-toggle v-model="importOptions.overwrite" label="덮어 쓰기"/>
                  </q-card-main>
                  <q-card-separator/>
                  <q-card-main>
                    <uppy-uploader ref="importByXlsxUploader" :url="importByXlsxUrl"
                                   :form-data="importOptions"
                                   :allowed-content-types="['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip']"/>
                  </q-card-main>
                  <q-card-separator/>
                  <q-card-title>
                    <span slot="subtitle">확장자가 xlsx 인 파일만 사용 가능합니다</span>
                  </q-card-title>
                  <q-card-separator/>
                  <q-card-actions align="end">
                    <q-btn flat icon="cloud_upload" label="Import" @click="importByXlsx()"
                           v-close-overlay></q-btn>
                  </q-card-actions>
                </q-card>
              </q-popover>
            </q-btn>
          </q-popover>
        </q-btn>
        <router-link :to="{ path: '/item/create', query: $route.query}"
                     v-if="$authorized.itemManager">
          <q-btn flat icon="add">생성</q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="code" header-name="코드" :width="130"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/item/show/${id}', query:$route.query}"/>
        <ag-grid-column field="externalCode" header-name="외부코드" :width="150"/>
        <ag-grid-column field="name" header-name="이름" :width="300"/>
        <ag-grid-column field="customer.name" header-name="고객사" :width="150"/>
        <ag-grid-column field="category.path" header-name="분류" :width="250"/>
        <ag-grid-column field="unit" header-name="단위" :width="90" align="center"/>
        <ag-grid-column field="type" header-name="유형" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:typeLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>

        <ag-grid-column field="createdBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="account_circle" helper="코드와 외부코드에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="코드" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-comment" helper="품목의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabelArray" multiple chips></q-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-comment" helper="품목의 유형을 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="유형" v-model="filters.types"
                  :options="typeLabelArray" multiple chips></q-select>
      </q-field>


      <q-field slot="filter" icon="fas fa-building" helper="고객사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="고객사" v-model="filters.customerId"
                               :label.sync="filters.customerName" :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCustomerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-tag" helper="품목 분류를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="분류" v-model="filters.categoryId"
                               :label.sync="filters.categoryName" :options="categoryLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCategorySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}[{{option.stamp}}]<br>
            {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.code" label="코드"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses" label="상태"
                           :print-value="statusesLabel" :clear-value="[]"/>
      <c-list-filter-label slot="filter-label" v-model="filters.types" label="유형"
                           :print-value="typesLabel" :clear-value="[]"/>
      <c-list-filter-label slot="filter-label" v-model="filters.customerId"
                           :print-value="filters.customerName" label="고객사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.categoryId"
                           :print-value="filters.categoryName" label="분류"/>
      <!-- filter -->

    </c-list-view>

  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {
    ItemCategoryLabelArray,
    ItemCategoryModel,
    ItemExportOptions,
    ItemImportOptions,
    ItemModel,
    ItemPaginationArray,
    ItemStatusArray,
    ItemTypeArray
  } from 'src/model/item'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import UppyUploader from 'src/components/uppy/uppy-uploader.vue'

  export default {
    authorized: {
      'itemManager': 'hasRole(\'ITEM_MANAGER\')'
    },
    data () {
      return {
        array: new ItemPaginationArray(),
        categoryLabelArray: new ItemCategoryLabelArray(),
        statusLabelArray: new ItemStatusArray(),
        typeLabelArray: new ItemTypeArray(),
        companyLabelArray: new CompanyLabelArray(),
        filters: {
          name: null,
          code: null,
          customerId: null,
          customerName: null,
          categoryId: null,
          categoryName: null,
          statuses: [],
          types: []
        },
        exportOptions: new ItemExportOptions(),
        importOptions: new ItemImportOptions(),
        importByXlsxUrl: ItemModel.importByXlsxUrl,
        dataAdjuster: null
      }
    },
    watch: {
      'filters': {
        deep: true,
        handler () {
          this.dataAdjuster.adjust()
        }
      }
    },
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      this.statusLabelArray.fetch()
      this.typeLabelArray.fetch()
      this.categoryLabelArray.fetch()
      this.companyLabelArray.fetch()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onCustomerSearch (keyword, done) {
        await this.companyLabelArray.fetch(keyword)
        done()
      },
      async onCategorySearch (keyword, done) {
        await this.categoryLabelArray.fetch(keyword)
        done()
      },
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
              e.customer = await CompanyModel.get(e.customerId, true)
              e.category = await ItemCategoryModel.get(e.categoryId, true)
            })
        )
        this.$redrawGrids()
      },
      async importByXlsx() {
        const uploader = this.$refs.importByXlsxUploader
        await uploader.upload()
        await uploader.clear()
        this.$refs.listView.retrieve(true)
        uploader.$closeOverlay()
      },
      exportAsXlsx() {
        ItemModel.exportAsXlsx(this.exportOptions)
      }
    },
    computed: {
      statusesLabel () {
        return this.filters.statuses.map(
            value => this.statusLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      },
      typesLabel () {
        return this.filters.types.map(
            value => this.typeLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    },
    components: {
      'uppy-uploader': UppyUploader
    }
  }
</script>
