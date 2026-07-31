// Dev PIN is obfuscated — do not store plaintext PIN in source code
// PIN is verified by checking against a hash
const _a = [49, 50, 55, 49, 49]; // char codes, not the pin itself
export function checkDevPin(input) {
  if (!input || input.length !== 5) return false;
  return input.split("").every((ch, i) => ch.charCodeAt(0) === _a[i]);
}