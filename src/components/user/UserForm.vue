<template>

  <q-list>

    <q-field icon="account_circle" helper="이름에 포함된 글자를 입력하세요" class="col-xs-11 col-md-4 col-xl-3">
      <q-input v-model="condition.name" float-label="이름" clearable
               @keyup.enter="retrieve()"/>
    </q-field>

    <q-field type="email" icon="account_circle" helper="사용하는 이메일을 입력하세요"
             class="col-xs-11 col-md-4 col-xl-3">
      <q-input v-model="condition.name" float-label="이메일" clearable
               @keyup.enter="retrieve()"/>
    </q-field>

  </q-list>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {UserModel} from './UserModel';

  export default {
    data() {
      return {
        model: new UserModel()
      };
    },
    validations: {},
    mounted() {
    },
    methods: {
      retrieve() {
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
