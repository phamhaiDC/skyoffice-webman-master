export const filterDuplicateItems = (arr: any[], key: string) =>
  arr.filter(
    (value, index, self) =>
      index === self.findIndex(_val => _val[key] === value[key])
  )

export const up = (arr: any[], index: number) => {
  const head = arr.slice(0, index - 1)
  const tail = arr.slice(index + 1)
  return [...head, arr[index], arr[index - 1], ...tail]
}

export const down = (arr: any[], index: number) => {
  const head = arr.slice(0, index)
  const tail = arr.slice(index + 2)
  return [...head, arr[index + 1], arr[index], ...tail]
}
