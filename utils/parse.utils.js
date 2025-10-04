export function cleanString(str) {
  if (!str) return null
  return str
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s\.,:@()\/'-]/gu, "")
    .normalize("NFC")
}

export function toBoolean(str) {
  if (!str) return null
  const val = cleanString(str).toLowerCase()
  if (["sí", "si", "true", "1"].includes(val)) return true
  if (["no", "false", "0"].includes(val)) return false
  return null
}

export function parseFloatSafe(str) {
  if (!str) return null
  const num = parseFloat(str.toString().replace(",", "."))
  return isNaN(num) ? null : num
}
