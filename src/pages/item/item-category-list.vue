<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" filter-always prevent-fetch
                 @fetched="onFetched" class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <q-btn-dropdown label="생성" flat>
          <!-- dropdown content -->
          <q-list>
            <router-link :to="{ path: '/item-category/create', query: $route.query}">
              <q-item>
                <q-item-side icon="add"/>
                <q-item-main label="최상위 분류"/>
              </q-item>
            </router-link>
            <router-link :event="selectedParentId ? 'click' : ''"
                         :disabled="!selectedParentId"
                         :to="{ path: `/item-category/create/${selectedParentId}`, query: $route.query}">
              <q-item>
                <q-item-side icon="add"/>
                <q-item-main label="선택 분류의 하위 분류"/>
              </q-item>
            </router-link>
          </q-list>
        </q-btn-dropdown>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               class="col-grow"
               row-selection="single"
               enable-col-resize
               enable-sorting
               enable-filter
               :get-node-child-details="getNodeChildDetails"
               :row-data="array"
               @selection-changed="onGridSelectionChanged"
               @row-clicked="onGridRowClicked">
        <ag-grid-column field="name" header-name="이름" cellRenderer="agGroupCellRenderer"
                        :width="400" :checkbox-selection="true"
                        :cell-renderer-params="{
                          innerRendererFramework: 'ag-grid-router-link-renderer',
                          padding: 20,
                          suppressCount: true,
                          path:'/item-category/show/${id}',
                          query:$route.query
                        }"/>
        <ag-grid-column field="code" header-name="코드" :width="100"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="search" helper="포함된 글자를 입력하세요"
               class="col-xs-11 col-md-6 col-xl-6">
        <q-input v-model="filters.keyword" clearable
                 @keyup.enter="retrieve()"></q-input>
      </q-field>


      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.keyword" label="단어"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {UserLabelArray} from 'src/model/user'
  import {ItemCategoryHierarchyArray} from 'src/model/item'

  export default {
    data () {
      return {
        array: new ItemCategoryHierarchyArray(),
        userLabelArray: new UserLabelArray(),
        filters: {
          keyword: null
        },
        selected: null,
        dataAdjuster: null,
        lastFetchedTime: null
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
      this.userLabelArray.fetch()
    },
    methods: {
      retrieve () {
        this.$refs.listView.retrieve()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabelArray.fetch(keyword)
        done()
      },
      getNodeChildDetails (data) {
        if (data.children) {
          return {
            group: true,
            expanded: true,
            // provide ag-Grid with the children of this group
            children: data.children,
            // the key is used by the default group cellRenderer
            key: data.id
          }
        }
        return null
      },
      async onFetched (event) {
        // 10 초 이내는 서버에 요청하지 않음
        if (Date.now() - (this.lastFetchedTime) > 10000) {
          await this.array.fetch()
          this.lastFetchedTime = Date.now()
        }
        this.applyFilter()
      },
      applyFilter () {
        const grid = this.$refs.grid
        grid.api.setQuickFilter(this.filters.keyword)
      },
      onGridSelectionChanged (event) {
        this.selected = event.api.getSelectedRows()[0]
      },
      onGridRowClicked (event) {
        event.node.setSelected(true)
      },
    },
    computed: {
      selectedParentId () {
        return this.selected ? this.selected.id : null
      }

    }
  }
</script>
