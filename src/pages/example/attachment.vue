<template>
  <div>
    <button class="primary save" @click="save()">
      <i class="on-left">save</i>
      저장
    </button>
    <button class="primary set" @click="attachmentId = 'b4fcb314-c24d-43c9-bc9c-c5c91d27e2b2'">
      <i class="on-left">search</i>
      set value
    </button>
    <c-attachment ref="attachment" v-model="attachmentId" category="quotation" multiple></c-attachment>
  </div>

</template>

<script>

  export default {

    components: {
    },

    methods: {
      save() {
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
    watch: {}
  }
</script>
