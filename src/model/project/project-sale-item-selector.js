import Vue from 'vue'
import Selector from 'src/pages/project/project-sale-item-selector.vue'

export class ProjectSaleItemSelector {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
    const projectId = this.projectId
    const multiple = !!this.multiple
    return new Promise(async (resolve, reject) => {
      const node = document.createElement('div')
      document.body.appendChild(node)
      const finish = (models) => {
        resolve(models)
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
            h(Selector, {
              props: {
                projectId: projectId,
                multiple: multiple
              },
              on: {
                selected: (models) => finish(models)
              }
            })
          ])
        }
      })
    })

  }

}