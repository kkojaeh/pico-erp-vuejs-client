<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        생산 진행
        <span slot="right" v-if="!!model.code">
          {{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-gift" helper="진행한 품목입니다"
                 :error="!!model.$errors.itemId"
                 :error-label="model.$errors.itemId"
                 class="col-xs-12 col-md-6 col-lg-8 col-xl-9">
          <q-input :prefix="itemModel.code" float-label="품목" :value="itemModel.name" clearable
                   readonly
                   hide-underline
                   :before="[{icon: 'open_in_new', condition: !!model.itemId, handler: onShowItem}]"/>
        </q-field>

        <q-field icon="fas fa-building" helper="진행한 공정입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.processId"
                 :error-label="model.$errors.processId">
          <q-select float-label="공정" v-model="model.processId" :disabled="!model.itemId"
                    readonly hide-underline
                    :options="processLabels"></q-select>
        </q-field>

        <q-field icon="info" helper="진행한 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.quantity"
                 :error-label="model.$errors.quantity">
          <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                   :readonly="!updatable" :hide-underline="!updatable" :suffix="unitLabel"/>
          <q-tooltip>
            {{$number.words(model.quantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="info" helper="불량 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.errorQuantity"
                 :error-label="model.$errors.errorQuantity">
          <q-input type="number" float-label="불량 수량" v-model="model.errorQuantity" align="right"
                   :readonly="!updatable" :hide-underline="!updatable" :suffix="unitLabel"/>
          <q-tooltip>
            {{$number.words(model.errorQuantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-calendar" helper="시작 일시를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.startDate" :error-label="model.$errors.startDate">
          <q-datetime float-label="시작일시" v-model="model.startDate"
                      :readonly="!updatable" :hide-underline="!updatable"
                      type="datetime"/>
        </q-field>

        <q-field icon="fas fa-calendar" helper="작업 시간(hours)을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.duration" :error-label="model.$errors.duration">
          <q-input type="number" float-label="작업 시간" v-model="duration" align="right"
                   :decimals="1"
                   :readonly="!updatable" :hide-underline="!updatable" suffix="시간"/>
        </q-field>


        <q-field icon="account_box" helper="작업자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.executorId"
                 :error-label="model.$errors.executorId">
          <q-input :value="executorModel.name" float-label="작업자" readonly hide-underline></q-input>
        </q-field>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>

        <q-btn flat icon="save" @click="onSave()" v-if="updatable" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ItemModel, ItemViewer} from 'src/model/item'
  import {ProductionExecutionModel,} from 'src/model/production-execution'
  import {ItemProcessArray, ProcessModel} from 'src/model/process'
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
      order: {
        type: Object
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
        model: new ProductionExecutionModel(),
        processes: new ItemProcessArray(),
        processLabels: [],
        itemModel: new ItemModel(),
        userLabelArray: new UserLabelArray(),
        executorModel: new UserModel(),
        unitLabelArray: new UnitLabelArray(),
        enabled: true
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.userLabelArray.fetch(),
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }

    },
    methods: {
      onShowItem() {
        const viewer = new ItemViewer(this)
        viewer.id = this.model.itemId
        viewer.show()
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async create() {
        this.model = new ProductionExecutionModel()
        this.model.executorId = this.user.id
        if (this.order) {
          this.model.orderId = this.order.id
          this.model.itemId = this.order.itemId
          this.model.processId = this.order.processId
          this.model.itemSpecCode = this.order.itemSpecCode
          this.model.unit = this.order.unit
        }
        this.model.duration = 1
        this.model.startDate = moment(moment().subtract(1, 'hours').format('YYYYMMDDHH'),
            'YYYYMMDDHH').toDate()
        this.model.endDate = moment(moment().format('YYYYMMDDHH'), 'YYYYMMDDHH').toDate()
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await ProductionExecutionModel.get(id)
        this.model = model
      },
      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
          this.$redrawGrids()
        }
      },
      async onSave() {
        let valid = await this.model.validate()

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.$await(1000)
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async save() {
        await this.model.save()
        this.$emit('saved', this.model)
      }

    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      phantom() {
        return this.model.phantom
      },
      updatable() {
        return this.model.updatable
      },
      unitLabel() {
        const unit = this.model.unit
        const found = this.unitLabelArray.find(e => e.value == unit) || {}
        return found.label || ''
      },
      duration: {
        // getter
        get: function () {
          return Number(
              Number(moment(this.model.endDate).diff(this.model.startDate, 'minutes') / 60).toFixed(
                  1))
        },
        // setter
        set: function (value) {
          this.model.duration = value
          this.model.endDate = moment(this.model.startDate).add(value, 'hours').toDate()
        }
      }
    },
    watch: {
      'model.executorId': async function (to) {
        this.executorModel = await UserModel.get(to, true)
      },
      'model.itemId': async function (to) {
        this.itemModel = await ItemModel.get(to, true)
        await this.processes.fetch(to)
        this.processLabels = this.processes.map(process => {
          return {
            value: process.id,
            label: process.name
          }
        })
      },
      'model.processId': async function (to) {
        const process = await ProcessModel.get(to, true)
        this.model.itemSpecCode = process.itemSpecCode
      }

    },
    components: {
      CommentList
    }
  }
</script>
