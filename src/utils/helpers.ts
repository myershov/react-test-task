/**
 * Checks if the given value is empty.
 *
 * A value is considered empty if it is:
 * - `undefined`
 * - `null`
 * - an empty `array`
 * - an empty `string`
 * - an `object` with no own properties
 *
 * @template T The type of the value.
 * @param {T} value The value to check.
 * @returns {boolean} `true` if the value is empty, otherwise `false`.
 */
export const isEmpty = <T = unknown>(value: T): boolean => {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'string' && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * Checks if two values are deeply equal. Performs a deep comparison between two values to determine if they are equivalent.
 *
 * @param {any} a The first value to compare.
 * @param {any} b The second value to compare.
 * @returns {boolean} `true` if the values are deeply equal, otherwise `false`.
 */
export const isEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true
  }

  if (typeof a !== typeof b || a === null || b === null) {
    return false
  }

  if (typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false
      }
      return a.every((item, index) => isEqual(item, b[index]))
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) {
      return false
    }

    return keysA.every((key) => isEqual((a as any)[key], (b as any)[key]))
  }

  return false
}

export const toTitleCase = (text: string) => {
  return text ? text[0].toUpperCase() + text.slice(1) : ''
}
