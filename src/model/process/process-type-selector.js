import Vue from 'vue'
import Selector from 'src/pages/process/process-type-selector.vue'

export class ProcessTypeSelector {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
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