import Vue from 'vue'
import Form from 'src/pages/item/item-form.vue'

export class ItemViewer {

  constructor(parent) {
    this.parent = parent
  }

  async create() {
    this.action = 'create'
    return await this.show()
  }

  async show() {
    const parent = this.parent
    const id = this.id
    const action = this.action || 'show'
    const predefined = this.predefined
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
              hide: () => finish()
            }
          }, [
            h(Form, {
              'ref': 'form',
              props: {
                id: id,
                'close-confirmed': true,
                closable: true,
                predefined: predefined
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