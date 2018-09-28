import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'
import moment from 'moment'
import {WorkScheduleTimeArray} from './work-schedule-time'

export class WorkScheduleGenerateOptions {

  begin = new Date()

  end = moment().add(3, 'months').toDate()

}

export class WorkScheduleModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
    this.times = new WorkScheduleTimeArray(this, this.times)
  }

  get defaults() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get modifiable() {
    const diffNow = moment(this.date, 'YYYY-MM-DD').diff(moment(), 'hours')
    // 내일 부터 수정 가능
    return diffNow > 0
  }

  static async generate(options) {
    await api.post('/work-schedule/generate-work-schedules', {
      begin: moment(options.begin).format('YYYY-MM-DD'),
      end: moment(options.end).format('YYYY-MM-DD')
    })
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WorkScheduleModel()
    }
    const response = await api.get(
        `/work-schedule/work-schedules/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WorkScheduleModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/work-schedule/work-schedules/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    data.times = data.times.map(time => {
      return {
        begin: moment(time.begin).format('HH:mm:ss'),
        end: moment(time.end).format('HH:mm:ss')
      }
    })
    if (this.phantom) {
      const response = await api.post(`/work-schedule/work-schedules`, data)
      this.assign(response.data)
    } else {
      await api.put(`/work-schedule/work-schedules/${this.id}`, data)
    }
  }

  async validate() {
    let constraints = {
      date: {
        presence: true
      },
      categoryId: {
        presence: true
      },
      holiday: {
        presence: true
      },
      begin: {},
      end: {},
      name: {},
      id: {
        presence: true
      }
    }
    return ![
      await this.$validate(constraints),
      await this.times.validate()
    ].includes(false)
  }

}

export const WorkScheduleArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/work-schedule/work-schedules?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return WorkScheduleModel
      }

      async fetch(categoryId, begin, end) {
        return await super.fetch({
          categoryId: categoryId,
          begin: begin,
          end: end
        })
      }
    }
)