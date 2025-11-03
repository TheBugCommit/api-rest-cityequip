const ADDRESS_PREFIXES = [
  'RB',
  'CR',
  'AV',
  'PG',
  'PL',
  'CM',
  'AC',
  'CT',
  'PE',
  'ML',
  'CL',
  'BL',
  'PR',
  'PJ',
  'DM',
  'C',
  'PZ',
  'PS'
]

const ADDRESS_LABELS = ['BLQ', 'ESC', 'PLNT', 'PRT']

const ADDRESS_PREFIXES_SORTED = ADDRESS_PREFIXES.slice().sort((a, b) => b.length - a.length)

const NUMBER_REGEX = /^(?:S\/N|\d+(?:[-/]\d+)?(?:\s*[A-Za-z0-9]+)*)$/i

const OPTIONAL_FIELD_REGEX = /^[\p{L}0-9\-][\p{L}0-9\-\s\/\.]{0,29}$/u

const OPTIONAL_LABEL_CAPTURE = new RegExp(
  `\\b(${ADDRESS_LABELS.join('|')}):\\s*([^]*?)(?=\\b(?:${ADDRESS_LABELS.join('|')}|CP):|$)`,
  'gi'
)

const ADDRESS_PREFIX_PATTERN = ADDRESS_PREFIXES_SORTED.join('|')

const OPTIONAL_SEGMENT_PATTERN = `[\\p{L}0-9\\-\\/\\s\\.]{1,30}`

const NUMBER_SEGMENT_PATTERN = `(?:S\\/N|\\d+(?:[-/]\\d+)?(?:\\s*[A-Za-z0-9]+)*)`

const LOCALITZACIO_REGEX = new RegExp(
  `^(?:(?:(${ADDRESS_PREFIX_PATTERN}))\\s+)?([\\p{L}0-9][\\p{L}0-9\\s\\-']*)(?:\\s+${NUMBER_SEGMENT_PATTERN})?` +
    `(\\s+(?:BLQ|ESC|PLNT|PRT):\\s*${OPTIONAL_SEGMENT_PATTERN})*` +
    `(?:\\s*CP:\\s*\\d{5})?$`,
  'iu'
)

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

  if (normalized.number) {
    normalized.number = normalized.number.toUpperCase().replace(/\s+/g, ' ').trim()
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
  if (!street || !postalCode) return null

  const segments = []
  if (prefix) segments.push(prefix)
  segments.push(street)
  if (number) segments.push(number)

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

  const original = localitzacio.trim()
  if (!original) return null

  let working = original

  let postalCode
  const cpMatch = working.match(/\bCP:\s*(\d{5})\b/i)
  if (cpMatch) {
    postalCode = cpMatch[1]
    working = (working.slice(0, cpMatch.index) + working.slice(cpMatch.index + cpMatch[0].length)).trim()
  }

  const labelValues = {}
  working = working.replace(OPTIONAL_LABEL_CAPTURE, (_, label, value) => {
    const clean = sanitizeSegment(value)
    if (clean) labelValues[label.toLowerCase()] = clean
    return ' '
  })

  working = working.replace(/\s+/g, ' ').trim()

  let prefix
  for (const candidate of ADDRESS_PREFIXES_SORTED) {
    if (working.toUpperCase().startsWith(`${candidate} `)) {
      prefix = candidate
      working = working.slice(candidate.length).trim()
      break
    }
  }

  let street = working
  let number = null
  const numberMatch = working.match(/^(.*\S)\s+((?:\d+(?:[-/]\d+)?(?:\s*[A-Za-z0-9]+)*)|S\/N)$/i)
  if (numberMatch) {
    street = numberMatch[1].trim()
    number = numberMatch[2].toUpperCase().replace(/\s+/g, ' ')
  }

  if (!street) street = null

  const normalized = normalizeAddress({
    prefix,
    street,
    number,
    block: labelValues.blq,
    staircase: labelValues.esc,
    floor: labelValues.plnt,
    door: labelValues.prt,
    postalCode
  })

  return normalized
}

export const getAddressPrefixes = () => [...ADDRESS_PREFIXES]

export const getLocalitzacioRegex = () => LOCALITZACIO_REGEX

export const isKnownPrefix = (prefix) => {
  if (!prefix) return false
  return ADDRESS_PREFIXES.includes(prefix.toUpperCase())
}

export const isValidAddressNumber = (value) => {
  if (!value) return false
  return NUMBER_REGEX.test(value)
}

export const isValidOptionalAddressField = (value) => {
  if (!value) return false
  return OPTIONAL_FIELD_REGEX.test(value)
}

export const ADDRESS_NUMBER_REGEX = NUMBER_REGEX
export const ADDRESS_OPTIONAL_FIELD_REGEX = OPTIONAL_FIELD_REGEX
