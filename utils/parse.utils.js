export function cleanString(str) {
  if (!str) return null
  return str
    .trim()
    .replace(/\s+/g, " ")
}

export function capitalizeWords(str) {
  if (!str) return null
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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


export function normalizeEquipment(doc) {
  for (const key of Object.keys(doc)) {
    const value = doc[key]
    if (typeof value === 'string') {
      doc[key] = cleanString(value)
    }
  }

  if (doc.tipus) doc.tipus = capitalizeWords(doc.tipus.toLowerCase())
  if (doc.nom_ens) doc.nom_ens = capitalizeWords(doc.nom_ens.toLowerCase())
  if (doc.districte) doc.districte = capitalizeWords(doc.districte.toLowerCase())
  if (doc.localitzacio) doc.localitzacio = doc.localitzacio.toUpperCase()
  if (doc.latitud) doc.latitud = parseFloatSafe(doc.latitud)
  if (doc.longitud) doc.longitud = parseFloatSafe(doc.longitud)
}
