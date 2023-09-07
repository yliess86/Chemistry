export const insert = <T>(array: T[], element: T, idx?: number) => {
  const _idx = idx ?? array.length
  return [...array.slice(0, _idx), element, ...array.slice(_idx)]
}