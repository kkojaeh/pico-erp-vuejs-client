<template>
  <q-page class="column fit">

    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" hide-trigger prevent-fetch
                 prevent-route
                 filter-always class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <q-btn flat icon="add" @click="_onDraftClick">생성</q-btn>
        <router-link :to="`/item/show/${itemId}`">
          <q-btn flat icon="open_in_new">품목</q-btn>
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
        <ag-grid-column field="revision" header-name="버전" :width="150"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:`/bom/${itemId}/\${id}`}"/>
        <ag-grid-column field="processName" header-name="공정" :width="150"
                        :cell-renderer="processNameRenderer"/>
        <ag-grid-column field="status" header-name="상태" :width="130"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="draftedBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="draftedDate" header-name="생성시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="determinedBy.name" header-name="확정자" :width="120"/>
        <ag-grid-column field="determinedDate" header-name="확정시간" :width="170"
                        cell-renderer-framework="ag-grid-datetime-renderer"
                        :cell-renderer-params="{ago:true}"/>
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
  import {BomModel, BomRevisionArray, BomStatusArray} from 'src/model/bom'
  import {ItemModel} from 'src/model/item'

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
        statusLabelArray: new BomStatusArray(),
        itemModel: new ItemModel()
      }
    },
    watch: {
      '$route' (to, from) {
        this.array.fetch(this.itemId)
      }
    },
    async mounted () {
      this.statusLabelArray.fetch()
      this.itemModel = await ItemModel.get(this.itemId)
      this.array.fetch(this.itemId)
    },
    methods: {
      processNameRenderer (params) {
        return params.value ? params.value : 'N/A'
      },
      async _onDraftClick () {
        await BomModel.createByItemId(this.itemId)
        const bom = await BomModel.getByItemId(this.itemId)
        this.$router.push(`/bom/${this.itemId}/${bom.id}`)
      }
    },
    computed: {}
  }
</script>
