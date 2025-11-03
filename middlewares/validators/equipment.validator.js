import { body } from 'express-validator'
import Equipment from '../../models/equipment.model.js'
import { getAddressPrefixes, getLocalitzacioRegex, normalizeAddress } from '../../utils/address.utils.js'

const ADDRESS_PREFIXES = getAddressPrefixes()
const OPTIONAL_FIELD_REGEX = /^[\p{L}0-9]{1,4}$/u
const NUMBER_REGEX = /^\d+$/
const POSTAL_CODE_REGEX = /^\d{5}$/
const localitzacioRegex = getLocalitzacioRegex()

const sanitizeSegment = (value) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value.trim()
  return value.toString().trim()
}

const equipmentValidator = [
  body().custom((body, { req }) => {
    const allowed = new Set([...Object.keys(Equipment.schema.paths), 'address'])
    const extra = Object.keys(body).filter(key => !allowed.has(key))
    if (extra.length) {
      throw new Error(`Camps extres no permesos: ${extra.join(', ')}`)
    }
    return true
  }),

  body('nom')
    .notEmpty().withMessage('El nom es obligatori')
    .isString().withMessage('El nom ha de ser una cadena'),

  body('horari')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('L\'horari ha de ser una cadena'),

  body('tipus')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('El tipus ha de ser una cadena'),

  body('municipal')
    .customSanitizer((value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') {
        const val = value.toLowerCase().trim()
        if (['true', '1', 'si', 'sí'].includes(val)) return true
        if (['false', '0', 'no'].includes(val)) return false
        return null
      }
      if (typeof value === 'number') return value === 1
      return null
    }),

  body('latitud')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud invalida, entre -90 i 90')
    .toFloat(),

  body('longitud')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud invalida, entre -180 i 180')
    .toFloat(),

  body('localitzacio')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .matches(localitzacioRegex).withMessage('Format de la localitzacio invalid'),

  body('address')
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (value === null || value === undefined) {
        delete req.body.address
        return true
      }

      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('L\'adresa ha de ser un objecte')
      }

      const prefix = sanitizeSegment(value.prefix).toUpperCase()
      if (prefix && !ADDRESS_PREFIXES.includes(prefix)) {
        throw new Error('Prefix de via invalid')
      }

      const normalized = normalizeAddress({ ...value, prefix })
      if (!normalized) {
        delete req.body.address
        return true
      }

      const { street, number, block, staircase, floor, door, postalCode } = normalized

      if (!street) throw new Error('El carrer de l\'adresa es obligatori')
      if (!number) throw new Error('El numero de l\'adresa es obligatori')
      if (!postalCode) throw new Error('El codi postal de l\'adresa es obligatori')

      if (!NUMBER_REGEX.test(number)) {
        throw new Error('El numero de l\'adresa ha de ser numeric')
      }

      const optionalFields = { block, staircase, floor, door }
      for (const [field, fieldValue] of Object.entries(optionalFields)) {
        if (fieldValue && !OPTIONAL_FIELD_REGEX.test(fieldValue)) {
          throw new Error(`El camp ${field} de l'adresa es invalid`)
        }
      }

      if (!POSTAL_CODE_REGEX.test(postalCode)) {
        throw new Error('El codi postal ha de tenir 5 digits')
      }

      req.body.address = normalized
      return true
    }),

  body('telefon')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .matches(/^\d{9}$/).withMessage('Numero de telefon invalid'),

  body('districte')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('El districte ha de ser una cadena'),

  body('codi_ens')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .matches(/^\d{10}$/).withMessage('codi_ens invalid'),

  body('nom_ens')
    .notEmpty().withMessage('nom_ens es obligatori')
    .isString().withMessage('nom_ens ha de ser una cadena')
]

export default equipmentValidator

