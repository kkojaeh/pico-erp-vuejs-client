import Vue from 'vue'
import DeliveryForm from 'src/pages/delivery/delivery-form'

export class DeliveryExecutor {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const id = this.id
    const mails = this.mails
    const faxNumbers = this.faxNumbers
    const parent = this.parent
    return new Promise(async (resolve, reject) => {
      const node = document.createElement('div')
      document.body.appendChild(node)
      const finish = () => {
        resolve()
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
            h(DeliveryForm, {
              'ref': 'form',
              props: {
                id: id,
                mails: mails,
                faxNumbers: faxNumbers,
                'close-confirmed': true,
                closable: true
              },
              on: {
                saved: () => finish()
              }
            })
          ])
        }
      })
    })

  }

}
