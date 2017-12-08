<template>
  <q-layout ref="layout" view="lhh Lpr lFf">
    <!--<div class="full-stretch column">-->

    <q-toolbar slot="header">
      <q-btn flat icon="add">생성</q-btn>
      <c-filter-view>
        <c-filter-label v-model="condition.name" label="이름"/>
        <c-filter-label v-model="condition.email" label="Email"/>
        <c-filter-label v-model="condition.createdDateFrom" label="생성일" suffix="~"/>
        <c-filter-label v-model="condition.createdDateTo" label="생성일" prefix="~"/>
      </c-filter-view>
      <q-toolbar-title>

        Layout Header
        <span slot="subtitle">Optional subtitle</span>
      </q-toolbar-title>
      <q-btn flat icon="search" @click="onSearch()">검색
        <!-- <q-popover anchor="top left">
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
               <q-datetime type="date" float-label="생성일 from" clearable v-model="condition.createdDateFrom" suffix="~"/>
               <q-datetime type="date" float-label="생성일 to" clearable v-model="condition.createdDateTo" prefix="~"/>
             </q-card-main>
           </q-card>
         </q-popover>-->
      </q-btn>
    </q-toolbar>

    <div slot="right">

      <q-field icon="account_circle" helper="이름에 포함된 글자를 입력하세요">
        <q-input v-model="condition.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field icon="email" helper="email 에 포함된 글자를 입력하세요">
        <q-input v-model="condition.email" type="email" float-label="email" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field icon="date_range" helper="생성일이 포함될 기간을 입력하세요">
        <q-datetime type="date" float-label="생성일(부터)" clearable v-model="condition.createdDateFrom"/>
        <q-datetime type="date" float-label="생성일(까지)" clearable v-model="condition.createdDateTo"/>
      </q-field>

    </div>

    <div class="column flex" style="display:block"  >
      <ag-grid ref="grid" class="ag-theme-material col"
               row-selection="multiple"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :gridOptions="gridOptions"
               :rowData="collection.models">
        <ag-grid-column field="name" headerName="이름"/>
        <ag-grid-column field="email" headerName="이메일"/>
      </ag-grid>
      <q-pagination class="col-auto" :value="1" :max="3"></q-pagination>
    </div>

  </q-layout>
  <!--</div>-->

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
  import { UserCollection } from './UserModel'
  import AgGridPaginationCollectionMediator from '@/common/AgGridPaginationCollectionMediator'
  // import firebase from 'firebase'

  export default {
    data () {
      return {
        gridOptions: {},
        collection: new UserCollection(),
        condition: {}
      }
    },
    validations: {
      condition: {
        name: {
          maxLength: maxLength(50)
        },
        email: {
          maxLength: maxLength(50)
        },
        createdDate: {}
      }
    },
    mounted () {
      new AgGridPaginationCollectionMediator(this.$refs.grid, this.collection)
      this.$refs.layout.hideRight()
    },
    methods: {
      onSearch () {
        if (this.$refs.layout.rightState.openedBig || this.$refs.layout.rightState.openedSmall) {
          this.retrieve()
        }
        else {
          this.$refs.layout.toggleRight()
        }
      },
      retrieve () {
        this.collection.page = 1
        this.collection.fetch({
          data: this.condition
        }).then(() => {
          if (this.condition.length === 0) {
            Toast.create('결과가 존재하지 않습니다.')
          }
        })

        /*
        this.$v.condition.$touch()
        if (this.$v.condition.$error) {
          Toast.create.warning('데이터가 유효하지 않습니다.')
        }
        */

        // aa
      },
      onSortChanged (e) {
        debugger
      }
    },
    computed: {
      ...mapGetters(['isFrameNeeded', 'isAuthenticated'])
    },
    components: {}
  }
</script>
<style scoped>

  .full-stretch {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
</style>
