import Vue from 'vue'
import Form from 'src/pages/bom/bom-form.vue'

export class BomViewer {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
    const id = this.id
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
            h(Form, {
              'ref': 'form',
              props: {
                id: id,
                closable: true,
                closeConfirmed: true
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