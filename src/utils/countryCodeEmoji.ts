export function countryCodeToEmoji(code: string): string {
  // Ensure the code is uppercase and valid length
  if (!code || code.length !== 2) {
    return '❓' // Return a question mark emoji for invalid codes
  }

  // Convert A-Z to regional indicator symbols
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join('')
}
