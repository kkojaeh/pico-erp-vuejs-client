<template>
  <div class="column fit">
    <q-toolbar ref="top">
      <slot name="action"></slot>
      <q-toolbar-title>
      </q-toolbar-title>
      <transition name="fade">
        <div ref="labels" :data-step="introStepStart + 2"
             data-intro="입력된 검색 조건이 표시됩니다.<br> ⊗ 를 클릭하여 조건을 삭제할 수 있습니다">
          <slot name="filter-label"></slot>
        </div>
      </transition>
      <q-btn flat icon="search" @click="_onSearch()" v-if="!hideTrigger"
             :data-step="introStepStart + 1"
             data-intro="처음 클릭시에는 검색 조건을 펼치게 되고<br>두번째 클릭시 검색이 실행됩니다" label="검색">
      </q-btn>
    </q-toolbar>
    <transition name="fade">
      <div ref="filters" class="list-view-filter row gutter-sm no-margin"
           :data-step="introStepStart + 3"
           data-intro="목록의 범위를 줄이는 검색 조건들입니다"
           v-show="filterAlways || filtersVisible">
        <slot name="filter"></slot>
      </div>
    </transition>

    <div ref="gridContainer" class="list-view-content col-grow row">
      <slot name="default"></slot>
    </div>

    <q-toolbar v-if="pagination" inverted flat class="justify-between list-view-pagination-bar"
               ref="bottom">
      <q-field :data-step="introStepStart + 4" data-intro="한번에 표시되는 행 수를 의미 합니다">
        <q-select v-model="rowsPerPage" :options="pageSizeOptions"></q-select>
      </q-field>
      <q-pagination v-if="rowsPerPage > 0" v-model="page" :max="max"
                    @input="setPage" :data-step="introStepStart + 5"
                    data-intro="전체 목록에 대한 페이지의 링크입니다"></q-pagination>
      <div :data-step="introStepStart + 6" data-intro="(시작행번호) - (마지막행번호) / (전체 행수) 를 의미합니다">
        {{start}} - {{end}} / {{entries}}
      </div>
    </q-toolbar>
  </div>
</template>


<script>
  import Vue from 'vue'
  import * as _ from 'lodash'
  import Sort from 'src/model/sort'
  import lzutf8 from 'lzutf8'

  export default {
    name: 'c-list-view',
    props: {
      pagination: {
        type: Boolean,
        default: false
      },
      pageSize: {
        type: Number,
        default: 20
      },
      array: {
        type: Array,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
      minPageSize: {
        type: Number,
        default: 20
      },
      maxPageSize: {
        type: Number,
        default: 100
      },
      pageSizeGap: {
        type: Number,
        default: 20
      },
      filtersName: {
        type: String,
        default: 'q'
      },
      sortName: {
        type: String,
        default: 's'
      },
      pageName: {
        type: String,
        default: 'p'
      },
      filterOpened: {
        type: Boolean,
        default: false
      },
      filterAlways: {
        type: Boolean,
        default: false
      },
      preventFetch: {
        type: Boolean,
        default: false
      },
      hideTrigger: {
        type: Boolean,
        default: false
      },
      preventRoute: {
        type: Boolean,
        default: false
      },
      preventQueryString: {
        type: Boolean,
        default: false
      },
      introStepStart: {
        type: Number,
        default: 0
      }
    },
    data () {
      let pageSizeOptions = []
      for (let pageSize = this.minPageSize; pageSize <= this.maxPageSize;
        pageSize += this.pageSizeGap) {
        pageSizeOptions.push({
          label: pageSize + '',
          value: pageSize
        })
      }
      return {
        filtersQueryString: '',
        sortQueryString: '',
        grid: null,
        entries: 0,
        page: 1,
        rowsPerPage: this.pageSize,
        filtersVisible: this.filterOpened,
        pageSizeOptions: pageSizeOptions,
        initialCondition: null
      }
    },
    computed: {
      start () {
        return (this.page - 1) * this.rowsPerPage + 1
      },
      end () {
        if (this.page === this.max || this.rowsPerPage === 0) {
          return this.entries
        }
        return this.page * this.rowsPerPage
      },
      max () {
        return Math.max(1, Math.ceil(this.entries / this.rowsPerPage))
      }
    },
    methods: {
      _toQs (object) {
        console.log('list-view qs', JSON.stringify(object))
        return lzutf8.compress(JSON.stringify(object), {
          outputEncoding: 'Base64'
        })
      },
      _fromQs (value) {
        return JSON.parse(lzutf8.decompress(value, {
          inputEncoding: 'Base64'
        }))
      },
      _onSearch () {
        if (this.filtersVisible) {
          this.retrieve(true)
        } else {
          this.filtersVisible = true
        }
      },
      setPage (value) {
        this.page = value
        this.array.page = value
      },
      async retrieve(force = false) {
        if (this.pagination) {
          this.page = 1
        }
        this.filtersVisible = false
        if (this.preventQueryString) {
          await this._fetch()
        } else {
          this.filtersQueryString = this._toQs(this.filters)
          if (force) {
            await this._fetch()
          }
        }
      },
      _assignQuery (query) {
        if (this.preventQueryString) {
          return
        }
        if (query) {
          let c = query[this.filtersName]
          _.keys(this.filters).forEach((key) => {
            Vue.set(this.filters, undefined)
          })
          if (c) {

            let parsedCondition = this._fromQs(c)
            _.keys(parsedCondition).forEach((key) => {
              Vue.set(this.filters, key, parsedCondition[key])
            })
            this.filtersQueryString = c
          } else {
            _.keys(this.initialCondition).forEach((key) => {
              Vue.set(this.filters, key, this.initialCondition[key])
            })
            this.filtersQueryString = this._toQs(this.filters)
          }
          let s = query[this.sortName]
          if (s) {
            this.sortQueryString = s
          }
          let p = query[this.pageName]
          if (p) {
            this.page = Number(p)
          }
        }
        if (query && query[this.filtersName]) {
          this._fetch()
        } else {
          this._clear()
        }
      },

      async _fetch () {
        const array = this.array
        if (this.sortQueryString) {
          array.sorters = Sort.parseQueryString(this.sortQueryString)
        }
        if (this.pagination) {
          array.page = this.page
          array.size = this.rowsPerPage
        }
        if (!this.preventFetch) {
          await this.array.fetch(this.filters)
        }
        if (this.pagination) {
          this.entries = array.total
          this.page = array.page
          this.size = array.size
        }
        this.$emit('fetched', this.array)
        return this.array
      },

      _clear () {
        this.array.splice(0, this.array.length)
      },

      _onGridSortChanged (e) {
        this.sortQueryString = Sort.toQueryString(
          e.api.getSortModel().map(
            (sm) => Sort.createSort(e.api.getColumnDef(sm.colId).field, sm.sort))
        )
      },

      _onGridComponentStateChanged (e) {
        this._applyGridSort()
      },

      _applyGridSort () {
        if (!this.grid.api) {
          return
        }
        if (this.sortQueryString) {
          const columns = this.grid.api.columnController.getAllGridColumns()
          let parsed = Sort.parseQueryString(this.sortQueryString)
          this.grid.api.setSortModel(parsed.map((value) => {
            const column = columns.find(c => c.getColDef().field == value.getField())
            return {
              colId: column.getId(),
              sort: value.getDir().toLowerCase()
            }
          }))
        } else {
          this.grid.api.setSortModel([])
        }
      },

      _applyQueryString () {
        let query = _.assign({}, this.$route.query)
        query[this.sortName] = this.sortQueryString
        query[this.filtersName] = this.filtersQueryString
        query[this.pageName] = this.page
        if (this.preventRoute) {
          this._assignQuery(query)
        } else {
          if (_.isEmpty(this.$route.query)) {
            this.$router.replace({path: this.$route.path, query: query})
          } else {
            this.$router.push({path: this.$route.path, query: query})
          }
        }
      },

      _onFilterChipRemove () {
        this.retrieve()
      },

    },
    intro: {
      start () {
        this.filtersVisible = true
      },
      exit () {
        this.filtersVisible = false
      }
    },
    watch: {
      '$route' (to, from) {
        this._assignQuery(to.query)
      },
      'sortQueryString' (to, from) {
        this._applyQueryString()
      },
      'filtersQueryString' (to, from) {
        this._applyQueryString()
      },
      'page' (to, from) {
        this._applyQueryString()
      }
    },
    created () {
      this._applyQueryString = _.debounce(this._applyQueryString, 500)
    },
    mounted () {
      this.grid = this.$slots.default.reduce((acc, cur) => acc.tag ? acc : cur).componentInstance
      this.grid.$on('component-state-changed',
        _.debounce(this._onGridComponentStateChanged.bind(this), 500))
      if (this.grid.gridOptions.enableServerSideSorting) {
        this.grid.$on('sort-changed', this._onGridSortChanged.bind(this))
      }
      this.initialCondition = _.assign({}, this.filters)
      this._assignQuery(this.$route.query)

      // TODO: 현재 slot 으로 할당 되는 컴포넌트에 대하여 이벤트 리스닝이 함수형으로 밖에 안되어 이렇게 처리 내용이 가변적이게 되면 동작이 보장 안됨
      let filterChips = this.$slots['filter-label'];
      (filterChips || []).forEach((chip) => {
        chip.componentInstance.$on('remove', this._onFilterChipRemove)
      })
    },
    updated () {
    },
    destroyed () {
    }
  }
</script>

<style>

  .list-view-filter {
    padding-right: 10px;
    width: 100%;
  }

  .list-view-pagination-bar {
    border-top: 1px solid #dddddd;
    padding: 3px 20px;
  }

</style>
