import { Router } from "express";
import middlewares from '../../middlewares/index.js'
import equipmentController from "../../controllers/v1/equipment.controller.js";
import { equipmentIdValidator, equipmentValidator } from "../../validators/equipment.validator.js";

const router = Router()

router.get('/equipaments', (req, res) => {res.send({message: 'ok'})})
router.get('/equipaments/:id', (req, res) => {res.send({message: 'ok'})})
router.post('/equipaments', 
    middlewares.authMiddleware, 
    equipmentValidator, 
    middlewares.validateRequest, 
    equipmentController.createEquipment
)
router.put('/equipaments/:id', 
    middlewares.authMiddleware, 
    equipmentIdValidator, 
    equipmentValidator, 
    middlewares.validateRequest, 
    equipmentController.updateEquipment
)
router.delete('/equipaments/:id', 
    middlewares.authMiddleware, 
    equipmentIdValidator, 
    middlewares.validateRequest, 
    equipmentController.deleteEquipment
)

/**
- GET /equipments → listado completo de equipamientos.
- GET /equipments/:id → detalle de un equipamiento.
- GET /equipments?type=XXXX → filtrado por tipo de equipamiento XXXX.
- POST /equipments → añadir nuevo equipamiento (solo cliente autorizado).
- PUT /equipments/:id → edición (solo cliente autorizado).
- DELETE /equipments/:id → borrado (solo cliente autorizado).
 */

export default router