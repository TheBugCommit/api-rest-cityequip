import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(' ') ?? [];

export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    cors({ origin: true })(req, res, next);
  } else {
    res.status(403).json({ error: 'Origen not authorized' });
  }
};