<template>
  <q-list highlight separator>
    <q-item v-for="(item, index) in array" multiline :key="item.id" :data-comment="item.id">
      <q-item-side left :stamp="item.createdBy.name">
      </q-item-side>
      <q-item-main>
        <q-item-tile>
          <div class="comment-viewer" data-tribute="true" v-html="item.comment"></div>
        </q-item-tile>
      </q-item-main>
      <q-item-side right>
        <q-item-tile stamp>
          <strong>{{printAgo(item.createdDate)}}</strong><br><sub>({{printDate(
          item.createdDate)}})</sub>
        </q-item-tile>
      </q-item-side>
    </q-item>
    <q-item-separator v-if="max > 1"/>
    <div class="row justify-center">
      <q-pagination v-if="max > 1" v-model="page" :max="max" @input="setPage"></q-pagination>
    </div>
    <q-item-separator/>
    <q-item :disabled="!subject">
      <q-item-main>
        <q-field icon="fa-reply" class="col-12" helper="남기실 글을 입력하세요"
                 :error="!!model.$errors.comment"
                 :error-label="model.$errors.comment"
                 :count="200">
          <q-input ref="editor" type="textarea" v-model="model.comment" float-label="댓글"
                   @keyup.enter.ctrl="register" @keyup.alt.enter="register" rows="1"
                   max-length="200"/>
        </q-field>
      </q-item-main>
      <q-item-side right>
        <q-btn color="secondary" icon="add" @click="register">등록</q-btn>
      </q-item-side>
    </q-item>
  </q-list>

</template>
<script>
  import { mapGetters } from 'vuex'
  import { date } from 'quasar'
  import { api } from 'src/plugins/axios'
  import { CommentModel, CommentArray } from './comment-model'
  import { UserLabelArray } from 'src/pages/user/user-model'
  import moment from 'moment'
  import Tribute from 'tributejs'
  import 'tributejs/dist/tribute.css'

  export default {
    name: 'comment-list',
    props: {
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
      },
      subjectType: {
        type: String,
        required: true
      },
      subject: {
        type: String
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
        page: 1,
        model: new CommentModel(),
        array: new CommentArray(),
        userLabels: new UserLabelArray()
      }
    },
    methods: {
      async load () {
        this.array.size = this.pageSize
        await this.array.fetch({
          subjectId: this.subject,
          subjectTypeId: this.subjectType
        })
        const prefix = '#comment-'
        const hash = this.$route.hash || ''
        debugger
        if (hash.startsWith(prefix)) {
          const commentId = hash.substring(prefix.length)
          setTimeout(() => {
            const commentEl = this.$el.querySelector(`[data-comment="${commentId}"]`)
            if (commentEl) {
              commentEl.scrollIntoView()
            }
          }, 500)
        }
      },
      async register () {
        if (this.registering) {
          return
        }
        this.registering = true
        this.model.subjectId = this.subject
        this.model.subjectTypeId = this.subjectType
        const valid = await this.model.validateForCreate()
        if (valid) {
          await this.model.create()
          await this.load()
          this.model = new CommentModel()
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
        this.registering = false
      },
      setPage (value) {
        this.page = value
        this.array.page = value
        this.load()
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
      max () {
        return Math.max(1, Math.ceil(this.array.total / this.pageSize))
      }
    },
    watch: {
      subject (to) {
        this.$nextTick(this.load)
      }
    },
    mounted () {
      this.tribute = new Tribute({
        values: async (keyword, done) => {
          await this.userLabels.query(keyword)
          done(this.userLabels)
        },
        lookup: (item) => {
          return item.label
        },
        selectTemplate: (item) => {
          return `@${item.original.label}<${item.original.subLabel}>`
        },
        menuItemTemplate: function (item) {
          return `${item.original.label}&lt;${item.original.subLabel}&gt;`
        }
      })
      let textareas = this.$refs.editor.$el.querySelectorAll('textarea')
      this.tribute.attach(textareas)
      if (this.subject) {
        this.load()
      }
    },
    destroyed () {
      // 소멸자를 제공하지 않음
      this.tribute = null
    }
  }
</script>
<style>
  .comment-editor[contenteditable="true"] {
    min-height: 40px;
  }

  .comment-editor[contenteditable="true"]:focus {
    outline: none;
  }

  .comment-viewer {
    margin-top: 5px;
  }

</style>
