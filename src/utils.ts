export const round = (n: number, p: number = 2) =>
  ((e) => Math.round(n * e) / e)(Math.pow(10, p))
