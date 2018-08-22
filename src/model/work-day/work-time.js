import {Model} from 'src/model/model'
import {CollectionArray, ValidatableArray} from 'src/model/array'
import moment from 'moment'
import {language, languageAliases} from 'src/i18n'

const timeProperties = ['begin', 'end']

export class WorkTimeModel extends Model {

  constructor(data) {
    super(data)
    timeProperties.forEach(timeProperty => {
      const date = this[timeProperty]
      if (date) {
        this[timeProperty] = moment(date, 'HH:mm:ss').toDate()
      }
    })
  }

  get defaults() {
    return {}
  }

  async validate() {
    let constraints = {
      begin: {
        presence: true,
        datetime: {
          latest: this.end,
          format: (date) => moment(date).format('HH:mm')
        },
        'function': () => {
          const errors = []
          const diff = moment(this.begin).diff(moment(this.end), 'hours')
          if (diff > -1) {
            const error = languageAliases({
              ko: '1 시간 이상 간격이 필요합니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      },
      end: {
        presence: true,
        datetime: {
          earliest: this.begin,
          format: (date) => moment(date).format('HH:mm')
        },
        'function': () => {
          const errors = []
          const diff = moment(this.begin).diff(moment(this.end), 'hours')
          if (diff > -1) {
            const error = languageAliases({
              ko: '1 시간 이상 간격이 필요합니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }
    return await this.$validate(constraints)
  }

}

export const WorkTimeArray = Array.decorate(
    CollectionArray,
    class extends ValidatableArray {
      initialize(workDay, times) {
        super.initialize()
        this.workDay = workDay
        if (times) {
          const models = times.map(o => new WorkTimeModel(o))
          this.splice.apply(this, [0, this.length].concat(models))
        }
      }
    }
)