import Vue from 'vue'
import OutsourcingInvoiceForm
  from 'src/pages/outsourcing-invoice/outsourcing-invoice-form.vue'

export class OutsourcingInvoiceViewer {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const id = this.id
    const parent = this.parent
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
            h(OutsourcingInvoiceForm, {
              'ref': 'form',
              props: {
                id: id,
                closable: true,
                'close-confirmed': true
              },
              on: {
                changed: () => finish(true)
              }
            })
          ])
        }
      })
    })

  }

}