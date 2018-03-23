<template>
  <div>
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters">

      <!-- action -->

      <div slot="action">
        <router-link :to="{ path: '/user/create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </router-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid" class="ag-theme-material"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-link-renderer"
                        :cell-renderer-params="{path:'/user/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="150"/>
        <ag-grid-column field="email" header-name="이메일" :width="200"/>
        <ag-grid-column field="departmentName" header-name="부서" :width="200"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
        <ag-grid-column field="lastModifiedBy.name" header-name="수정자" :width="150"/>
        <ag-grid-column field="lastModifiedDate" header-name="수정시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fa-sitemap" helper="사용자의 부서를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <c-autocomplete-select float-label="부서" v-model="filters.departmentId"
                               :label.sync="filters.departmentName" :options="departmentLabels"
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
  </div>

</template>
<script>
  import { DataAdjuster } from 'src/model/data'
  import { mapGetters } from 'vuex'
  import { UserPaginationArray } from './user-model'
  import { DepartmentLabelArray } from './department-model'

  export default {
    data () {
      return {
        array: new UserPaginationArray(),
        departmentLabels: new DepartmentLabelArray(),
        filters: {
          name: null,
          enabled: true,
          departmentId: null,
          departmentName: null
        },
        dataAdjuster: null
      }
    },
    mounted () {
      this.dataAdjuster = new DataAdjuster(this.filters, {
        enabled: Boolean
      })
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async _onDepartmentSearch (keyword, done) {
        await this.departmentLabels.query(keyword)
        done()
      },
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

    components: {}
  }
</script>
