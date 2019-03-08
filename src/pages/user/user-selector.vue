<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 prevent-route filter-opened prevent-query-string @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-item-tile label>사용자 검색</q-item-tile>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               :row-selection="rowSelection"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               @selection-changed="onGridSelectionChanged"
               :row-data="array">
        <ag-grid-column :checkbox-selection="true" :width="60"/>
        <ag-grid-column field="id" header-name="아이디" :width="150"/>
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

    <q-toolbar>
      <q-btn flat icon="arrow_back" v-close-overlay>이전</q-btn>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat icon="check" @click="onSelected" :disabled="!selectable">선택</q-btn>
    </q-toolbar>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {DepartmentLabelArray, UserPaginationArray} from 'src/model/user'
  import * as _ from 'lodash'

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      defaultFilters: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        array: new UserPaginationArray(),
        departmentLabelArray: new DepartmentLabelArray(),
        filters: {
          name: null,
          enabled: true,
          departmentId: null,
          departmentName: null
        },
        selectable: false,
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
    async mounted() {
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      await Promise.all([
        this.departmentLabelArray.fetch()
      ])
      _.assign(this.filters, this.defaultFilters)
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async _onDepartmentSearch(keyword) {
        await this.departmentLabelArray.fetch(keyword)
      },
      async onGridSelectionChanged(event) {
        const selected = event.api.getSelectedRows()
        this.selectable = selected.length > 0
      },
      onSelected() {
        const selected = this.$refs.grid.api.getSelectedRows()
        if (selected.length) {
          this.$emit('selected', selected)
        } else {
          this.$alert.warning('선택한 품목이 없습니다')
        }
      },
      async onFetched() {
        /*await Promise.all(
            this.array.map(async (e) => {
            })
        )
        this.$redrawGrids()*/
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      }
    }
  }
</script>
