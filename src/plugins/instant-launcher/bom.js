import Vue from 'vue'
import BomForm from 'src/pages/bom/bom-form.vue'
import BomProcessesEditor from 'src/pages/bom/bom-processes-editor.vue'

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
          h(BomForm, {
            'ref': 'form',
            props: {
              id: id,
              closable: true,
              closeConfirmed: true
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

function editProcesses(options) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    let changed = false
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (forceChanged) => {
      resolve(changed || forceChanged)
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
            hide: () => finish(false)
          }
        }, [
          h(BomProcessesEditor, {
            'ref': 'editor',
            props: {
              bomId: options.bomId,
              updatable: options.updatable,
              closable: true
            },
            on: {
              saved: () => finish(true),
              changed: () => changed = true
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$showBom = show
  Vue.prototype.$editBomProcesses = editProcesses
}
