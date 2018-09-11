<template>
  <q-page class="column">
    <c-list-view ref="listView" :array="array" :filters="filters" class="col-grow"
                 prevent-route filter-opened prevent-query-string prevent-fetch
                 @fetched="onFetched">

      <!-- action -->

      <div slot="action">
        <q-item-tile label>회사 연락처 검색</q-item-tile>
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
        <ag-grid-column field="contact.name" header-name="이름" :width="150"/>

        <ag-grid-column field="contact.email" header-name="이메일" :width="150"/>

        <ag-grid-column field="contact.mobilePhoneNumber" header-name="휴대폰 번호" :width="150"
                        cell-renderer-framework="ag-grid-phone-number-renderer"/>

        <ag-grid-column field="contact.telephoneNumber" header-name="전화번호" :width="150"
                        cell-renderer-framework="ag-grid-phone-number-renderer"/>

        <ag-grid-column field="contact.faxNumber" header-name="FAX 번호" :width="150"
                        cell-renderer-framework="ag-grid-phone-number-renderer"/>
        <ag-grid-column field="enabled" header-name="사용여부" :width="90" suppress-sorting
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>

      </ag-grid>

      <!-- main -->

      <!-- filters -->

      <q-field slot="filter" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="filters.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
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
  import {CompanyContactArray, CompanyModel} from 'src/model/company'

  export default {
    props: {
      companyId: {
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
        array: new CompanyContactArray(),
        filters: {
          name: null
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
      const company = await CompanyModel.get(this.companyId, true)
      this.array = new CompanyContactArray(company)
      this.array.fetch()
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
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
          this.$alert.warning('선택한 연락처가 없습니다')
        }
      },
      async onFetched(event) {
        const grid = this.$refs.grid
        grid.api.setQuickFilter(this.filters.name)
      }
    },
    computed: {
      rowSelection() {
        return this.multiple ? 'multiple' : 'single'
      }
    }
  }
</script>
