import Vue from 'vue'
import ProcessForm from 'src/pages/process/process-form.vue'

function show(id) {
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

function create(options) {
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
              itemId: options.itemId,
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

export default ({app, router, Vue}) => {
  Vue.prototype.$showProcess = show
  Vue.prototype.$createProcess = create
}
