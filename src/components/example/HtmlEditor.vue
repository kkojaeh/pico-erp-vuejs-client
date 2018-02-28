<template>
  <div>
    <c-html-editor ref="editor" v-model="html" :readonly="readonly"></c-html-editor>
    <textarea v-model="html"></textarea>
    <q-btn @click="set()">값 지정</q-btn>
    <q-checkbox v-model="readonly">readonly</q-checkbox>
  </div>

</template>

<script>

  export default {

    components: {
    },

    methods: {
      set(){
        this.html = "<p>hello</p>";
      }
    },
    beforeDestroy() {

    },
    created() {

    },
    data() {
      return {
        html: '<p>우리나라</p>',
        readonly: false
      }
    },
    watch: {}
  }
</script>
