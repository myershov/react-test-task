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
