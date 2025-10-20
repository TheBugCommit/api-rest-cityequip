import { param } from 'express-validator'

const mongoIdValidator = [
  param('id')
    .isUUID(4).withMessage('ID ha de ser un UUID vàlid'),
]

export default mongoIdValidator