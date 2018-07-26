<template>
  <q-page>
    <button class="primary save" @click="save()">
      <i class="on-left">save</i>
      저장
    </button>
    <button class="primary set" @click="attachmentId = 'e0fe262d-f0fe-4aba-82b0-0bb1e85fafb5'">
      <i class="on-left">search</i>
      set value
    </button>
    <c-attachment ref="attachment" v-model="attachmentId" category="quotation"
                  multiple></c-attachment>
  </q-page>

</template>

<script>

  export default {

    components: {},

    methods: {
      save () {
        var att = this.$refs.attachment
        att.save().then((result) => {
          console.log(result)
        })
      }
    },
    beforeDestroy () {

    },
    created () {

    },
    data () {
      return {
        attachmentId: null
      }
    },
    watch: {}
  }
</script>
