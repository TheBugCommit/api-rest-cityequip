import { Router } from "express";
import authMiddleware from '../../middlewares/auth.middleware.js'
import { createEquipment, deleteEquipment, updateEquipment } from "../../controllers/v1/equipment.controller.js";
import { equipmentIdValidator, equipmentValidator } from "../../validators/equipment.validator.js";
import validate from "../../middlewares/validate.middleware.js";

const router = Router()

router.get('/equipaments', (req, res) => {res.send({message: 'ok'})})
router.get('/equipaments/:id', (req, res) => {res.send({message: 'ok'})})
router.post('/equipaments', authMiddleware, equipmentValidator, validate, createEquipment)
router.put('/equipaments/:id', authMiddleware, equipmentIdValidator, equipmentValidator, validate, updateEquipment)
router.delete('/equipaments/:id', authMiddleware, equipmentIdValidator, validate, deleteEquipment)

/**
- GET /equipments → listado completo de equipamientos.
- GET /equipments/:id → detalle de un equipamiento.
- GET /equipments?type=XXXX → filtrado por tipo de equipamiento XXXX.
- POST /equipments → añadir nuevo equipamiento (solo cliente autorizado).
- PUT /equipments/:id → edición (solo cliente autorizado).
- DELETE /equipments/:id → borrado (solo cliente autorizado).
 */

export default router