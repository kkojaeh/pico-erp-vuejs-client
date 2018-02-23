<template>
<div>
  <c-attachment ref="attachment" v-model="attachmentId" category="quotation"></c-attachment>
  <button class="primary save" @click="attSync()">
      <i class="on-left">save</i>
      sync
    </button>
      <button class="primary set" @click="attachmentId = 'zbNv67Z6Z7osMWGRy8Xx'">
      <i class="on-left">search</i>
      set value
    </button>

    </div>
</div>

</template>

<script>
export default {

  methods: {
    attSync() {
      var att = this.$refs.attachment
      att.save().then((result) => {
        console.log(result)
      })
    }
  },
  beforeDestroy() {

  },
  created() {

  },
  data() {
    return {
      attachmentId: null
    }
  },
  watch: {

  }
}
</script>
