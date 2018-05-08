<template>
  <q-page>
    <a href="#comment-94475045-bc62-41b1-95f7-c129df05e9db">gogo</a>
    <c-html-editor ref="editor" v-model="html" :readonly="readonly"></c-html-editor>
    <textarea v-model="html"></textarea>
    <q-btn @click="set()">값 지정</q-btn>
    <q-checkbox v-model="readonly">readonly</q-checkbox>
    <comment-list subject-type="quotation" subject="a"></comment-list>
  </q-page>

</template>

<script>
  import CommentList from '../comment/comment-list.vue'

  export default {

    components: {
      'comment-list': CommentList
    },

    methods: {
      set () {
        this.html = '<p>hello</p>'
      }
    },
    beforeDestroy () {

    },
    created () {

    },
    data () {
      return {
        html: '<p>우리나라</p>',
        readonly: false
      }
    },
    watch: {}
  }
</script>
