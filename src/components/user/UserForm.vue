<template>

  <q-card class="col-xs-11 col-md-4 col-xl-3">

    <q-card-main>

      <q-field icon="account_circle" helper="이름에 포함된 글자를 입력하세요" class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="model.name" float-label="이름" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field icon="email" helper="사용하는 이메일을 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-input v-model="model.email" float-label="이메일" type="email" clearable
                 @keyup.enter="retrieve()"/>
      </q-field>

      <q-field icon="phone" helper="핸드폰 번호를 입력하세요"
               class="col-xs-11 col-md-4 col-xl-3">
        <c-phone-input v-model="model.phoneNumber" clearable></c-phone-input>
      </q-field>

      <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 로그인이 불가합니다"
               class="col-xs-11 col-md-4 col-xl-3">
        <q-toggle label="활성화 여부" clearable v-model="model.enabled"/>
      </q-field>

    </q-card-main>

    <q-card-separator/>

    <q-card-actions align="end">
      <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
      <q-btn flat icon="save" @click="save()">저장</q-btn>
    </q-card-actions>
  </q-card>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {UserModel} from './UserModel';
  import {confirm} from 'src/util';
  // eslint-disable-line

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      }
    },
    data() {
      return {
        model: new UserModel({}),
        creating: false
      };
    },
    validations: {},
    mounted() {
      this.$nextTick(() => this[this.action]());
    },
    methods: {
      create() {
        this.creating = true;
        this.model = new UserModel({});
      },
      retrieve() {
      },
      save() {
        confirm('저장 하시겠습니까?').then((ok) => {
          if (ok) {
            console.log(this.model);
          }
        });
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {}
  };
</script>
