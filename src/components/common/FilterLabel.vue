<template>
  <q-chip v-show="value" :closable="!immutable" color="primary" small @close="onClose">
    <div class="q-toolbar-subtitle">{{label}}</div>
    {{prefix}} {{print(value)}} {{suffix}}
  </q-chip>
</template>

<script>
  export default {
    name: 'c-filter-label',
    props: {
      value: null,
      label: {
        required: true
      },
      prefix: '',
      suffix: '',
      immutable: false
    },
    data () {
      return {}
    },
    methods: {
      onClose () {
        this.$emit('input', null)
      },
      print (value) {
        return value
      }
    },
    mounted () {
    },
    destroyed () {

    }
  }
</script>

<style>
</style>
