import {
  CollectionArray,
  FetchableArray,
  SavableArray,
  ValidatableArray
} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ProcessTypeModel} from 'src/model/process'

const processTypeSymbol = Symbol('process-type')

export class FacilityProcessTypeModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      defectiveVariationRate: 0,
      speedVariationRate: 0
    }
  }

  get processType() {
    return this[processTypeSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new FacilityProcessTypeModel()
    }
    const response = await api.get(
        `/facility/process-types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new FacilityProcessTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/facility/process-types/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/facility/process-types`, this)
      this.assign(response.data)
    } else {
      await api.put(`/facility/process-types/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      defectiveVariationRate: {
        presence: true,
        numericality: true
      },
      speedVariationRate: {
        presence: true,
        numericality: true
      },
      facilityId: {
        presence: true
      },
      processTypeId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }

  async fetchReference() {
    this[processTypeSymbol] = await ProcessTypeModel.get(this.processTypeId)
  }

}

export const FacilityProcessTypeArray = Array.decorate(
    CollectionArray,
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/facility/facilities/${facilityId}/process-types'
      }

      get axios() {
        return api
      }

      get model() {
        return FacilityProcessTypeModel
      }

      initialize(facility) {
        super.initialize()
        this.facility = facility
      }

      async fetch() {
        await super.fetch({
          facilityId: this.facility.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.facilityId = this.facility.id
      }
    }
)