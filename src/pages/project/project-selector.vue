<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 prevent-route filter-opened prevent-query-string>

      <!-- action -->

      <div slot="action">
        <q-item-tile label>프로젝트 검색</q-item-tile>
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
        <ag-grid-column field="name" header-name="이름" :width="200"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/project/show/${id}', query:$route.query}"/>

        <ag-grid-column field="customerName" header-name="고객사명" :width="150"/>
        <ag-grid-column field="managerName" header-name="담당자명" :width="120"/>

        <ag-grid-column field="customerManagerName" header-name="고객사 담당자명" :width="120"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="120"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="170"
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

      <q-field slot="filter" icon="fas fa-building" helper="고객사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="고객사" v-model="filters.customerId"
                               :label.sync="filters.customerName" :options="companyLabels"
                               label-field="label" value-field="value" clearable
                               @search="onCustomerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="account_box" helper="담당자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="담당자" v-model="filters.managerId"
                               :label.sync="filters.managerName" :options="userLabels"
                               label-field="label" value-field="value" clearable
                               @search="onManagerSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="생성일 ~부터" v-model="filters.startCreatedDate"
                    type="date"/>
        <!--filters.startCreatedDate-->
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="생성일 범위(까지)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime prefix="~" float-label="생성일 ~까지" v-model="filters.endCreatedDate"
                    type="date"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="품목을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input :prefix="filters.itemCode" float-label="품목" :value="filters.itemName" clearable
                 readonly
                 :after="[{ icon:'search', handler:onItemSearch}, { icon:'clear', condition: !!filters.itemId, handler:onItemClear}]"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.customerId"
                           :print-value="filters.customerName" label="고객사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.managerId"
                           :print-value="filters.managerName" label="담당자"/>
      <c-list-filter-label slot="filter-label" v-model="filters.itemId"
                           :print-value="`[${filters.itemCode}] ${filters.itemName}`" label="품목"
                           @remove="onItemClear"/>
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
  import {ProjectPaginationArray} from 'src/model/project'
  import {UserLabelArray} from 'src/model/user'
  import {CompanyLabelArray} from 'src/model/company'

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        array: new ProjectPaginationArray(),
        companyLabels: new CompanyLabelArray(),
        userLabels: new UserLabelArray(),
        filters: {
          name: null,
          customerId: null,
          customerName: null,
          managerId: null,
          managerName: null,
          customerManagerName: null,
          startCreatedDate: null,
          endCreatedDate: null,
          itemId: null,
          itemCode: null,
          itemName: null
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
    mounted() {
      this.companyLabels.query()
      this.userLabels.query()
      this.dataAdjuster = new DataAdjuster(this.filters, {
        startCreatedDate: {
          type: Date,
          firstTime: true
        },
        endCreatedDate: {
          type: Date,
          lastTime: true
        }
      })
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onCustomerSearch(keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onManagerSearch(keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async onGridSelectionChanged(event) {
        const selected = event.api.getSelectedRows()
        this.selectable = selected.length > 0
      },
      async onItemSearch() {
        const itemModels = await this.$selectItem({})
        if (!itemModels) {
          return
        }
        itemModels.forEach(itemModel => {
          this.filters.itemCode = itemModel.code
          this.filters.itemName = itemModel.name
          this.filters.itemId = itemModel.id
        })
      },
      onItemClear() {
        this.filters.itemCode = null
        this.filters.itemName = null
        this.filters.itemId = null
      },
      onSelected() {
        const selected = this.$refs.grid.api.getSelectedRows()
        if (selected.length) {
          this.$emit('selected', selected)
        } else {
          this.$alert.warning('선택한 프로젝트가 없습니다')
        }
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      },
      statusesLabel() {
        return this.filters.statuses.map(
            value => this.statusLabels.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      },
      typesLabel() {
        return this.filters.types.map(
            value => this.typeLabels.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
