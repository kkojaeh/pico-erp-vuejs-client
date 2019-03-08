import Vue from 'vue'
import Viewer from 'src/pages/item/item-spec-editor.vue'

export class ItemSpecViewer {

  constructor(parent) {
    this.parent = parent
  }

  async create() {
    this.action = 'create'
    this.editable = true
    return await this.show()
  }

  async show() {
    const parent = this.parent
    const id = this.id
    const itemId = this.itemId
    const action = this.action || 'show'
    const editable = this.editable || false
    return new Promise(async (resolve, reject) => {
      const node = document.createElement('div')
      document.body.appendChild(node)
      const finish = (model) => {
        resolve(model)
        vm.$destroy()
        vm.$el.remove()
      }
      const vm = new Vue({
        el: node,
        parent: parent,
        mounted() {
          this.$nextTick(() => {
            this.$refs.modal.show()
            this.$refs.form[action]()
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
              'ref': 'form',
              props: {
                id: id,
                itemId: itemId,
                editable: editable,
                'close-confirmed': true,
                closable: true
              },
              on: {
                saved: (model) => finish(model)
              }
            })
          ])
        }
      })
    })

  }

}