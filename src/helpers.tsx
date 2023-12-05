
export const getRangeArr = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => i + 1)

export const getRangeArrWithLen = (len: number) => Array.from({ length: len }, (_, i) => i + 1)
