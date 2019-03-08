import Vue from 'vue'
import Viewer from 'src/pages/audit/audit-viewer.vue'

export class CompanyContactSelector {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
    const url = this.url
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
            this.$refs.viewer.load()
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
            h(Viewer, {
              'ref': 'viewer',
              props: {
                url: url
              }
            })
          ])
        }
      })
    })

  }

}