<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        구매 요청 정보
        <span slot="right" v-if="!!model.code">
          {{statusLabel}} - {{model.code}}
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
                                 :readonly="!updatable" :hide-underline="!updatable"
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
                   readonly
                   :hide-underline="!updatable"
                   :before="[{icon: 'open_in_new', condition: !!model.itemId, handler: onShowItem}]"
                   :after="[{ icon:'search', condition: updatable, handler:onItemSearch}]"/>
        </q-field>

        <q-field icon="fas fa-gift" helper="품목 스펙을 입력하세요"
                 :error="!!model.$errors.itemSpecId"
                 :error-label="model.$errors.itemSpecId"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input float-label="품목 스펙" :value="model.itemSpecCode" clearable
                   readonly
                   :hide-underline="!updatable"
                   :after="[{ icon:'open_in_new', condition: updatable && itemModel.specifiable, handler:onOpenItemSpec}]"/>
        </q-field>

        <q-field icon="info" helper="요청 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.quantity"
                 :error-label="model.$errors.quantity">
          <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                   :readonly="!updatable" :hide-underline="!updatable" :suffix="unitLabel"/>
          <q-tooltip>
            {{$number.words(model.quantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      :readonly="!updatable" :hide-underline="!updatable"
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

        <q-field icon="description" helper="비고 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.remark"
                 :error-label="model.$errors.remark"
                 :count="50">
          <q-input type="textarea" v-model="model.remark" float-label="비고"
                   rows="4"
                   :readonly="!updatable" :hide-underline="!updatable"
                   max-length="50"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        인수 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="품목을 인수할 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiverId"
                 :error-label="model.$errors.receiverId">
          <c-autocomplete-select float-label="인수사" v-model="model.receiverId"
                                 :label="receiverModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>


        <q-field icon="fas fa-building" helper="인수지를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiveSiteId"
                 :error-label="model.$errors.receiveSiteId" v-if="ownerRelated">
          <q-select float-label="인수지" v-model="model.receiveSiteId"
                    :display-value="receiveSiteModel.name || null"
                    :readonly="!updatable" :hide-underline="!updatable"
                    :options="siteArray" clearable></q-select>
        </q-field>

        <q-field icon="fas fa-building" helper="인수지(상세)를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiveStationId"
                 :error-label="model.$errors.receiveStationId" v-if="ownerRelated">
          <q-select float-label="인수지" v-model="model.receiveStationId"
                    :display-value="receiveStationModel.name || null"
                    :readonly="!updatable" :hide-underline="!updatable"
                    :options="stationArray" clearable></q-select>
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
        <q-btn flat icon="send" @click="onCommit()" label="제출"
               v-if="committable"></q-btn>
        <q-btn flat icon="cancel" @click="onCancel()" label="취소"
               v-if="cancelable"></q-btn>

        <q-btn flat icon="save" @click="onSave()" v-if="updatable" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {ItemModel, ItemSpecModel} from 'src/model/item'
  import {PurchaseRequestModel, PurchaseRequestStatusArray} from 'src/model/purchase-request'
  import {
    WarehouseSiteArray,
    WarehouseSiteModel,
    WarehouseStationArray,
    WarehouseStationModel,
  } from 'src/model/warehouse'
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
        model: new PurchaseRequestModel(),
        itemModel: new ItemModel(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        requesterModel: new UserModel(),
        accepterModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        receiverModel: new CompanyModel(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new PurchaseRequestStatusArray(),
        receiveStationModel: new WarehouseStationModel(),
        receiveSiteModel: new WarehouseSiteModel(),
        siteArray: new WarehouseSiteArray(),
        stationArray: new WarehouseStationArray(),

        enabled: true,
        selected: {
          item: null
        },
        owner: new CompanyModel()
      }
    },
    async mounted() {
      this.owner = await CompanyModel.owner()
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.siteArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.statusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.siteArray.forEach(site => {
        site.value = site.id
        site.label = site.name
      })
    },
    methods: {
      onShowItem() {
        this.$showItem(this.model.itemId)
      },
      async onItemSearch() {
        const itemModels = await this.$selectItem({})
        if (!itemModels) {
          return
        }
        itemModels.forEach(async itemModel => {
          const item = await ItemModel.get(itemModel.id, true)
          this.model.itemId = item.id
          this.model.itemSpecId = null
          this.model.unit = item.unit
          if (item.specifiable) {
            this.model.itemSpecCode = null
          } else {
            this.model.itemSpecCode = 'N/A'
          }
        })
      },
      onItemClear() {
        this.model.itemId = null
      },
      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      onItemSelectionChanged(event) {
        this.selected.item = event.api.getSelectedRows()[0]
      },

      async onOpenItemSpec(data) {
        this.selected.item = data
        const model = this.model
        if (model.itemSpecId) {
          const changed = await this.$showItemSpec(model.itemSpecId, {
            editable: this.updatable
          })
          if (changed) {
            const itemSpecModel = await ItemSpecModel.get(model.itemSpecId)
            this.model.itemSpecCode = itemSpecModel.code
          }
        } else {
          const created = await this.$createItemSpec({
            itemId: model.itemId
          })
          if (created) {
            model.itemSpecId = created.id
            const itemSpecModel = await ItemSpecModel.get(model.itemSpecId)
            this.model.itemSpecCode = itemSpecModel.code

          }
        }
      },

      async create() {
        this.model = new PurchaseRequestModel()
        //this.itemArray = new PurchaseRequestItemArray(this.model)
        this.model.requesterId = this.user.id
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await PurchaseRequestModel.get(id)
        // const itemArray = new PurchaseRequestItemArray(model)
        // await itemArray.fetch()
        this.model = model
        // this.itemArray = itemArray
      },
      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },
      async onSave() {
        await this.model.fetchReference()
        let valid = ![
          await this.model.validate()
        ].includes(false)

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async save() {
        await this.model.save()
      },

      async onCommit() {
        await this.model.fetchReference()
        let valid = ![
          await this.model.validate()
        ].includes(false)
        if (!valid) {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
          return
        }
        const validCommit = await this.model.validateCommit()
        if (validCommit) {
          const ok = await this.$alert.confirm('요청을 제출 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.commit()
            this.$alert.positive('제출 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.commit)
        }
      },

      async onCancel() {
        const validCancel = await this.model.validateCancel()
        if (validCancel) {
          const ok = await this.$alert.confirm('요청을 취소 하시겠습니까?')
          if (ok) {
            await this.model.cancel()
            this.$alert.positive('취소 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.cancel)
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
      updatable() {
        return this.model.updatable
      },
      committable() {
        return this.model.committable
      },
      cancelable() {
        return this.model.cancelable
      },
      ownerRelated() {
        return this.owner.id == this.model.receiverId
      },
      statusLabel() {
        const status = this.model.status
        const found = this.statusLabelArray.find(e => e.value == status) || {}
        return found.label || ''
      },
      unitLabel() {
        const unit = this.model.unit
        const found = this.unitLabelArray.find(e => e.value == unit) || {}
        return found.label || ''
      }
    },
    watch: {
      'model.requesterId': async function (to) {
        this.requesterModel = await UserModel.get(to, true)
      },
      'model.accepterId': async function (to) {
        this.accepterModel = await UserModel.get(to, true)
      },
      'model.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
        if (to != this.owner.id) {
          this.model.receiveSiteId = null
          this.model.receiveStationId = null
        }
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
      },
      'model.receiveStationId': async function (to) {
        this.receiveStationModel = await WarehouseStationModel.get(to, true)
      },
      'model.receiveSiteId': async function (to) {
        this.receiveSiteModel = await WarehouseSiteModel.get(to, true)
        const stationArray = new WarehouseStationArray(this.receiveSiteModel)
        await stationArray.fetch()
        this.stationArray = stationArray.map(station => {
          return {
            value: station.id,
            label: station.name
          }
        })
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
