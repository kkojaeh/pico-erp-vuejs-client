<template>

  <q-page class="row layout-padding">

    <!-- child -->

    <router-view></router-view>

    <!-- child -->

    <q-card class="col-12" flat>

      <q-card-title>
        나의 계정
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!phantom"
                   :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" readonly hide-underline/>
        </q-field>

        <q-field icon="email"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.email"
                 :error-label="model.$errors.email">
          <q-input v-model="model.email" float-label="이메일" type="email" readonly hide-underline/>
        </q-field>

        <q-field icon="fas fa-sitemap"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.departmentId"
                 :error-label="model.$errors.departmentId">
          <c-autocomplete-select float-label="부서" v-model="model.departmentId"
                                 :label="departmentModel.name" :options="departmentLabelArray"
                                 label-field="label" value-field="value"
                                 @search="_onDepartmentSearch" readonly hide-underline>
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-mobile"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.mobilePhoneNumber" clearable float-label="핸드폰 번호"
                                readonly hide-underline/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="vpn_key" label="패스워드 변경" @click="_onResetPasswordClick"/>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {DepartmentLabelArray, DepartmentModel, MyModel} from 'src/model/user'

  export default {
    props: {
      closable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: new MyModel(),
        departmentLabelArray: new DepartmentLabelArray(),
        departmentModel: new DepartmentModel()
      }
    },
    mounted () {
      this.departmentLabelArray.fetch()
      this.show()
    },
    methods: {
      async show () {
        this.model = await MyModel.get()
      },
      async _onDepartmentSearch (keyword, done) {
        await this.departmentLabelArray.fetch(keyword)
        done()
      },
      async _onResetPasswordClick () {
        const ok = await this.$alert.confirm('패스워드를 변경 하시겠습니까?')
        if (ok) {
          try {
            await this.$auth.resetPassword(this.model.email)
            this.$alert.positive('패스워드 변경 이메일이 전송 되었습니다')
          } catch (error) {
            this.$alert.negative(`${error.code} - ${error.message}`)
          }
        }
      }
    },

    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'model.departmentId': async function (to) {
        this.departmentModel = await DepartmentModel.get(to, true)
      }
    }
  }
</script>
