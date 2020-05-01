export function obsKeysToString(o, glue, sep) {
  let object = o;

  if (glue == undefined)
    glue = ': ';

  if (sep == undefined)
    sep = ',';

  return Object.getOwnPropertyNames(object).map(function(k) { return [k, object[k]].join(glue) }).join(sep);
}

