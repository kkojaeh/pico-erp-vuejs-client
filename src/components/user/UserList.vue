<template>
  <div>
    <q-modal ref="routeModal" @close="$router.go(-1)">
      <transition name="modal" @enter="$refs.routeModal.open()" @appear="$refs.routeModal.open()">
        <router-view></router-view>
      </transition>
    </q-modal>
    <c-list-view ref="listView" :array="array" :condition="condition">
      <div slot="action">
        <q-side-link append :to="{ path: 'create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </q-side-link>
      </div>

      <!-- main -->
      <ag-grid ref="grid" class="ag-theme-material"
               row-selection="multiple"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :grid-options="gridOptions"
               :row-data="array">
        <ag-grid-column :checkbox-selection="true" :width="50" suppress-sorting/>
        <ag-grid-column field="id" header-name="아이디" :width="150"/>
        <ag-grid-column field="name" header-name="이름" :width="150"/>
        <ag-grid-column field="email" header-name="이메일" :width="200"/>
        <ag-grid-column headerName="생성" :marry-children="true">
          <ag-grid-column field="createdBy.name" header-name="사용자" :width="150"/>
          <ag-grid-column field="createdDate" header-name="시간" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"/>
        </ag-grid-column>
        <ag-grid-column headerName="수정" :marry-children="true">
          <ag-grid-column field="lastModifiedBy.name" header-name="사용자" :width="150"/>
          <ag-grid-column field="lastModifiedDate" header-name="시간" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"/>
        </ag-grid-column>
      </ag-grid>

      <!-- main -->

      <!-- condition -->

      <q-field slot="condition" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="condition.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <!--
      <q-field slot="condition" icon="email" helper="email 에 포함된 글자를 입력하세요" class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="condition.email" type="email" float-label="email" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>


      <q-field slot="condition" icon="date_range" helper="생성일이 포함될 기간을 입력하세요" class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime type="date" float-label="생성일(부터)" clearable v-model="condition.createdDateFrom"/>
      </q-field>

      <q-field slot="condition" icon="date_range" helper="생성일이 포함될 기간을 입력하세요" class="col-xs-11 col-md-4 col-xl-3">
        <q-datetime type="date" float-label="생성일(까지)" clearable v-model="condition.createdDateTo"/>
      </q-field>

      -->

      <q-field slot="condition" icon="check_circle" helper="활성화된 사용자만 포함 합니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-toggle label="활성화 여부" clearable v-model="condition.enabled"/>
      </q-field>

      <!-- condition -->

      <!-- filter -->
      <c-filter-sign slot="filter" v-model="condition.name" label="이름"/>
      <!--
      <c-filter-sign slot="filter" v-model="condition.email" label="Email"/>
      <c-filter-sign slot="filter" v-model="condition.createdDateFrom" label="생성일" suffix="~" adjust-time="first"/>
      <c-filter-sign slot="filter" v-model="condition.createdDateTo" label="생성일" prefix="~" adjust-time="last"/>
      -->
      <c-filter-sign slot="filter" v-model="condition.enabled" label="활성화 여부" boolean
                     true-label="활성화 대상"
                     false-label="비활성화 대상" immutable/>
      <!-- filter -->
    </c-list-view>
  </div>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {UserPaginationArray} from './UserModel';

  export default {
    data() {
      return {
        gridOptions: {},
        array: new UserPaginationArray(),
        condition: {
          enabled: true
        }
      };
    },
    validations: {},
    mounted() {
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve();
      },
      onSortChanged(e) {
      }
    },
    computed: {
      ...mapGetters([])
    },

    components: {}
  };
</script>
