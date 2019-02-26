import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {language, languageAliases} from "../../i18n";

export class DeliveryModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {
      method: 'MAIL',
      faxNumber: null,
      mail: null
    }
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  get address() {
    if (this.method == 'FAX') {
      return this.faxNumber
    } else if (this.method == 'MAIL') {
      return this.mail
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new DeliveryModel()
    }
    const response = await api.get(
        `/delivery/deliveries/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new DeliveryModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/delivery/deliveries/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/delivery/deliveries',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/delivery/deliveries/${this.id}`, this)
    }
  }

  async deliver() {
    const response = await api.post(`/delivery/deliveries/${this.id}/deliver`, {
      id: this.id,
      address: this.address,
      method: this.method
    })
    this.assign(response.data)
  }

  async validateDeliver() {
    let constraints = {
      method: {
        presence: true,
        inclusion: ['FAX', 'MAIL'],
        'function': () => {
          if (!this.address) {
            return languageAliases({
              ko: '주소가 없습니다'
            })[language]
          }
        }
      },
      faxNumber: {
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      mail: {
        email: true,
        length: {minimum: 0, maximum: 20}
      }
    }
    return await this.$validate(constraints)
  }
}