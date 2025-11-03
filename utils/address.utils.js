const ADDRESS_PREFIXES = ['CR', 'PL', 'AV', 'C', 'PZ', 'PS']

const LOCALITZACIO_REGEX = /^(?:(CR|PL|AV|C|PZ|PS)\s+)?([\p{L}0-9][\p{L}0-9\s\-']*)\s+(\d+)\s*(?:BLQ:\s*([\p{L}0-9]{1,4})\s*)?(?:ESC:\s*([\p{L}0-9]{1,4})\s*)?(?:PLNT:\s*([\p{L}0-9]{1,4})\s*)?(?:PRT:\s*([\p{L}0-9]{1,4})\s*)?CP:\s*(\d{5})$/iu

const sanitizeSegment = (value) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value.trim()
  return value.toString().trim()
}

const dropEmptyStrings = (address) => {
  Object.entries(address).forEach(([key, value]) => {
    if (value === '') {
      address[key] = undefined
    }
  })
  return address
}

export const normalizeAddress = (rawAddress) => {
  if (!rawAddress || typeof rawAddress !== 'object') return null

  const normalized = {
    prefix: sanitizeSegment(rawAddress.prefix).toUpperCase(),
    street: sanitizeSegment(rawAddress.street),
    number: sanitizeSegment(rawAddress.number),
    block: sanitizeSegment(rawAddress.block),
    staircase: sanitizeSegment(rawAddress.staircase),
    floor: sanitizeSegment(rawAddress.floor),
    door: sanitizeSegment(rawAddress.door),
    postalCode: sanitizeSegment(rawAddress.postalCode)
  }

  if (!ADDRESS_PREFIXES.includes(normalized.prefix)) {
    normalized.prefix = undefined
  }

  dropEmptyStrings(normalized)

  const hasAnyValue = Object.values(normalized).some(Boolean)
  if (!hasAnyValue) return null

  return normalized
}

export const buildLocalitzacio = (address) => {
  const normalized = normalizeAddress(address)
  if (!normalized) return null

  const { prefix, street, number, block, staircase, floor, door, postalCode } = normalized
  if (!street || !number || !postalCode) return null

  const segments = []
  if (prefix) segments.push(prefix)
  segments.push(street)
  segments.push(number)

  let localitzacio = segments.join(' ')

  if (block) localitzacio += ` BLQ: ${block}`
  if (staircase) localitzacio += ` ESC: ${staircase}`
  if (floor) localitzacio += ` PLNT: ${floor}`
  if (door) localitzacio += ` PRT: ${door}`
  localitzacio += ` CP: ${postalCode}`

  return localitzacio
}

export const parseLocalitzacio = (localitzacio) => {
  if (!localitzacio || typeof localitzacio !== 'string') return null

  const match = localitzacio.trim().match(LOCALITZACIO_REGEX)
  if (!match) return null

  const [
    ,
    prefix,
    street,
    number,
    block,
    staircase,
    floor,
    door,
    postalCode
  ] = match

  return normalizeAddress({
    prefix,
    street,
    number,
    block,
    staircase,
    floor,
    door,
    postalCode
  })
}

export const getAddressPrefixes = () => [...ADDRESS_PREFIXES]

export const getLocalitzacioRegex = () => LOCALITZACIO_REGEX

