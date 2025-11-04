import { body } from 'express-validator'
import Equipment from '../../models/equipment.model.js'

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
    .trim().notEmpty().withMessage('El nom és obligatori')
    .isString().withMessage('El nom ha de ser una cadena'),

  body('horari')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('L\'horari ha de ser una cadena'),

  body('tipus')
    .trim().notEmpty().withMessage('El tipus és obligatori')
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
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud invàlida, entre -90 i 90')
    .toFloat(),

  body('longitud')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud invàlida, entre -180 i 180')
    .toFloat(),

  body('localitzacio')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('La localització ha de ser una cadena'),

  body('telefon')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .matches(/^\d{9}$/).withMessage('Número de telefon invàlid'),

  body('districte')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .isString().withMessage('El districte ha de ser una cadena'),

  body('codi_ens')
    .customSanitizer(value => value === '' ? null : value)
    .optional({ nullable: true })
    .matches(/^\d{10}$/).withMessage('codi_ens invàlid'),

  body('nom_ens')
    .trim().notEmpty().withMessage('nom_ens és obligatori')
    .isString().withMessage('nom_ens ha de ser una cadena'),
]

export default equipmentValidator