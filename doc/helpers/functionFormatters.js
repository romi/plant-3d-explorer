export function getArgs (func) {
  let args = func.toString().match(/function\s.*?\(([^)]*)\)/)
  if (!args) return
  args = args[1]

  return args.split(',').map((d) => {
    const str = d.replace(/\/\*.*\*\//, '').trim()
    return str.split('=').map((d) => d.trim())
  }).filter((d) => {
    return d
  })
}
