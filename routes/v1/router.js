import { Router } from "express"
import middlewares from '../../middlewares/index.js'
import equipmentController from "../../controllers/v1/equipment.controller.js"

const router = Router()

router.get('/equipments',
    equipmentController.getEquipments
)
router.get('/equipments/:id',
    middlewares.reqValidators.idValidator,
    middlewares.validationErrorHandler,
    equipmentController.getEquipmentById
)
router.post('/equipments',
    middlewares.authMiddleware,
    middlewares.reqValidators.equipmentValidator,
    middlewares.validationErrorHandler,
    equipmentController.createEquipment
)
router.put('/equipments/:id',
    middlewares.authMiddleware,
    middlewares.reqValidators.idValidator,
    middlewares.reqValidators.equipmentValidator,
    middlewares.validationErrorHandler,
    equipmentController.updateEquipment
)
router.delete('/equipments/:id',
    middlewares.authMiddleware,
    middlewares.reqValidators.idValidator,
    middlewares.validationErrorHandler,
    equipmentController.deleteEquipment
)

/**
- GET /equipments -> llista completa d'equipaments.
- GET /equipments/:id -> detall d'un equipament.
- GET /equipments?type=XXXX -> filtrat per tipus XXXX.
- POST /equipments -> crear equipament (client autoritzat).
- PUT /equipments/:id -> edicio (client autoritzat).
- DELETE /equipments/:id -> eliminacio (client autoritzat).
*/

export default router

