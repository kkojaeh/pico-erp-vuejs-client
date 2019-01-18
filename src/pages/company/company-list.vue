<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
            <q-btn flat icon="cloud_download" label="Export" v-if="$authorized.companyManager">
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
            <q-btn flat icon="cloud_upload" label="Import" v-if="$authorized.companyManager">
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
        <router-link :to="{ path: '/company/create', query: $route.query}"
                     v-if="$authorized.companyManager">
          <q-btn flat icon="add" label="생성"></q-btn>
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
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/company/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="registrationNumber" header-name="등록번호" :width="170"
                        cell-renderer-framework="ag-grid-cleave-renderer"
                        :cell-renderer-params="{cleaveOptions:{ delimiter: '-', blocks: [3, 2, 5]}}"/>
        <ag-grid-column field="representative" header-name="대표자" :width="120"/>
        <ag-grid-column field="supplier" header-name="공급사" :width="80"
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
        <ag-grid-column field="customer" header-name="고객사" :width="80"
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
        <ag-grid-column field="outsourcing" header-name="외주사" :width="80"
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
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

      <q-field slot="filter" icon="fas fa-building" helper="업체의 유형을 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-5 col-xl-4">
        <div class="row justify-between">
          <q-checkbox class="col" label="공급사" v-model="filters.supplier"/>
          <q-checkbox class="col" label="고객사" v-model="filters.customer"/>
          <q-checkbox class="col" label="외주사" v-model="filters.outsourcing"/>
        </div>
      </q-field>

      <q-field slot="filter" icon="check_circle" helper="활성화된 회사만 포함 합니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-toggle label="활성화 여부" clearable v-model="filters.enabled"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.enabled" label="활성화"
                           true-label="포함" false-label="제외" immutable/>
      <c-list-filter-label slot="filter-label" v-model="filters.supplier" label="공급사"
                           true-label="포함" false-label="제외" immutable/>
      <c-list-filter-label slot="filter-label" v-model="filters.customer" label="고객사"
                           true-label="포함" false-label="제외" immutable/>
      <c-list-filter-label slot="filter-label" v-model="filters.outsourcing" label="외주사"
                           true-label="포함" false-label="제외" immutable/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {
    CompanyExportOptions,
    CompanyImportOptions,
    CompanyModel,
    CompanyPaginationArray
  } from 'src/model/company'
  import UppyUploader from 'src/components/uppy/uppy-uploader.vue'

  export default {
    authorized: {
      'companyManager': 'hasRole(\'COMPANY_MANAGER\')'
    },
    data() {
      return {
        array: new CompanyPaginationArray(),
        filters: {
          enabled: true,
          supplier: true,
          customer: true,
          outsourcing: true
        },
        exportOptions: new CompanyExportOptions(),
        importOptions: new CompanyImportOptions(),
        importByXlsxUrl: CompanyModel.importByXlsxUrl,
        dataAdjuster: null
      }
    },
    mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {
        enabled: Boolean,
        supplier: Boolean,
        customer: Boolean,
        outsourcing: Boolean
      })
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async importByXlsx() {
        const uploader = this.$refs.importByXlsxUploader
        await uploader.upload()
        await uploader.clear()
        this.$refs.listView.retrieve(true)
        uploader.$closeOverlay()
      },
      exportAsXlsx() {
        CompanyModel.exportAsXlsx(this.exportOptions)
      }
    },
    computed: {
      ...mapGetters([])
    },

    watch: {
      'filters': {
        deep: true,
        handler() {
          this.dataAdjuster.adjust()
        }
      }
    },

    components: {
      'uppy-uploader': UppyUploader
    }
  }
</script>
