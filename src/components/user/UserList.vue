<template>
  <div class="full-stretch column">
    <q-fixed-position corner="bottom-right" :offset="[18, 18]" class="column">
      <q-chip closable small color="tertiary" class="col-auto">
        고재훈
        <div class="q-toolbar-subtitle">이름</div>
      </q-chip>
      <q-chip closable small color="tertiary" class="col-auto">
        고재훈
        <div class="q-toolbar-subtitle">이름</div>
      </q-chip>
    </q-fixed-position>
    <q-toolbar slot="header">
      <q-btn flat icon="add">생성</q-btn>
      <q-chip closable small color="primary">
        <div class="q-toolbar-subtitle">이름</div>
        고재훈
      </q-chip>
      <q-toolbar-title>

        Layout Header
        <span slot="subtitle">Optional subtitle</span>
      </q-toolbar-title>
      <q-btn flat icon="search">검색
        <q-popover anchor="top left">
          <q-card>
            <q-card-title>
              검색
              <q-btn slot="right" flat icon="search"></q-btn>
            </q-card-title>
            <q-card-separator/>
            <q-card-main>
              <q-input v-model="condition.name" placeholder="이름" float-label="이름" clearable
                       :error="$v.condition.name.$error"
                       @keyup.enter="retrieve()"/>
              <q-alert color="warning" v-if="!$v.condition.name.maxLength" v-show="$v.condition.name.$error">
                최대 {{ $v.name.$params.maxLength.max }} 글자 입니다.
              </q-alert>
              <q-input v-model="condition.email" type="email" placeholder="email" float-label="Email2" clearable
                       :error="$v.condition.email.$error"
                       @keyup.enter="retrieve()"/>
            </q-card-main>
          </q-card>
        </q-popover>
      </q-btn>
    </q-toolbar>

    <ag-grid class="ag-theme-material col"
             rowSelection="multiple"
             :enableColResize="true"
             :enableSorting="true"
             :gridOptions="gridOptions"
             :rowData="rowData">
      <ag-grid-column headerName="group" >
        <ag-grid-column headerName="name1" field="row">

        </ag-grid-column>
        <ag-grid-column headerName="name2" field="row2">

        </ag-grid-column>
      </ag-grid-column>
    </ag-grid>
  </div>

  <!--
<q-card>
  <q-card-title>
    사용자 목록
  </q-card-title>
  <q-fixed-position corner="top-right" :offset="[18, 18]">
    <q-btn round color="secondary" icon="search">
      <q-popover anchor="top left">
        <q-list separator link>
          <q-item>
            <q-input v-model="condition.name" placeholder="이름" float-label="이름" clearable
                     :error="$v.condition.name.$error"
                     @keyup.enter="retrieve()"/>
            <q-alert color="warning" v-if="!$v.condition.name.maxLength" v-show="$v.condition.name.$error">
              최대 {{ $v.name.$params.maxLength.max }}
            </q-alert>
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>
  </q-fixed-position>
  <q-card-main>
    <q-data-table :data="table" :config="config" :columns="columns">
      <template slot="col-source" slot-scope="cell">
              <span v-if="cell.data === 'Audit'" class="label text-white bg-primary">
          Audit
          <q-tooltip>Some tooltip</q-tooltip>
        </span>
        <span v-else class="label text-white bg-negative">{{cell.data}}</span>
      </template>

      <template slot="selection" slot-scope="props">
        <button class="primary clear" @click="changeMessage(props)">
          <i>edit</i>
        </button>
        <button class="primary clear" @click="deleteRow(props)">
          <i>delete</i>
        </button>
      </template>
    </q-data-table>
  </q-card-main>
  <q-card-separator/>
  <q-card-actions align="center">
    <q-btn color="primary" @click="signIn()">Sign In</q-btn>
  </q-card-actions>
</q-card>
-->
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Toast } from 'quasar'
  import { maxLength } from 'vuelidate/lib/validators'

  // import firebase from 'firebase'

  export default {
    data () {
      return {
        gridOptions: {},
        rowData: [{row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}, {row: '1'}, {row: '2'}],
        condition: {},
        table: [{}, {}],
        config: {
          refresh: false,
          filter: false,
          columnPicker: false,
          leftStickyColumns: 1,
          rightStickyColumns: 2,
          bodyStyle: {
            // maxHeight: Platform.is.mobile ? '50vh' : '500px'
          },
          rowHeight: '50px',
          responsive: true,
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30, 50, 500]
          },
          selection: 'multiple',
          messages: {
            noData: '<i>warning</i> No data available to show.',
            noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
          }
        },
        columns: [{
          label: 'Date',
          field: 'isodate',
          width: '120px',
          filter: false,
          sort: 'date',
          format (value) {
            return new Date(value).toLocaleString()
          }
        }, {
          label: 'Service',
          field: 'serviceable',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '80px'
        }, {
          label: 'Message',
          field: 'message',
          sort: true,
          filter: false,
          width: '500px'
        }, {
          label: 'Source',
          field: 'source',
          sort: true,
          filter: false,
          width: '120px'
        }, {
          label: 'Log Number',
          field: 'log_number',
          sort: true,
          width: '100px'
        }],

        pagination: true,
        rowHeight: 50,
        bodyHeightProp: 'maxHeight',
        bodyHeight: 500
      }
    },
    validations: {
      condition: {
        name: {
          maxLength: maxLength(50)
        },
        email: {
          maxLength: maxLength(50)
        }
      }
    },
    created () {
    },
    methods: {
      retrieve () {
        this.$v.condition.$touch()
        if (this.$v.condition.$error) {
          Toast.create.warning('데이터가 유효하지 않습니다.')
        }
        // aa
      }
    },
    computed: {
      ...mapGetters(['isFrameNeeded', 'isAuthenticated'])
    },
    components: {}
  }
</script>
<style scoped>
  q-fixed-position > * {
    margin-top: 10px;
  }
  .full-stretch {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
</style>
