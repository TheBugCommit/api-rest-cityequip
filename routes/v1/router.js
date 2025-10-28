import { Router } from "express";
import middlewares from '../../middlewares/index.js'
import equipmentController from "../../controllers/v1/equipment.controller.js";

const router = Router()

router.get('/equipaments', (req, res) => {res.send({message: 'ok'})})
router.get('/equipaments/:id', 
    middlewares.reqValidators.idValidator,
    middlewares.validationErrorHandler, 
    equipmentController.getEquipmentById
)
router.post('/equipaments', 
    middlewares.authMiddleware, 
    middlewares.reqValidators.equipmentValidator, 
    middlewares.validationErrorHandler, 
    equipmentController.createEquipment
)
router.put('/equipaments/:id', 
    middlewares.authMiddleware, 
    middlewares.reqValidators.idValidator, 
    middlewares.reqValidators.equipmentValidator, 
    middlewares.validationErrorHandler, 
    equipmentController.updateEquipment
)
router.delete('/equipaments/:id', 
    middlewares.authMiddleware, 
    middlewares.reqValidators.idValidator, 
    middlewares.validationErrorHandler, 
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