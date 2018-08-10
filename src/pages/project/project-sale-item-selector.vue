<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" class="col-grow"
                 prevent-route filter-opened prevent-query-string prevent-fetch
                 @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-item-tile label>프로젝트 판매 품목 검색</q-item-tile>
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
        <ag-grid-column field="item.code" header-name="품목 코드" :width="200"/>
        <ag-grid-column field="item.name" header-name="품목 이름" :width="300"/>
        <ag-grid-column field="unitPrice" header-name="단가" :width="150"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="createdDate" header-name="생성일" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
        <ag-grid-column field="expirationDate" header-name="만료예정" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
        <ag-grid-column field="expired" header-name="만료여부" :width="90" suppress-sorting
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
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
  import {ProjectModel, ProjectSaleItemArray} from 'src/model/project'

  export default {
    props: {
      projectId: {
        type: String,
        required: true
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        array: new ProjectSaleItemArray(),
        filters: {
          name: null
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
      const project = await ProjectModel.get(this.projectId, true)
      this.array = new ProjectSaleItemArray(project)
      this.array.query()
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
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
      async onFetched(event) {
        const grid = this.$refs.grid
        grid.api.setQuickFilter(this.filters.name)
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      }
    }
  }
</script>
