<template>
  <q-page class="column fit">
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :filters="filters" pagination class="col-grow"
                 @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="help" @click="$intro" v-close-overlay></q-btn>
          </q-popover>
        </q-btn>
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
        <ag-grid-column field="code" header-name="생산지시번호" :width="120"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/production-order/await-accept/${id}', query:$route.query}"/>
        <ag-grid-column field="project.name" header-name="프로젝트명" :width="120"/>
        <ag-grid-column field="item.code" header-name="품목 코드" :width="100"/>
        <ag-grid-column field="item.name" header-name="품목 이름" :width="200"/>
        <ag-grid-column field="process.name" header-name="공정" :width="100"/>
        <ag-grid-column field="quantity" header-name="수량" :width="100"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="spareQuantity" header-name="여분수량" :width="100"
                        :cell-style="{textAlign: 'right'}"
                        cell-renderer-framework="ag-grid-number-renderer"
                        :cell-renderer-params="{format:'#,##0.00', words:true}"/>
        <ag-grid-column field="unit" header-name="단위" :width="80"
                        :cell-style="{textAlign: 'center'}"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
        <ag-grid-column field="receiver.name" header-name="인수사" :width="120"/>
        <ag-grid-column field="orderer.name" header-name="지시자" :width="120"/>
        <ag-grid-column field="dueDate" header-name="만기일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
        <ag-grid-column field="committedDate" header-name="제출일" :width="120"
                        cell-renderer-framework="ag-grid-date-renderer"
                        :cell-renderer-params="{ago:true}"/>
      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="생산지시번호에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.code" float-label="생산지시번호" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="프로젝트를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="프로젝트" v-model="filters.projectId"
                               :label.sync="filters.projectName" :options="projectLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onProjectSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>

      <q-field slot="filter" icon="fas fa-building" helper="인수사를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="인수사" v-model="filters.receiverId"
                               :label.sync="filters.receiverName" :options="companyLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onCompanySearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
      </q-field>


      <q-field slot="filter" icon="account_box" helper="지시자를 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">

        <c-autocomplete-select float-label="지시자" v-model="filters.ordererId"
                               :label.sync="filters.ordererName" :options="userLabelArray"
                               label-field="label" value-field="value" clearable
                               @search="onUserSearch">
          <template slot="option" slot-scope="option">
            {{option.label}}<br>
            {{option.stamp}} - {{option.subLabel}}
          </template>
        </c-autocomplete-select>
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

      <q-field slot="filter" icon="fas fa-gift" helper="품목을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input :prefix="filters.itemCode" float-label="품목" :value="filters.itemName" clearable
                 readonly
                 :after="[{ icon:'search', handler:onItemSearch}, { icon:'clear', condition: !!filters.itemId, handler:onItemClear}]"/>
      </q-field>


      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.code" label="생산지시번호"/>
      <c-list-filter-label slot="filter-label" v-model="filters.projectId"
                           :print-value="filters.projectName" label="프로젝트"/>
      <c-list-filter-label slot="filter-label" v-model="filters.receiverId"
                           :print-value="filters.receiverName" label="인수사"/>
      <c-list-filter-label slot="filter-label" v-model="filters.ordererId"
                           :print-value="filters.ordererName" label="지시자"/>
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
  import {ItemSelector} from 'src/model/item'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {UnitLabelArray} from 'src/model/shared'
  import {ProcessModel} from 'src/model/process'
  import {
    ProductionOrderAwaitAcceptPaginationArray,
    ProductionOrderStatusArray
  } from 'src/model/production-order'

  export default {
    authorized: {},
    data() {
      return {
        array: new ProductionOrderAwaitAcceptPaginationArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        projectLabelArray: new ProjectLabelArray(),
        statusLabelArray: new ProductionOrderStatusArray(),
        filters: {
          code: null,
          receiverId: null,
          receiverName: null,
          ordererId: null,
          ordererName: null,
          startDueDate: null,
          endDueDate: null,
          itemId: null,
          itemCode: null,
          itemName: null,
          projectId: null,
          projectName: null
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
    async mounted() {
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
      await Promise.all([
        this.statusLabelArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.unitLabelArray.fetch()
      ])
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onItemSearch() {
        const itemSelector = new ItemSelector(this)
        const itemModels = await itemSelector.show()
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
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
              await e.fetchReference()
              e.receiver = await CompanyModel.get(e.receiverId, true)
              e.project = await ProjectModel.get(e.projectId, true)
              e.orderer = await UserModel.get(e.ordererId, true)
              e.process = await ProcessModel.get(e.processId, true)
            })
        )
        this.$redrawGrids()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      statusesLabel() {
        return this.filters.statuses.map(
            value => this.statusLabelArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
