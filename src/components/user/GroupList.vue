<template>
  <div>
    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <c-list-view ref="listView" :array="array" :condition="condition" >

      <!-- action -->

      <div slot="action">
        <q-side-link :to="{ path: '/group/create', query: $route.query}">
          <q-btn flat icon="add">생성</q-btn>
        </q-side-link>
      </div>

      <!-- action -->

      <!-- main -->
      <ag-grid ref="grid" class="ag-theme-material"
               row-selection="single"
               enable-server-side-sorting
               enable-col-resize
               enable-sorting
               :grid-options="gridOptions"
               :row-data="array">
        <ag-grid-column field="id" header-name="아이디" :width="150"
                        cell-renderer-framework="ag-grid-link-renderer"
                        :cell-renderer-params="{path:'/group/show/${id}', query:$route.query}"/>
        <ag-grid-column field="name" header-name="이름" :width="150"/>
        <ag-grid-column field="createdBy.name" header-name="생성자" :width="150"/>
        <ag-grid-column field="createdDate" header-name="생성시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
        <ag-grid-column field="lastModifiedBy.name" header-name="수정자" :width="150"/>
        <ag-grid-column field="lastModifiedDate" header-name="수정시간" :width="200"
                        cell-renderer-framework="ag-grid-datetime-renderer"/>
      </ag-grid>

      <!-- main -->

      <!-- condition -->

      <q-field slot="condition" icon="account_circle" helper="이름에 포함된 글자를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="condition.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <!-- condition -->

      <!-- filter -->

      <c-filter-chip slot="filter-chip" v-model="condition.name" label="이름"/>
      <!-- filter -->

    </c-list-view>
  </div>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {GroupArray} from './GroupModel';

  export default {
    data() {
      return {
        gridOptions: {},
        array: new GroupArray(),
        condition: {
        }
      };
    },
    mounted() {
    },
    methods: {
      retrieve() {
        this.$refs.listView.retrieve();
      }
    },
    computed: {
      ...mapGetters([])
    },

    components: {}
  };
</script>
