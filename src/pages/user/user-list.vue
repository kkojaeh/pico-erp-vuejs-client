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
            <q-btn flat icon="cloud_download" label="Export" v-if="$authorized.userManager">
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
            <q-btn flat icon="cloud_upload" label="Import" v-if="$authorized.userManager">
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
        <router-link :to="{ path: '/user/create', query: $route.query}"
                     v-if="$authorized.userManager">
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
                        :cell-renderer-params="{path:'/user/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="150"/>
        <ag-grid-column field="position" header-name="직위/직급" :width="100"/>
        <ag-grid-column field="email" header-name="이메일" :width="200"/>
        <ag-grid-column field="departmentName" header-name="부서" :width="200"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="lastModifiedBy.name" header-name="수정자" :width="120"/>
        <ag-grid-column field="lastModifiedDate" header-name="수정시간" :width="170"
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

      <q-field slot="filter" icon="fas fa-sitemap" helper="사용자의 부서를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <c-autocomplete-select float-label="부서" v-model="filters.departmentId"
                               :label.sync="filters.departmentName" :options="departmentLabelArray"
                               label-field="label" value-field="value"
                               @search="_onDepartmentSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="check_circle" helper="활성화된 사용자만 포함 합니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-toggle label="활성화 여부" clearable v-model="filters.enabled"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.departmentId"
                           :print-value="filters.departmentName" label="부서"/>
      <c-list-filter-label slot="filter-label" v-model="filters.enabled" label="활성화 여부"
                           true-label="활성화 대상" false-label="비활성화 대상" immutable/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {
    DepartmentLabelArray,
    UserExportOptions,
    UserImportOptions,
    UserModel,
    UserPaginationArray
  } from 'src/model/user'
  import UppyUploader from 'src/components/uppy/uppy-uploader.vue'

  export default {
    authorized: {
      'userManager': 'hasRole(\'USER_MANAGER\')'
    },
    intro: {
      start () {

      }
    },
    data () {
      return {
        array: new UserPaginationArray(),
        departmentLabelArray: new DepartmentLabelArray(),
        filters: {
          name: null,
          enabled: true,
          departmentId: null,
          departmentName: null
        },
        exportOptions: new UserExportOptions(),
        importOptions: new UserImportOptions(),
        importByXlsxUrl: UserModel.importByXlsxUrl,
        dataAdjuster: null
      }
    },
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {
        enabled: Boolean
      })
      this.departmentLabelArray.fetch()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async _onDepartmentSearch(keyword) {
        await this.departmentLabelArray.fetch(keyword)
      },
      async importByXlsx () {
        const uploader = this.$refs.importByXlsxUploader
        await uploader.upload()
        await uploader.clear()
        this.$refs.listView.retrieve(true)
        uploader.$closeOverlay()
      },
      exportAsXlsx () {
        UserModel.exportAsXlsx(this.exportOptions)
      }
    },
    computed: {
      ...mapGetters([])
    },

    watch: {
      'filters': {
        deep: true,
        handler () {
          this.dataAdjuster.adjust()
        }
      }
    },

    components: {
      'uppy-uploader': UppyUploader
    }
  }
</script>
