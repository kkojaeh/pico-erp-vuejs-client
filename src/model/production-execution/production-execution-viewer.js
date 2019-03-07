import form from 'src/pages/production-execution/production-execution-form'
import Vue from 'vue'

export class ProductionExecutionViewer {

  constructor(parent) {
    this.parent = parent
  }

  async create() {
    this.action = 'create'
    return await this.show()
  }

  async show() {
    const id = this.id
    const order = this.order
    const action = this.action || 'show'
    const parent = this.parent
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
            h(form, {
              'ref': 'form',
              props: {
                id: id,
                action: action,
                order: order,
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