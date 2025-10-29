import { body } from 'express-validator'
import Equipment from '../../models/equipment.model.js'

const localitzacioRegex = /^(?:(?:CR|PL|AV|C|PZ|PS)\s+)?[\p{L}0-9][\p{L}0-9\s\-']*\s+\d+\s*(?:BLQ:\s*\d{1,4}\s*)?CP:\s*\d{5}$/iu

const equipmentValidator = [
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
    .isString().withMessage('L\'horari ha de ser una cadena'),

  body('tipus')
    .optional({ nullable: true })
    .isString().withMessage('El tipus ha de ser una cadena'),

  body('municipal')
    .optional({ nullable: true })
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

export default equipmentValidator