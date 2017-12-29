<template>
  <q-list highlight inset-separator>
    <q-list-header>이력</q-list-header>
    <q-item-separator/>
    <q-item v-for="item in array" multiline :key="item.commitDate">
      <q-item-main>
        <q-item-tile sublabel>{{item.committer.name}} (이)가 {{printCommit(item)}}</q-item-tile>
        <q-item-tile label v-for="change in item.changes" :key="change.property">
          <div v-if="isFromTo(change)">
            <strong>{{change.description}}</strong> (을)를 <strong>{{change.from}}</strong> 에서 <strong>{{change.to}}</strong> (으)로 변경
          </div>
          <div v-else-if="isAddedAndRemoved(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>{{change.added.join(',')}}</strong> (을)를 추가하고 <strong>{{change.removed.join(',')}}</strong> (을)를 제거
          </div>
          <div v-else-if="isAddedOnly(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>{{change.added.join(',')}}</strong> (을)를 추가
          </div>
          <div v-else-if="isRemovedOnly(change)">
            <strong>{{change.description}}</strong> (에)서 <strong>{{change.removed.join(',')}}</strong> (을)를 제거
          </div>
        </q-item-tile>
      </q-item-main>
      <q-item-side right :stamp="printDate(item.commitDate)"/>
    </q-item>
  </q-list>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {date} from 'quasar';
  import {FetchableArray} from 'src/model/Array';
  import {api} from 'src/config/axios';
  import moment from 'moment';

  class AuditArray extends FetchableArray {
    axios = api;
  };

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
    data() {
      return {
        array: new AuditArray()
      };
    },
    methods: {
      load() {
        this.array.url = this.url;
        this.array.fetch(this.data);
      },
      printCommit(item) {
        if (item.initial) {
          return '최초 생성 했습니다';
        } else {
          return '변경 했습니다';
        }
      },
      isFromTo(change) {
        return change.from && change.to;
      },
      isAddedAndRemoved(change) {
        return change.added && change.added.length && change.removed && change.removed.length;
      },
      isAddedOnly(change) {
        return change.added && change.added.length;
      },
      isRemovedOnly(change) {
        return change.removed && change.removed.length;
      },
      printDate(d) {
        if (!isNaN(d)) {
          let ago = moment(d).fromNow();
          let formatted = date.formatDate(d, this.dateFormat);
          return `<strong>${ago}</strong><br><sub>(${formatted})</sub>`;
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {},
    mounted() {
    }
  };
</script>
