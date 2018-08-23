<template>
  <div class="layout-padding row justify-center fit items-center" style="min-height: 100vh">
    <q-card flat style="min-width: 300px; max-width: 90vw;">
      <q-card-title>
        로그인
        <div slot="right" class="row items-center">
          <q-checkbox slot="subtitle" v-model="keepEmail" label="로그인 이메일 유지"/>
        </div>
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field icon="email" helper="이메일을 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!form.$errors.email"
                 :error-label="form.$errors.email">
          <q-input ref="email" v-model="form.email" type="email" float-label="이메일"
                   clearable @keyup.enter="signIn()"/>
        </q-field>
        <q-field icon="fas fa-unlock-alt" helper="패스워드를 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!form.$errors.password"
                 :error-label="form.$errors.password">
          <q-input ref="password" v-model="form.password" type="password" float-label="패스워드"
                   clearable
                   @keyup.enter="signIn()"/>
        </q-field>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions align="between">
        <q-btn color="primary" @click="resetPassword()" flat label="비밀번호 찾기"></q-btn>
        <q-btn color="primary" @click="signIn()" label="Sign In"></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script type="text/javascript">
  import {Dialog} from 'quasar'
  import {mapGetters} from 'vuex'
  import {Model} from 'src/model/model'
  import validate from 'validate.js'
  import * as _ from 'lodash'

  class SignInModel extends Model {
    async validate () {
      let constraints = {
        email: {
          presence: true,
          email: true
        },
        password: {
          presence: true
        }
      }
      return await this.$validate(constraints)
    }
  }

  export default {
    data () {
      return {
        form: new SignInModel(),
        keepEmail: false
      }
    },
    computed: {
      ...mapGetters({
        lastAccessed: 'route/lastAccessed'
      })
    },
    mounted () {
      const email = localStorage.getItem('sign-in-email')
      if (email) {
        this.form.email = email
        this.keepEmail = true
        this.$refs.password.focus()
      } else {
        this.$refs.email.focus()
      }
    },
    beforeDestroy () {
    },
    methods: {
      async signIn () {
        let valid = await this.form.validate()
        if (valid) {
          try {
            await this.$auth.signIn(this.form.email, this.form.password)
            if (this.keepEmail) {
              localStorage.setItem('sign-in-email', this.form.email)
            } else {
              localStorage.removeItem('sign-in-email')
            }
            await this.$auth.init()
            const lastAccessed = this.lastAccessed
            if (this.$route.path !== lastAccessed.path && lastAccessed.path !== '/') {
              this.$router.push(_.assign({}, lastAccessed))
            } else {
              this.$router.push('/')
            }
          } catch (e) {
            console.error(e)
            this.$alert.negative(`${e.code} - ${e.message}`)
          }
        } else {
          this.$alert.warning('데이터가 유효하지 않습니다.')
        }
      },
      async resetPassword () {
        const result = await Dialog.create({
          title: '패스워드 리셋',
          message: '가입한 이메일 주소를 입력하세요',
          cancel: true,
          prompt: {
            model: this.form.email,
            type: 'text'
          }
        })
        if (result && !validate.single(result, {email: true})) {
          try {
            await this.$auth.resetPassword(result)
            this.$alert.positive('전송이 완료 되었습니다 이메일을 확인하세요')
          } catch (error) {
            this.$alert.negative(`${error.code} - ${error.message}`)
          }
        } else {
          this.$alert.warning('이메일 양식이 아닙니다')
          this.resetPassword()
        }
      }
    }
  }
</script>