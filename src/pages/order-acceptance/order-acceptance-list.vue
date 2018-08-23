<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
        <router-link :to="{ path: '/order-acceptance/create', query: $route.query}">
          <q-btn flat icon="add" label="생성"></q-btn>
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
        <ag-grid-column field="name" header-name="이름" :width="200"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/order-acceptance/show/${id}', query:$route.query}"/>
        <ag-grid-column field="status" header-name="상태" :width="100"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:statusLabels, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="projectName" header-name="프로젝트명" :width="120"/>
        <ag-grid-column field="customerName" header-name="고객사" :width="120"/>
        <ag-grid-column field="purchaserName" header-name="발주사" :width="120"/>
        <ag-grid-column field="receiverName" header-name="인수사" :width="120"/>
        <ag-grid-column field="orderedDate" header-name="주문일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="dueDate" header-name="만기일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
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

      <q-field slot="filter" icon="fas fa-building" helper="프로젝트를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="프로젝트" v-model="filters.projectId"
                               :label.sync="filters.projectName" :options="projectLabels"
                               label-field="label" value-field="value" clearable
                               @search="onProjectSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="고객사, 발주사, 인수사에 지정된 회사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="관련회사" v-model="filters.relatedCompanyId"
                               :label.sync="filters.relatedCompanyName" :options="companyLabels"
                               label-field="label" value-field="value" clearable
                               @search="onRelatedCompanySearch">
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

      <q-field slot="filter" icon="fas fa-building" helper="주문 접수의 상태를 선택하세요 체크한 대상만 검색됩니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="상태" v-model="filters.statuses"
                  :options="statusLabels" multiple></q-select>
      </q-field>


      <q-field slot="filter" icon="fas fa-calendar" helper="만기일 범위(부터)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime suffix="~" float-label="만기일 ~부터" v-model="filters.startDueDate"
                    type="date"/>
        <!--filters.startDueDate-->
      </q-field>

      <q-field slot="filter" icon="fas fa-calendar" helper="만기일 범위(까지)를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime prefix="~" float-label="만기일 ~까지" v-model="filters.endDueDate"
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
      <c-list-filter-label slot="filter-label" v-model="filters.projectId"
                           :print-value="filters.projectName" label="프로젝트"/>
      <c-list-filter-label slot="filter-label" v-model="filters.relatedCompanyId"
                           :print-value="filters.relatedCompanyName" label="관련회사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.managerId"
                           :print-value="filters.managerName" label="담당자"/>
      <c-list-filter-label slot="filter-label" v-model="filters.statuses"
                           :print-value="statusesLabel" :clear-value="[]"
                           label="상태"/>
      <c-list-filter-label slot="filter-label" v-model="filters.itemId"
                           :print-value="`[${filters.itemCode}] ${filters.itemName}`" label="품목"
                           @remove="onItemClear"/>
      <c-list-filter-label slot="filter-label" v-model="filters.startDueDate"
                           suffix="~" label="만기일"/>
      <c-list-filter-label slot="filter-label" v-model="filters.endDueDate"
                           prefix="~" label="만기일"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {CompanyLabelArray} from 'src/model/company'
  import {UserLabelArray} from 'src/model/user'
  import {ProjectLabelArray} from 'src/model/project'
  import {
    OrderAcceptancePaginationArray,
    OrderAcceptanceStatusArray
  } from 'src/model/order-acceptance'

  export default {
    data() {
      return {
        array: new OrderAcceptancePaginationArray(),
        companyLabels: new CompanyLabelArray(),
        userLabels: new UserLabelArray(),
        projectLabels: new ProjectLabelArray(),
        statusLabels: new OrderAcceptanceStatusArray(),
        filters: {
          name: null,
          relatedCompanyId: null,
          relatedCompanyName: null,
          managerId: null,
          managerName: null,
          statuses: [],
          startDueDate: null,
          endDueDate: null,
          itemId: null,
          itemCode: null,
          itemName: null
        },
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
      this.statusLabels.fetch()
      this.companyLabels.query()
      this.userLabels.query()
      this.projectLabels.query()
      this.dataAdjuster = new DataAdjuster(this.filters, {
        startDueDate: {
          type: Date,
          firstTime: true
        },
        endDueDate: {
          type: Date,
          lastTime: true
        }
      })
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onRelatedCompanySearch(keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onProjectSearch(keyword, done) {
        await this.projectLabels.query(keyword)
        done()
      },
      async onManagerSearch(keyword, done) {
        await this.userLabels.query(keyword)
        done()
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
    },
    computed: {
      statusesLabel() {
        return this.filters.statuses.map(
            value => this.statusLabels.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
