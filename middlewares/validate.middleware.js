import { validationResult } from 'express-validator'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed')
    err.status = 400
    err.errors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }))
   
    return next(err)
  }
  next()
}

export default validate