export function sortEventsByDateTime(a,b) {
  const A = a.date;
  const B = b.date;

  let comparison = 0;
  if (A >= B) {
    comparison = -1;
  } else if (A <= B) {
    comparison = 1;
  }
  return comparison;
}
