//pass array, callbackfn for unique attributes
const removeDuplicates = <T>(
  arr: T[],
  callbackfn: (item: T) => (string | undefined)[]
) => {
  const dict: { [k: string]: T } = {};

  return Object.values(
    arr.reduce((p, c) => {
      p[callbackfn(c).join()] = c;

      return p;
    }, dict)
  );
};

const seasonWeight = (season?: string) => {
  switch (season) {
    case "Spring":
      return 0;
    case "Summer":
      return 1;
    case "Fall":
      return 2;
    case "Winter":
    case "Winter Mini":
      return 4;
    default:
      return 999;
  }
};

export { removeDuplicates, seasonWeight };
export default { removeDuplicates, seasonWeight };
