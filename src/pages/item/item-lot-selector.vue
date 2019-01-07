<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 prevent-route filter-opened prevent-query-string>

      <!-- action -->

      <div slot="action">
        <q-item-tile label>`[{{itemModel.code}}] {{itemModel.name}}` LOT 검색</q-item-tile>
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
        <ag-grid-column field="code" header-name="코드" :width="200"/>
        <ag-grid-column field="expirationDate" header-name="만료시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="expired" header-name="만료여부" :width="90" suppress-sorting
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="코드와 외부코드에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="코드" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="account_circle" helper="만료 여부를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-checkbox v-model="filters.expired" label="만료 여부"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.code" label="코드"/>
      <c-list-filter-label slot="filter-label" v-model="filters.expired" label="만료 여부"
                           true-label="만료됨" false-label="만료 안됨" immutable/>

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
  import {ItemLotPaginationArray, ItemModel} from 'src/model/item'

  export default {
    props: {
      itemId: {
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
        array: new ItemLotPaginationArray(),
        itemModel: new ItemModel(),
        filters: {
          code: null,
          expired: false
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
      this.itemModel = await ItemModel.get(this.itemId)
      this.filters.itemId = this.itemModel.id
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onCategorySearch(keyword) {
        await this.categoryLabelArray.fetch(keyword)
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
          this.$alert.warning('선택한 품목 LOT 가 없습니다')
        }
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      }
    }
  }
</script>
