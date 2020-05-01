export const compare = (a, b) => {
  const A = a.id;
  const B = b.id;

  let comparison = 0;
  if (A >= B) {
    comparison = 1;
  } else if (A <= B) {
    comparison = -1;
  }
  return comparison;
}
