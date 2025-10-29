import createError from './error.utils.js'

const handleMongooseError = (err, context = 'Database operation failed') => {
  if (err.status) return err;
  
  if (err.name === 'ValidationError') {
    return createError(`Validation failed: ${err.message}`, 400, err)
  }

  if (err.name === 'CastError') {
    return createError(`Invalid value for field "${err.path}"`, 400, err)
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return createError(
      `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 409, err)
  }

  return createError(`${context}: ${err.message}`, err?.status || 500, err)
}

export default handleMongooseError