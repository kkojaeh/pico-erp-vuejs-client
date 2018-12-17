import Vue from 'vue'
import ProcessForm from 'src/pages/process/process-form.vue'
import ProcessTypeSelector from 'src/pages/process/process-type-selector.vue'

function showProcess(id) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (changed) => {
      resolve(changed)
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
          this.$refs.form.show()
        })
      },
      render(h) {
        return h('q-modal', {
          'ref': 'modal',
          props: {
            'content-classes': 'column'
          },
          on: {
            hide: () => finish(false)
          }
        }, [
          h(ProcessForm, {
            'ref': 'form',
            props: {
              id: id,
              'closable': true,
              'close-confirmed': true
            },
            on: {
              saved: () => finish(true)
            }
          })
        ])
      }
    })
  })
}

function createProcess(options) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (created) => {
      resolve(created)
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
          this.$refs.form.create()
        })
      },
      render(h) {
        return h('q-modal', {
          'ref': 'modal',
          props: {
            'content-classes': 'column'
          },
          on: {
            hide: () => finish()
          }
        }, [
          h(ProcessForm, {
            'ref': 'form',
            props: {
              'closable': true,
              'close-confirmed': true
            },
            on: {
              saved: (processModel) => finish(processModel)
            }
          })
        ])
      }
    })
  })
}

function selectProcessType(options) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (selected) => {
      resolve(selected)
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
        })
      },
      render(h) {
        return h('q-modal', {
          'ref': 'modal',
          props: {
            'content-classes': 'column'
          },
          on: {
            hide: () => finish()
          }
        }, [
          h(ProcessTypeSelector, {
            props: {
              multiple: !!options.multiple
            },
            on: {
              selected: (processTypes) => finish(processTypes)
            }
          })
        ])
      }
    })
  })
}


export default ({app, router, Vue}) => {
  Vue.prototype.$showProcess = showProcess
  Vue.prototype.$createProcess = createProcess
  Vue.prototype.$selectProcessType = selectProcessType
}
