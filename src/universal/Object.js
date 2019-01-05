// @flow strict

export const fromEntries = /*::<k, v>*/ (
  entries /*:Iterable<[k, v]>*/
) /*:{[k]:v}*/ => {
  const object /*:{[k]:v}*/ = {}
  for (const [key, value] of entries) {
    object[key] = value
  }
  return object
}
