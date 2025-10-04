import { body, param } from 'express-validator'

const horariRegex = /^De (dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge) a (dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge), de ([0-9]|1[0-9]|2[0-3]) a ([0-9]|1[0-9]|2[0-3]) h$/
const localitzacioRegex = /^(?:(?:CR|PL|AV|C|PZ|PS)\s+)?[\p{L}0-9][\p{L}0-9\s\-']*\s+\d+\s*(?:BLQ:\s*\d{1,4}\s*)?CP:\s*\d{5}$/iu

export const equipmentValidator = [
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
    .notEmpty().withMessage('El tipus és obligatori')
    .isString().withMessage('El tipus ha de ser una cadena'),
  
  body('municipal')
    .notEmpty().withMessage('Municipal és obligatori')
    .matches(/^(sí|si|no)$/i).withMessage('Municipal ha de ser Sí o No'),

  body('latitud')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud invàlida, entre -90 i 90'),

  body('longitud')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud invàlida, entre -180 i 180'),

  body('localitzacio')
    .optional()
    .matches(localitzacioRegex).withMessage('Format de la localització invàlid'),

  body('telefon')
    .optional()
    .matches(/^\d{9}$/).withMessage('Número de telefon invàlid'),

  body('districte')
    .optional()
    .isString().withMessage('El districte ha de ser una cadena'),
  
  body('codi_ens')
    .matches(/^\d{10}$/).withMessage('codi_ens invàlid'),
  
  body('nom_ens')
    .notEmpty().withMessage('nom_ens és obligatori')
    .isString().withMessage('nom_ens ha de ser una cadena')
]

export const equipmentIdValidator = [
  param('id')
    .isUUID().withMessage('ID ha de ser un UUID vàlid'),
]
