<template>
  <div class="fit">
    <q-toolbar>
      <slot name="action"></slot>
      <q-toolbar-title>
      </q-toolbar-title>
      <transition name="fade">
        <div class="list-view-filter" ref="filterBox">
          <slot name="filter"></slot>
        </div>
      </transition>
      <q-btn flat icon="search" @click="_onSearch()">검색</q-btn>
    </q-toolbar>
    <transition name="fade">
      <div class="list-view-filter row sm-gutter no-margin" v-show="conditionVisible">
        <slot name="condition"></slot>
      </div>
    </transition>

    <div class="list-view-content">
      <slot name="default"></slot>
    </div>
    <q-toolbar inverted v-if="pagination" class="sm-gutter">
      <q-field helper="페이지 당 행수">
        <q-select v-model="rowsPerPage" :options="pageSizeOptions" @input="setPageSize"></q-select>
      </q-field>
      <q-toolbar-title>
        {{start}} - {{end}} / {{entries}}
      </q-toolbar-title>
      <q-pagination v-if="rowsPerPage > 0" v-model="page" :max="max"
                    @input="setPage"></q-pagination>
    </q-toolbar>
  </div>
</template>


<script>
  import Vue from 'vue';
  import qs from 'qs';
  import * as _ from 'lodash';
  import Sort from 'src/model/Sort';

  export default {
    name: 'c-list-view',
    props: {
      pagination: {
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 20
      },
      collection: {
        type: Object,
        required: true
      },
      condition: {
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
      conditionName: {
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
      }
    },
    data() {
      let pageSizeOptions = [];
      for (let pageSize = this.minPageSize; pageSize <= this.maxPageSize;
          pageSize += this.pageSizeGap) {
        pageSizeOptions.push({
          label: pageSize + '',
          value: pageSize
        });
      }
      return {
        conditionQueryString: '',
        sortQueryString: '',
        grid: null,
        entries: 0,
        page: 1,
        rowsPerPage: this.pageSize,
        conditionVisible: false,
        pageSizeOptions: pageSizeOptions
      };
    },
    computed: {
      start() {
        return (this.page - 1) * this.rowsPerPage + 1;
      },
      end() {
        if (this.page === this.max || this.rowsPerPage === 0) {
          return this.entries;
        }
        return this.page * this.rowsPerPage;
      },
      max() {
        return Math.max(1, Math.ceil(this.entries / this.rowsPerPage));
      }
    },
    methods: {
      _onSearch() {
        if (this.conditionVisible) {
          this.retrieve(true);
        } else {
          this.conditionVisible = true;
        }
      },
      setPageSize(value) {

      },
      setPage(value) {
        this.page = value;
        this.collection.paginate(value);
      },
      retrieve(force = false) {
        if (this.pagination) {
          this.page = 1;
        }
        this.conditionVisible = false;
        this.conditionQueryString = qs.stringify(this.condition);
        if (force) {
          this._fetch();
        }
      },
      _assignQuery(query) {
        if (query) {
          let c = query[this.conditionName];
          if (c) {
            this.conditionQueryString = c;
            let parsedCondition = qs.parse(c);
            _.keys(parsedCondition).forEach((key) => {
              Vue.set(this.condition, key, parsedCondition[key]);
            });
          }
          let s = query[this.sortName];
          if (s) {
            this.sortQueryString = s;
            this._applyGridSort();
          }
          let p = query[this.pageName];
          if (p) {
            this.page = Number(p);
          }
        }
        if (query[this.conditionName] !== undefined) {
          this._fetch();
        }
      },

      _fetch() {
        if (this.sortQueryString) {
          let parsedSort = qs.parse(this.sortQueryString, {arrayFormat: 'bracket'});
          this.collection.sorters = _.keys(parsedSort).map(
              (key) => Sort.createSort(parsedSort[key].field, parsedSort[key].dir));
        }
        if (this.pagination) {
          this.collection.page = this.page;
        }
        return this.collection.fetch({data: this.condition});
      },

      _onGridSortChanged(e) {
        this.sortQueryString = qs.stringify(
            e.api.getSortModel().map((sm) => Sort.createSort(sm.colId, sm.sort)),
            {arrayFormat: 'bracket'});
      },

      _applyGridSort() {
        if (this.sortQueryString) {
          let parsed = qs.parse(this.sortQueryString, {arrayFormat: 'bracket'});
          this.grid.gridOptions.api.setSortModel(_.keys(parsed).map((key) => {
            return {
              colId: parsed[key].field,
              sort: parsed[key].dir.toLowerCase()
            };
          }));
        } else {
          this.grid.gridOptions.api.setSortModel([]);
        }
      },

      _applyQueryString() {
        let query = _.assign({}, this.$route.query);
        query[this.sortName] = this.sortQueryString;
        query[this.conditionName] = this.conditionQueryString;
        query[this.pageName] = this.page;
        this.$router.push({path: this.$route.path, query: query});
      }
    },
    watch: {
      '$route'(to, from) {
        this._assignQuery(to.query);
      },
      'sortQueryString'(to, from) {
        this._applyQueryString();
      },
      'conditionQueryString'(to, from) {
        this._applyQueryString();
      },
      'page'(to, from) {
        this._applyQueryString();
      }
    },
    created() {
      this._applyQueryString = _.debounce(this._applyQueryString, 500);
    },
    mounted() {
      this.grid = this.$slots.default.reduce((acc, cur) => acc.tag ? acc : cur).componentInstance;
      if (this.grid.gridOptions.enableServerSideSorting) {
        this.grid.$on('sort-changed', this._onGridSortChanged.bind(this));
      }
      this._assignQuery(this.$route.query);
    },
    destroyed() {

    }
  };
</script>

<style>

  .list-view-content {
    height: calc(100vh - 200px);
  }

  .list-view-content > * {
    height: 100%;
    width: 100%;
  }

  .list-view-filter {
    padding-right: 10px;
  }

</style>
