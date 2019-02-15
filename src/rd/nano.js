import { createElement } from 'react'
import { create } from 'nano-css'
import { addon as addonCache } from 'nano-css/addon/cache'
import { addon as addonStable } from 'nano-css/addon/stable'
import { addon as addonNesting } from 'nano-css/addon/nesting'
import { addon as addonAtoms } from 'nano-css/addon/atoms'
import { addon as addonKeyframes } from 'nano-css/addon/keyframes'
import { addon as addonRule } from 'nano-css/addon/rule'
import { addon as addonSheet } from 'nano-css/addon/sheet'
import { addon as addonJsx } from 'nano-css/addon/jsx'
import { addon as addonGlobal } from 'nano-css/addon/global'
import { addon as addonStylis } from 'nano-css/addon/stylis'

const nano = create({
  // Add prefix to all generated class names.
  pfx: 'redoute-',
  // Set hyperscript function of your virtual DOM library, for jsx() addon.
  h: createElement
})

// Add addons you would like to use.
addonCache(nano)
addonStable(nano)
addonNesting(nano)
addonAtoms(nano)
addonKeyframes(nano)
addonRule(nano)
addonSheet(nano)
addonJsx(nano)
addonGlobal(nano)
addonStylis(nano)

const { rule, sheet, jsx, keyframes, global } = nano

// Export everything.
export {
  nano,
  rule,
  sheet,
  jsx,
  keyframes,
  global
}
