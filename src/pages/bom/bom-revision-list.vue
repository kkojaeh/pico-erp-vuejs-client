<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" hide-trigger prevent-fetch
                 filter-always class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="add" @click="_onDraftClick">생성</q-btn>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :row-data="array">
        <ag-grid-column field="revision" header-name="버전" :width="150"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/bom/show/${id}'}"/>
        <ag-grid-column field="processName" header-name="공정" :width="150"
                        :cell-renderer="processNameRenderer"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabels, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="draftedBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="draftedDate" header-name="생성시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
        <ag-grid-column field="determinedBy.name" header-name="확정자" :width="150"/>
        <ag-grid-column field="determinedDate" header-name="확정시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="BOM의 대상이 되는 품목의 코드입니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="itemModel.code" float-label="품목 코드" hide-underline readonly/>
      </q-field>

      <q-field slot="filter" icon="account_circle" helper="BOM의 대상이 되는 품목의 이름입니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="itemModel.name" float-label="품목 이름" hide-underline readonly/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import { BomRevisionArray, BomStatusArray, BomModel } from 'src/model/bom'
  import {} from 'src/model/process'
  import { ItemModel } from 'src/model/item'

  export default {
    props: {
      itemId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        array: new BomRevisionArray(),
        filters: {},
        statusLabels: new BomStatusArray(),
        itemModel: new ItemModel()
      }
    },
    watch: {},
    async mounted () {
      this.statusLabels.fetch()
      this.itemModel = await ItemModel.get(this.itemId)
      this.array.query(this.itemId)
    },
    methods: {
      processNameRenderer (params) {
        return params.value ? params.value : 'N/A'
      },
      async _onDraftClick () {
        const bom = await BomModel.createByItemId(this.itemId)
        this.$router.push(`/bom/show/${bom.id}`)
      }
    },
    computed: {}
  }
</script>
