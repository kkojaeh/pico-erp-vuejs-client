<template>
  <div class="layout-padding row justify-center fit items-center" style="min-height: 100vh">
    <q-card flat style="min-width: 300px; max-width: 90vw;">
      <q-card-title>
        패스워드 재설정
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field icon="fa-unlock-alt" helper="패스워드를 입력하세요" class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!form.$errors.password"
                 :error-label="form.$errors.password">
          <q-input ref="password" v-model="form.password" type="password" float-label="패스워드"
                   clearable
                   @keyup.enter="resetPassword()"/>
        </q-field>
      </q-card-main>
      <q-card-separator/>
      <q-card-actions align="end">
        <q-btn color="primary" @click="resetPassword()" label="Reset"></q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script type="text/javascript">
  import { Dialog } from 'quasar'
  import { mapGetters } from 'vuex'
  import firebase from 'firebase'
  import { Model } from 'src/model/model'

  import { verifyAndConfirmPasswordReset } from 'src/plugins/auth'

  class PasswordResetModel extends Model {
    async validate () {
      let constraints = {
        password: {
          presence: true,
          length: {minimum: 6, maximum: 20}
        }
      }
      return await this.$validate(constraints)
    }
  }

  export default {
    data () {
      return {
        form: new PasswordResetModel()
      }
    },
    computed: {
      ...mapGetters({
        lastAccessed: 'route/lastAccessed'
      })
    },
    mounted () {
      this.$refs.password.focus()
    },
    beforeDestroy () {
    },
    methods: {
      async resetPassword () {
        try {
          await verifyAndConfirmPasswordReset(this.form.password)
          this.$alert.positive('패스워드가 재설정 되었습니다.')
          this.$router.push('/sign-in')
        }catch(error){
          this.$alert.negative(`${error.code} - ${error.message}`)
        }


      }
    }
  }
</script>