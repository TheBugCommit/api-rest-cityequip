const authMiddleware = (req, res, next) => {
  const key = req.header('x-api-key')
  if (key !== process.env.API_KEY)
    return res.status(403).json({ error: 'Not authorized' })
  next()
}

export default authMiddleware