<template>
  <q-card>
    <q-card-title>
      로그인
    </q-card-title>
    <q-card-separator/>
    <q-card-main>
      <div style="width: 500px; max-width: 90vw;">
        <q-input v-model="form.email" type="email" placeholder="email" float-label="Email" clearable
                 :error="$v.form.email.$error"
                 @keyup.enter="signIn()"/>
        <q-alert color="warning" v-if="!$v.form.email.required" v-show="$v.form.email.$error">
          이메일은 필수 입니다.
        </q-alert>
        <q-alert color="warning" v-if="!$v.form.email.email" v-show="$v.form.email.$error">
          이메일 형식을 입력하세요
        </q-alert>
        <q-input v-model="form.password" type="password" float-label="Password" clearable
                 :error="$v.form.password.$error"
                 @keyup.enter="signIn()"/>
        <q-alert color="warning" v-if="!$v.form.password.required" v-show="$v.form.password.$error">
          패스워드는 필수 입니다.
        </q-alert>
      </div>
    </q-card-main>
    <q-card-separator/>
    <q-card-actions align="center">
      <q-btn color="primary" @click="signIn()">Sign In</q-btn>
    </q-card-actions>
  </q-card>
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
  import { mapMutations } from 'vuex'
  import { Toast } from 'quasar'
  import firebase from 'firebase'

  // import Vivus from 'vivus'
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    mounted () {
    },
    beforeDestroy () {
    },
    computed: {},
    data () {
      return {
        form: {
          email: '',
          password: ''
        }
      }
    },
    validations: {
      form: {
        email: {required, email},
        password: {required}
      }
    },
    methods: {
      ...mapMutations(['setFrameNeeded', 'setAuthNeeded']),
      signIn () {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          Toast.create.warning('데이터가 유효하지 않습니다.')
          return
        }
        firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then(() => {
          this.$router.go(-1)
        }).catch((error) => {
          Toast.create.negative(`${error.code} - ${error.message}`)
        })
      }
    }
  }
</script>
<style scoped>
</style>
