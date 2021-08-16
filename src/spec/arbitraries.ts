import fc from 'fast-check';

export function subsequentSubarray(arr: string[]) {
  return fc.tuple(fc.nat(arr.length), fc.nat(arr.length))
  .map(([a, b]) => a < b ? [a, b] : [b, a])
  .map(([from, to]) => arr.slice(from, to));
}

export function nonEmptySubsequentSubarray(nonEmptyArray: string[]) {
  return fc.tuple(fc.nat(nonEmptyArray.length), fc.nat(nonEmptyArray.length))
  .map(([a, b]) => a < b ? [a, b + 1] : [b, a + 1])
  .map(([from, to]) => nonEmptyArray.slice(from, to));
}

export function list() {
  return fc.set(fc.string())
}
