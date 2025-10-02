const responseHandler = (req, res, next) => {
  res.sendSuccess = (data, message = 'OK', status = 200) => {
    res.status(status).json({ success: true, message, data })
  }

  next()
}

export default responseHandler