import Vue from 'vue'
import Viewer from 'src/pages/process/item-processes-viewer.vue'

export class ItemProcessesViewer {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
    const itemId = this.itemId
    const updatable = this.updatable || false
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
            h(Viewer, {
              'ref': 'editor',
              props: {
                itemId: itemId,
                updatable: updatable,
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

}