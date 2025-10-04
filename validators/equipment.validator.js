import { body, param } from 'express-validator'
import Equipment from '../models/equipment.model.js'

const horariRegex = /^De (dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge) a (dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge), de ([0-9]|1[0-9]|2[0-3]) a ([0-9]|1[0-9]|2[0-3]) h$/
const localitzacioRegex = /^(?:(?:CR|PL|AV|C|PZ|PS)\s+)?[\p{L}0-9][\p{L}0-9\s\-']*\s+\d+\s*(?:BLQ:\s*\d{1,4}\s*)?CP:\s*\d{5}$/iu

export const equipmentValidator = [
  body().custom((body, { req }) => {
    const allowed = Object.keys(Equipment.schema.paths)
    const extra = Object.keys(body).filter(key => !allowed.includes(key))
    if (extra.length) {
      throw new Error(`Camps extres no permesos: ${extra.join(', ')}`)
    }
    return true
  }),

  body('nom')
    .notEmpty().withMessage('El nom és obligatori')
    .isString().withMessage('El nom ha de ser una cadena'),

  body('horari')
    .optional({ nullable: true })
    .matches(horariRegex)
    .withMessage("L'horari ha de seguir el format De dilluns a divendres, de 9 a 14 h")
    .custom((value) => {
      const match = value.match(/de ([0-9]|1[0-9]|2[0-3]) a ([0-9]|1[0-9]|2[0-3]) h/)
      if (match) {
        const start = parseInt(match[1])
        const end = parseInt(match[2])
        if (start >= end)
          throw new Error("L'hora inicial ha de ser menor que la final")
      }
      return true
    }),

  body('tipus')
    .optional({ nullable: true })
    .isString().withMessage('El tipus ha de ser una cadena'),

  body('municipal')
    .optional({ nullable: true }).withMessage('Municipal és obligatori')
    .matches(/^(sí|si|no|true|false)$/i).withMessage('Municipal ha de ser un boolea')
    .customSanitizer((value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') {
        const val = value.toLowerCase().trim()
        return ['true', '1', 'si', 'sí'].includes(val)
      }
      if (typeof value === 'number') return value === 1
      return false
    }),

  body('latitud')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud invàlida, entre -90 i 90')
    .toFloat(),

  body('longitud')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud invàlida, entre -180 i 180')
    .toFloat(),

  body('localitzacio')
    .optional({ nullable: true })
    .matches(localitzacioRegex).withMessage('Format de la localització invàlid'),

  body('telefon')
    .optional({ nullable: true })
    .matches(/^\d{9}$/).withMessage('Número de telefon invàlid'),

  body('districte')
    .optional({ nullable: true })
    .isString().withMessage('El districte ha de ser una cadena'),

  body('codi_ens')
    .optional({ nullable: true })
    .matches(/^\d{10}$/).withMessage('codi_ens invàlid'),

  body('nom_ens')
    .notEmpty().withMessage('nom_ens és obligatori')
    .isString().withMessage('nom_ens ha de ser una cadena')
]

export const equipmentIdValidator = [
  param('id')
    .isUUID(4).withMessage('ID ha de ser un UUID vàlid'),
]
