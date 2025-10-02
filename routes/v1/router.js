import { Router } from "express";
import { checkApiKey } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/equipaments', (req, res) => {res.send({message: 'ok'})})
router.get('/equipaments/:id', (req, res) => {res.send({message: 'ok'})})
router.post('/equipaments', checkApiKey, (req, res) => {res.send({message: 'ok'})})
router.put('/equipaments/:id', checkApiKey, (req, res) => {res.send({message: 'ok'})})
router.delete('/equipaments/:id', checkApiKey, (req, res) => {res.send({message: 'ok'})})

/**
 * GET /equipments → listado completo de equipamientos.
- GET /equipments/:id → detalle de un equipamiento.
- GET /equipments?type=XXXX → filtrado por tipo de equipamiento XXXX.
- POST /equipments → añadir nuevo equipamiento (solo cliente autorizado).
- PUT /equipments/:id → edición (solo cliente autorizado).
- DELETE /equipments/:id → borrado (solo cliente autorizado).
 */

export default router