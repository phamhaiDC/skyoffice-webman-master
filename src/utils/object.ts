export const getDirtyFields = (
  data: any,
  dirtyFields: { [key: string]: any }
) =>
  Object.entries(data).reduce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (pre, [key, _]) =>
      dirtyFields[key]
        ? {
            ...pre,
            [key]: data[key],
          }
        : pre,
    {}
  )
