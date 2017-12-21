<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-card>
        <q-card-title>
          로그인
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <q-field icon="email" helper="이메일을 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                   :error="this.$v.form.email.$error"
                   :error-label="getErrorLabel(this.$v.form.email)">
            <q-input v-model="form.email" type="email" float-label="이메일"
                     clearable @keyup.enter="signIn()"/>
          </q-field>
          <q-field icon="fa-unlock-alt" helper="패스워드를 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                   :error="this.$v.form.password.$error"
                   :error-label="getErrorLabel(this.$v.form.password)">
            <q-input v-model="form.password" type="password" float-label="패스워드" clearable
                     :error="$v.form.password.$error"
                     @keyup.enter="signIn()"/>
          </q-field>
        </q-card-main>
        <q-card-separator/>
        <q-card-actions align="between">
          <q-btn color="primary" @click="passwordReset()" flat>비밀번호 찾기</q-btn>
          <q-btn color="primary" @click="signIn()">Sign In</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <!--<div class="layout-padding docs-input row justify-center">-->
  <!---->
  <!--<q-input v-model="form.email" type="email" placeholder="email" float-label="Email" clearable-->
  <!--:error="$v.form.email.$error"/>-->
  <!--<q-input v-model="form.password" type="password" float-label="Password" clearable-->
  <!--:error="$v.form.password.$error"/>-->
  <!--<q-btn color="primary" @click="signIn()">Sign In</q-btn>-->
  <!--</div>-->
  <!--</div>-->
</template>

<script type="text/javascript">
  import {Dialog} from 'quasar';
  import {warning, negative, positive, getErrorLabel} from 'src/util';
  import {mapGetters} from 'vuex';
  import firebase from 'firebase';
  import * as auth from 'src/config/auth';
  import {required, email} from 'vuelidate/lib/validators';

  export default {
    mounted() {
    },
    beforeDestroy() {
    },
    computed: {},
    data() {
      return {
        form: {
        }
      };
    },
    validations: {
      form: {
        email: {required, email},
        password: {required}
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['lastAccessRouter'])
    },
    methods: {
      getErrorLabel,
      signIn() {
        this.$v.form.$touch();
        if (this.$v.form.$error) {
          warning('데이터가 유효하지 않습니다.');
          return;
        }
        auth.signIn(this.form.email, this.form.password).then(() => {
          auth.init().then(() => {
            this.$router.push(this.lastAccessRouter);
          });
        }).catch((error) => {
          negative(`${error.code} - ${error.message}`);
        });
      },
      passwordReset() {
        Dialog.create({
          title: '패스워드 리셋',
          message: '가입한 이메일 주소를 입력하세요',
          form: {
            email: {
              type: 'email',
              label: 'e-mail',
              model: ''
            }
          },
          buttons: [
            '취소',
            {
              label: '전송',
              handler: (data) => {
                if (data.email && email(data.email)) {
                  firebase.auth().sendPasswordResetEmail(
                      data.email, {
                        // url: location.href
                      })
                  .then(() => {
                    positive('전송이 완료 되었습니다 이메일을 확인하세요');
                  })
                  .catch((error) => {
                    negative(`${error.code} - ${error.message}`);
                  });
                } else {
                  warning('이메일 양식이 아닙니다');
                  this.passwordReset();
                }
              }
            }
          ]
        });
      }
    }
  };
</script>
<style scoped>
</style>
