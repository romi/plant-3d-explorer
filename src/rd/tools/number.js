import { formatLocale } from 'd3'

const formatConfig = {
  'decimal': '.',
  'thousands': ' ',
  'grouping': [3],
  'currency': ['$', ''],
  'dateTime': '%a %b %e %X %Y',
  'date': '%m/%d/%Y',
  'time': '%H:%M:%S',
  'periods': ['AM', 'PM'],
  'days': ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  'shortDays': ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}

const { format } = formatLocale(formatConfig)

const defaultConfig = {
  precision: 1,
  cleanZero: true
}

export default function FormatNumber (value = 0, conf = {}) {
  const { precision, cleanZero } = { ...defaultConfig, ...conf }
  let result = format(`.${precision}f`)(value)
  if (cleanZero) result = removeZero(result)
  result = thousandsSpace(result)
  return result
}

function removeZero (value) {
  let [before, after] = value.split(formatConfig.decimal)
  let prevIsZero = true
  let afterResult = []
  if (after) {
    for (let i = after.length - 1; i >= 0; i--) {
      if (after[i] === '0' && prevIsZero) {
        prevIsZero = true
      } else {
        afterResult.unshift(after[i])
        prevIsZero = false
      }
    }
  }

  return JoinBeforeAfter(
    before,
    afterResult.join('')
  )
}

function thousandsSpace (value) {
  let [before, after] = value.split(formatConfig.decimal)

  return JoinBeforeAfter(
    before.replace(/\B(?=(\d{3})+(?!\d))/g, formatConfig.thousands),
    after
  )
}

function JoinBeforeAfter (before, after) {
  return after && after.length
    ? [before, after].join(formatConfig.decimal)
    : before
}
