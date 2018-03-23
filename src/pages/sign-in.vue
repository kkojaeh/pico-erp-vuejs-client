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
                   :error="!!form.$errors.email"
                   :error-label="form.$errors.email">
            <q-input v-model="form.email" type="email" float-label="이메일"
                     clearable @keyup.enter="signIn()"/>
          </q-field>
          <q-field icon="fa-unlock-alt" helper="패스워드를 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                   :error="!!form.$errors.password"
                   :error-label="form.$errors.password">
            <q-input v-model="form.password" type="password" float-label="패스워드" clearable
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
</template>

<script type="text/javascript">
  import { Dialog } from 'quasar'
  import { mapGetters } from 'vuex'
  import firebase from 'firebase'
  import { Model } from 'src/model/model'
  import validate from 'validate.js'

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
    mounted () {
    },
    beforeDestroy () {
    },
    computed: {},
    data () {
      return {
        form: new SignInModel()
      }
    },
    mounted () {
    },
    computed: {
      ...mapGetters({
        lastAccessed: 'route/lastAccessed'
      })
    },
    methods: {
      async signIn () {
        let valid = await this.form.validate()
        if (valid) {
          try {
            await this.$auth.signIn(this.form.email, this.form.password)
            await this.$auth.init()
            const lastAccessed = this.lastAccessed
            if(this.$route.path !== lastAccessed.path){
              this.$router.push(lastAccessed)
            }else{
              this.$router.push('/')
            }
          } catch (e) {
            this.$alert.negative(`${e.code} - ${e.message}`)
          }
        } else {
          this.$alert.warning('데이터가 유효하지 않습니다.')
        }
      },
      passwordReset () {
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
              handler: async (data) => {
                if (data.email && !validate.single(data.email, {email: true})) {
                  try {
                    await firebase.auth().sendPasswordResetEmail(data.email, {})
                    this.$alert.positive('전송이 완료 되었습니다 이메일을 확인하세요')
                  } catch (error) {
                    this.$alert.negative(`${error.code} - ${error.message}`)
                  }
                } else {
                  this.$alert.warning('이메일 양식이 아닙니다')
                  this.passwordReset()
                }
              }
            }
          ]
        })
      }
    }
  }
</script>
<style scoped>
</style>
