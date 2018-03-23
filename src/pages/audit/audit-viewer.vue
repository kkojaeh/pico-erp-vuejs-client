<template>
  <q-list highlight inset-separator>
    <q-list-header>이력</q-list-header>
    <q-item-separator/>
    <q-item v-for="(item, index) in array" multiline :key="item.commitDate + '-' + index">
      <q-item-main>
        <q-item-tile sublabel>{{item.committer.name}} (이)가 {{printCommit(item)}}</q-item-tile>
        <q-item-tile label v-for="change in item.changes" :key="change.property">
          <div v-if="isFromTo(change)">
            <strong>{{change.description}}</strong> (을)를 <strong>`{{change.from}}`</strong>
            에서 <strong>`{{change.to}}`</strong> (으)로 변경
          </div>
          <div v-else-if="isAddedAndRemoved(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>`{{change.added.join(
            ',')}}`</strong> (을)를 추가하고 <strong>`{{change.removed.join(',')}}`</strong> (을)를 제거
          </div>
          <div v-else-if="isAddedOnly(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>`{{change.added.join(
            ',')}}`</strong> (을)를 추가
          </div>
          <div v-else-if="isRemovedOnly(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>`{{change.removed.join(
            ',')}}`</strong> (을)를 제거
          </div>
        </q-item-tile>
      </q-item-main>
      <q-item-side right>
        <q-item-tile stamp>
          <strong>{{printAgo(item.commitDate)}}</strong><br><sub>({{printDate(
          item.commitDate)}})</sub>
        </q-item-tile>
      </q-item-side>
    </q-item>
  </q-list>

</template>
<script>
  import { mapGetters } from 'vuex'
  import { date } from 'quasar'
  import { FetchableArray } from 'src/model/array'
  import { api } from 'src/plugins/axios'
  import moment from 'moment'
  import QItemTile from 'quasar-framework/src/components/list/QItemTile'

  class AuditArray extends FetchableArray {
    axios = api
  }

  export default {
    name: 'audit-viewer',
    props: {
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
      },
      url: {
        type: String,
        required: true
      },
      data: {
        type: Object
      }
    },
    data () {
      return {
        array: new AuditArray()
      }
    },
    methods: {
      load () {
        this.array.url = this.url
        this.array.fetch(this.data)
      },
      printCommit (item) {
        if (item.initial) {
          return '최초 생성 했습니다'
        } else {
          return '변경 했습니다'
        }
      },
      isFromTo (change) {
        return change.from !== undefined && change.to !== undefined
      },
      isAddedAndRemoved (change) {
        return change.added && change.added.length && change.removed && change.removed.length
      },
      isAddedOnly (change) {
        return change.added && change.added.length
      },
      isRemovedOnly (change) {
        return change.removed && change.removed.length
      },
      printAgo (d) {
        if (typeof d == 'string') {
          d = new Date(Date.parse(d))
        }
        if (!isNaN(d)) {
          return moment(d).fromNow()
        }
      },
      printDate (d) {
        if (typeof d == 'string') {
          d = new Date(Date.parse(d))
        }
        if (!isNaN(d)) {
          return date.formatDate(d, this.dateFormat)
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {QItemTile},
    mounted () {
    }
  }
</script>
