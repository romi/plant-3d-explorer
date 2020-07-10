export function getArgs (func) {
  let fnstr = func.toString()
  let args = fnstr.match(/function\s.*?\(([^)]*)\)/)
  if (!args) return
  args = args[1]

  const comm = fnstr.substring(
    fnstr.lastIndexOf('/**'),
    fnstr.lastIndexOf('*/')
  )
  const res = args.split(',').map((d) => {
    const str = d.replace(/\/\*.*\*\//, '').trim()
    return str.split('=').map((d) => d.trim())
  }).filter((d) => {
    return d
  }).map((d) => {
    const identifier = '- ' + d[0] + ': '
    const start = comm.indexOf(identifier) + identifier.length
    const descEnd = comm.indexOf('- ', start + 1)
    const end = comm.lastIndexOf('.', descEnd !== -1 ? descEnd : +Infinity) + 1
    if (start !== identifier.length - 1) {
      d[2] = comm.substring(
        start,
        end
      )
    }
    return d
  })
  const descEnd = comm.indexOf('- ')
  const desc = comm.substring(
    3, comm.lastIndexOf('.', descEnd !== -1 ? descEnd : +Infinity) + 1
  )
  return { desc: desc, args: res }
}
