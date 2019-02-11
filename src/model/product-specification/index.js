import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";
import ProductSpecificationForm
  from 'src/pages/product-specification/product-specification-form'
import Vue from 'vue'

export * from './product-specification'
export * from './product-specification-content'
export * from './product-specification-content-process'

export const ProductSpecificationStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/product-specification/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export class ProductSpecificationViewer {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const id = this.id
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
            h(ProductSpecificationForm, {
              'ref': 'form',
              props: {
                id: id,
                action: 'show',
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