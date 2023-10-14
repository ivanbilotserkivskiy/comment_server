export function isValidString(
  val: string,
  required: boolean,
  maxLength: number | null = null,
): boolean {
  const tmp = val || null;
  if (required) {
    return (
      typeof tmp === 'string' &&
      !!tmp &&
      (maxLength === null || tmp.length <= maxLength)
    );
  } else {
    return tmp === null || isValidString(val, true, maxLength);
  }
}
