import equipmentService from "../../services/equipment.service.js";

export const updateEquipment = async (req, res, next) => {
    const id = req.params.id
    try {
        const equipment = await equipmentService.deleteEquipmentById(id)
        if (!equipment) {
            return next({
                status: 404,
                message: `Equipment { ${id} } not found`
            })
        } 

        res.sendSuccess(equipment, `Equipment { ${id} } deleted`)
    } catch (err) {
        next(err)
    }
}

export const createEquipment = async (req, res, next) => {
    const id = req.params.id
    try {
        const equipment = await equipmentService.deleteEquipmentById(id)
        if (!equipment) {
            return next({
                status: 404,
                message: `Equipment { ${id} } not found`
            })
        } 

        res.sendSuccess(equipment, `Equipment { ${id} } deleted`)
    } catch (err) {
        next(err)
    }
}

export const deleteEquipment = async (req, res, next) => {
    const id = req.params.id
    try {
        const equipment = await equipmentService.deleteEquipmentById(id)
        if (!equipment) {
            return next({
                status: 404,
                message: `Equipment { ${id} } not found`
            })
        } 

        res.sendSuccess(equipment, `Equipment { ${id} } deleted`)
    } catch (err) {
        next(err)
    }
}