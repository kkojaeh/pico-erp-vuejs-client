<template>
  <div class="quotation-bom-renderer">
    <ag-grid enable-col-resize
             dom-layout='autoHeight'
             row-selection="single"
             :get-node-child-details="getNodeChildDetails"
             :row-data="[params.data.bom]">
      <ag-grid-column field="item.name" header-name="이름" cellRenderer="agGroupCellRenderer"
                      :width="450"
                      :cell-renderer-params="{
                            suppressCount: true,
                            padding: 20
                          }"/>
      <ag-grid-column field="item.code" header-name="코드" :width="100"/>
      <ag-grid-column field="item.externalCode" header-name="외부코드" :width="100"/>
      <ag-grid-column field="quantity" header-name="수량" :width="100" isSelectedRemovable
                      :cell-style="{textAlign: 'right'}"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.total" header-name="단가" :width="100"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.total')"
                      :cell-style="{textAlign: 'right'}"/>

      <ag-grid-column field="estimatedAccumulatedUnitCost.directMaterial" header-name="재료비(직접)"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.directMaterial')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailed" header-class="quotation-detailed-price" cell-class="quotation-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectMaterial" header-name="재료비(간접)"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.indirectMaterial')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailed" header-class="quotation-detailed-price" cell-class="quotation-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.directLabor" header-name="노무비(직접)"
                      :width="100"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.directLabor')"
                      :cell-style="{textAlign: 'right'}" :hide="!detailed" header-class="quotation-detailed-price" cell-class="quotation-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectLabor" header-name="노무비(간접)"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.indirectLabor')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailed" header-class="quotation-detailed-price" cell-class="quotation-detailed-price"/>
      <ag-grid-column field="estimatedAccumulatedUnitCost.indirectExpenses" header-name="간접경비"
                      :cellRenderer="createCellRenderer('estimatedIsolatedUnitCost.indirectExpenses')"
                      :width="100" :cell-style="{textAlign: 'right'}" :hide="!detailed" header-class="quotation-detailed-price" cell-class="quotation-detailed-price"/>

    </ag-grid>
  </div>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    data () {
      return {}
    },
    methods: {
      createCellRenderer (additionalField) {
        return function (params) {
          return `${params.value} (${_.get(params.data, additionalField)})`
        }
      },
      getNodeChildDetails (data) {
        const children = data.children
        if (children && children.length) {
          return {
            group: true,
            expanded: true,
            // provide ag-Grid with the children of this group
            children: children,
            // the key is used by the default group cellRenderer
            key: `${data.id}`
          }
        }
        return null
      }
    },
    computed: {
      detailed () {
        return this.params.detailed
      }
    }
  }
</script>
<style lang="stylus">
  .quotation-bom-renderer
    border-top: 10px solid #e0e0e0
    border-left: 10px solid #e0e0e0
    overflow: auto
</style>
