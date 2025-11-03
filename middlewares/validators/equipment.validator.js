import { body } from 'express-validator'
import Equipment from '../../models/equipment.model.js'
import {
  getAddressPrefixes,
  normalizeAddress,
  parseLocalitzacio,
  isValidAddressNumber,
  isValidOptionalAddressField
} from '../../utils/address.utils.js'

const ADDRESS_PREFIXES = getAddressPrefixes()
const POSTAL_CODE_REGEX = /^\d{5}$/

const sanitizeSegment = (value) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value.trim()
  return value.toString().trim()
}

const equipmentValidator = [
  body().custom((body, { req }) => {
    const allowed = new Set([...Object.keys(Equipment.schema.paths), 'address'])
    const extra = Object.keys(body).filter((key) => !allowed.has(key))
    if (extra.length) {
      throw new Error(`Camps extres no permesos: ${extra.join(', ')}`)
    }
    return true
  }),

  body('nom')
    .notEmpty().withMessage('El nom es obligatori')
    .isString().withMessage('El nom ha de ser una cadena'),

  body('horari')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .isString().withMessage("L'horari ha de ser una cadena"),

  body('tipus')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .isString().withMessage('El tipus ha de ser una cadena'),

  body('municipal')
    .customSanitizer((value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'number') return value === 1
      if (typeof value === 'string') {
        const raw = value.trim().toLowerCase()
        const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (['true', '1', 'si', 's', 'yes', 'y'].includes(normalized)) return true
        if (['false', '0', 'no', 'n'].includes(normalized)) return false
        return null
      }
      return null
    }),

  body('latitud')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud invalida, entre -90 i 90')
    .toFloat(),

  body('longitud')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud invalida, entre -180 i 180')
    .toFloat(),

  body('localitzacio')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .custom((value) => {
      if (!value) return true
      if (!parseLocalitzacio(value)) {
        throw new Error('Format de la localitzacio invalid')
      }
      return true
    }),

  body('address')
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (value === null || value === undefined || value === '') {
        delete req.body.address
        return true
      }

      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error("L'adreça ha de ser un objecte")
      }

      const prefix = sanitizeSegment(value.prefix).toUpperCase()
      const data = {
        prefix,
        street: sanitizeSegment(value.street),
        number: sanitizeSegment(value.number),
        block: sanitizeSegment(value.block),
        staircase: sanitizeSegment(value.staircase),
        floor: sanitizeSegment(value.floor),
        door: sanitizeSegment(value.door),
        postalCode: sanitizeSegment(value.postalCode)
      }

      const normalized = normalizeAddress(data)
      if (!normalized) {
        delete req.body.address
        return true
      }

      if (normalized.prefix && !ADDRESS_PREFIXES.includes(normalized.prefix)) {
        throw new Error('Prefix de via invalid')
      }

      if (!normalized.street) {
        throw new Error("El carrer de l'adreça es obligatori")
      }

      if (!normalized.postalCode) {
        throw new Error("El codi postal de l'adreça es obligatori")
      }

      if (!POSTAL_CODE_REGEX.test(normalized.postalCode)) {
        throw new Error('El codi postal ha de tenir 5 digits')
      }

      if (normalized.number && !isValidAddressNumber(normalized.number)) {
        throw new Error("El numero de l'adreça te un format invalid")
      }

      const optionalFields = {
        block: normalized.block,
        staircase: normalized.staircase,
        floor: normalized.floor,
        door: normalized.door
      }

      for (const [field, fieldValue] of Object.entries(optionalFields)) {
        if (fieldValue && !isValidOptionalAddressField(fieldValue)) {
          throw new Error(`El camp ${field} de l'adreça te un format invalid`)
        }
      }

      req.body.address = normalized
      return true
    }),

  body('telefon')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .matches(/^\d{9}$/).withMessage('Numero de telefon invalid'),

  body('districte')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .isString().withMessage('El districte ha de ser una cadena'),

  body('codi_ens')
    .customSanitizer((value) => (value === '' ? null : value))
    .optional({ nullable: true })
    .matches(/^\d{10}$/).withMessage('codi_ens invalid'),

  body('nom_ens')
    .notEmpty().withMessage('nom_ens es obligatori')
    .isString().withMessage('nom_ens ha de ser una cadena')
]

export default equipmentValidator

