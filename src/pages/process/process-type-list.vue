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
        <router-link :to="{ path: '/process-type/create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/process-type/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="baseUnitCost" header-name="기준단가" :width="100"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"
                        :cell-style="{textAlign: 'right'}"/>

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

      <q-field slot="filter" icon="account_box" helper="분류를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="분류" v-model="filters.infoTypeId"
                               :label.sync="filters.infoTypeName"
                               :options="infoTypeLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onProcessInfoTypeSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.infoTypeId"
                           :print-value="filters.infoTypeName" label="분류"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {
    ProcessInfoTypeLabelArray,
    ProcessTypeExportOptions,
    ProcessTypeImportOptions,
    ProcessTypeModel,
    ProcessTypePaginationArray
  } from 'src/model/process'
  import UppyUploader from 'src/components/uppy/uppy-uploader.vue'

  export default {
    data() {
      return {
        array: new ProcessTypePaginationArray(),
        infoTypeLabelArray: new ProcessInfoTypeLabelArray(),
        filters: {
          name: null,
          infoTypeId: null,
          infoTypeName: null
        },
        exportOptions: new ProcessTypeExportOptions(),
        importOptions: new ProcessTypeImportOptions(),
        importByXlsxUrl: ProcessTypeModel.importByXlsxUrl,
        dataAdjuster: null
      }
    },
    watch: {
      'filters': {
        deep: true,
        handler() {
          this.dataAdjuster.adjust()
        }
      }
    },
    mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      this.infoTypeLabelArray.fetch()
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onProcessInfoTypeSearch(keyword) {
        await this.infoTypeLabelArray.fetch(keyword)
      },
      async importByXlsx() {
        const uploader = this.$refs.importByXlsxUploader
        await uploader.upload()
        await uploader.clear()
        this.$refs.listView.retrieve(true)
        uploader.$closeOverlay()
      },
      exportAsXlsx() {
        ProcessTypeModel.exportAsXlsx(this.exportOptions)
      }
    },
    computed: {},
    components: {
      'uppy-uploader': UppyUploader
    }
  }
</script>
