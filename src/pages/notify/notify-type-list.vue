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
        <ag-grid-column field="id" header-name="아이디" :width="200"
                        cell-renderer-framework="ag-grid-router-link-renderer"
                        :cell-renderer-params="{path:'/notify-type/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="200"/>
        <ag-grid-column field="subjectTypeId" header-name="주제 유형" :width="140"
                        :cell-style="{textAlign: 'center'}"
                        cell-renderer-framework="ag-grid-array-label-renderer"
                        :cell-renderer-params="{array:subjectTypeArray, valueField:'id', labelField: 'name'}"/>
        <ag-grid-column field="enabled" header-name="사용여부" :width="90" suppress-sorting
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
        <ag-grid-column field="multipleSend" header-name="복수송신" :width="90" suppress-sorting
                        cell-renderer-framework="ag-grid-checkbox-renderer"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="180"
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

      <q-field slot="filter" icon="fas fa-building" helper="주제 유형을 선택하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-select float-label="주제 유형" v-model="filters.subjectTypeId"
                  :options="subjectTypeArray"></q-select>
      </q-field>


      <!-- filters -->

      <!-- filter -->

      <c-list-filter-label slot="filter-label" v-model="filters.name" label="이름"/>
      <c-list-filter-label slot="filter-label" v-model="filters.subjectTypeId"
                           :print-value="subjectTypeLabel"
                           label="주제 유형"/>
      <!-- filter -->

    </c-list-view>
  </q-page>

</template>
<script>
  import {DataAdjuster} from 'src/model/data'
  import {mapGetters} from 'vuex'
  import {NotifySubjectTypeArray, NotifyTypePaginationArray} from 'src/model/notify'

  export default {
    data() {
      return {
        array: new NotifyTypePaginationArray(),
        subjectTypeArray: [],
        filters: {
          name: null,
          subjectTypeId: null
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
      this.dataAdjuster = new DataAdjuster(this.filters, {})
      const subjectTypeArray = new NotifySubjectTypeArray()
      await subjectTypeArray.fetch()
      subjectTypeArray.forEach(e => {
        e.value = e.id
        e.label = e.name
      })
      this.subjectTypeArray = subjectTypeArray
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve()
      },
      async onFetched() {
        await Promise.all(
            this.array.map(async (e) => {
            })
        )
        this.$redrawGrids()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      subjectTypeLabel() {
        return [this.filters.subjectTypeId].map(
            value => this.subjectTypeArray.find(status => status.value == value))
        .filter(data => data)
        .map(data => data.label)
        .join(', ')
      }
    }
  }
</script>
