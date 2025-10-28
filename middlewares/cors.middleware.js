import cors from 'cors'

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(' ') ?? []
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS block'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

export default cors(corsOptions)