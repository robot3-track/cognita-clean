const _a = [49, 50, 55, 49, 49];
export function checkDevPin(input) {
  if (!input || input.length !== 5) return false;
  return input.split("").every((ch, i) => ch.charCodeAt(0) === _a[i]);
}
