<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        생산 요청 정보
        <span slot="right" v-if="!!model.code">{{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-gift" helper="품목을 선택하세요"
                 :error="!!model.$errors.itemId"
                 :error-label="model.$errors.itemId"
                 class="col-xs-12 col-md-6 col-lg-8 col-xl-9">
          <q-input :prefix="itemModel.code" float-label="품목" :value="itemModel.name" clearable
                   readonly hide-underline/>
        </q-field>

        <q-field icon="info" helper="요청 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.quantity"
                 :error-label="model.$errors.quantity">
          <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                   readonly hide-underline/>
          <q-tooltip>
            {{$number.words(model.quantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="warning" helper="여분 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.spareQuantity"
                 :error-label="model.$errors.spareQuantity">
          <q-input type="number" float-label="여분 수량" v-model="model.spareQuantity" align="right"
                   readonly hide-underline/>
          <q-tooltip>
            {{$number.words(model.spareQuantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      readonly hide-underline
                      type="date"/>
        </q-field>


        <q-field icon="account_box" helper="요청자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.requesterId"
                 :error-label="model.$errors.requesterId">
          <c-autocomplete-select float-label="요청자" v-model="model.requesterId"
                                 :label="requesterModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_box" helper="접수자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.accepterId"
                 :error-label="model.$errors.accepterId">
          <c-autocomplete-select float-label="접수자" v-model="model.accepterId"
                                 :label="accepterModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="check" helper="구매 요청의 상태 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabelArray"></q-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat icon="done" @click="onAccept()" label="접수" v-if="acceptable"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {ItemModel} from 'src/model/item'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ProductionRequestModel, ProductionRequestStatusArray} from 'src/model/production-request'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import {UnitLabelArray} from 'src/model/shared'

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new ProductionRequestModel(),
        itemModel: new ItemModel(),
        userLabelArray: new UserLabelArray(),
        requesterModel: new UserModel(),
        accepterModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new ProductionRequestStatusArray()
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.statusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async onItemSearch() {
        const itemModels = await this.$selectItem({})
        console.log(itemModels)
        if (!itemModels) {
          return
        }
        itemModels.forEach(itemModel => {
          this.model.itemId = itemModel.id
        })
      },
      onItemClear() {
        this.model.itemId = null
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      async create() {
        this.model = new ProductionRequestModel()
        this.model.requesterId = this.user.id
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await ProductionRequestModel.get(id)
        this.model = model
      },
      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },
      async onAccept() {
        const validCancel = await this.model.validateAccept()
        if (validCancel) {
          const ok = await this.$alert.confirm('요청을 접수 하시겠습니까?')
          if (ok) {
            await this.model.accept()
            this.$alert.positive('접수 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.accept)
        }
      }

    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      phantom() {
        return this.model.phantom
      },
      acceptable() {
        return this.model.acceptable
      }
    },
    watch: {
      'model.requesterId': async function (to) {
        this.requesterModel = await UserModel.get(to, true)
      },
      'model.accepterId': async function (to) {
        this.accepterModel = await UserModel.get(to, true)
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
      },
      'model.itemId': async function (to) {
        this.itemModel = await ItemModel.get(to, true)
      }
    },
    components: {
      CommentList
    }
  }
</script>
