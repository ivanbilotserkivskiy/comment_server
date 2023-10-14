export function isValidInt(val, required: boolean = true) {
  if (required) {
    return Number.isInteger(val);
  } else {
    return val === null || isValidInt(val);
  }
}
