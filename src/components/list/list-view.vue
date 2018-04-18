<template>
  <div class="column fit">
    <q-toolbar ref="top">
      <slot name="action"></slot>
      <q-toolbar-title>
      </q-toolbar-title>
      <transition name="fade">
        <div ref="labels">
          <slot name="filter-label"></slot>
        </div>
      </transition>
      <q-btn flat icon="search" @click="_onSearch()" v-if="!hideTrigger">검색</q-btn>
    </q-toolbar>
    <transition name="fade">
      <div ref="filters" class="list-view-filter row gutter-sm no-margin"
           v-show="filterAlways || filtersVisible">
        <slot name="filter"></slot>
      </div>
    </transition>

    <div class="list-view-content col-grow">
      <slot name="default"></slot>
    </div>

    <q-toolbar v-if="pagination" inverted flat class="justify-between list-view-pagination-bar"
               ref="bottom">
      <q-field>
        <q-select v-model="rowsPerPage" :options="pageSizeOptions"></q-select>
      </q-field>
      <q-pagination v-if="rowsPerPage > 0" v-model="page" :max="max"
                    @input="setPage"></q-pagination>
      {{start}} - {{end}} / {{entries}}
    </q-toolbar>
  </div>
</template>


<script>
  import Vue from 'vue'
  import qs from 'qs'
  import * as _ from 'lodash'
  import Sort from 'src/model/sort'
  import { Base64 } from 'js-base64'
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
        filtersVisible: false,
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
      retrieve (force = false) {
        if (this.pagination) {
          this.page = 1
        }
        this.filtersVisible = false
        this.filtersQueryString = this._toQs(this.filters)
        if (force) {
          this._fetch()
        }
      },
      _assignQuery (query) {
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
          e.api.getSortModel().map((sm) => Sort.createSort(sm.colId, sm.sort))
        )
      },

      _onGridComponentStateChanged (e) {
        this._applyGridSort()
      },

      _applyGridSort () {
        if (!this.grid.gridOptions.api) {
          return
        }
        if (this.sortQueryString) {
          let parsed = Sort.parseQueryString(this.sortQueryString)
          this.grid.gridOptions.api.setSortModel(parsed.map((value) => {
            return {
              colId: value.getField(),
              sort: value.getDir().toLowerCase()
            }
          }))
        } else {
          this.grid.gridOptions.api.setSortModel([])
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
    destroyed () {
    }
  }
</script>

<style>

  .list-view-content > * {
    height: 100%;
    width: 100%;
  }

  .list-view-filter {
    padding-right: 10px;
    width: 100%;
  }

  .list-view-pagination-bar {
    border-top: 1px solid #dddddd;
    padding: 3px 20px;
  }

</style>
