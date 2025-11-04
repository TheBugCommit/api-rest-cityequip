import equipmentService from "../../services/equipment.service.js";

const getEquipments = async (req, res, next) => {
    const { type } = req.query;

    try {
        const equipments = await equipmentService.getEquipments(type ? { "tipus": type } : {})
        res.sendSuccess(equipments)
    } catch (err) {
        next(err)
    }
}

const getEquipmentById = async (req, res, next) => {
    const id = req.params.id

    try {
        const equipment = await equipmentService.getEquipmentById(id)
        res.sendSuccess(equipment)
    } catch (err) {
        next(err)
    }
}

const updateEquipment = async (req, res, next) => {
    const id = req.params.id

    try {
        const equipment = await equipmentService.updateEquipment(id, req.body)
        res.sendSuccess(equipment, `Equipment { ${id} } updated`)
    } catch (err) {
        next(err)
    }
}

const createEquipment = async (req, res, next) => {
    try {
        const equipment = await equipmentService.createEquipment(req.body)
        res.sendSuccess(equipment, `Equipment { ${equipment.uuid} } created`, 201)
    } catch (err) {
        next(err)
    }
}

const deleteEquipment = async (req, res, next) => {
    const id = req.params.id
    try {
        const equipment = await equipmentService.deleteEquipmentById(id)
        res.sendSuccess(equipment, `Equipment { ${id} } deleted`)
    } catch (err) {
        next(err)
    }
}

const equipmentController = {
    updateEquipment,
    createEquipment,
    deleteEquipment,
    getEquipmentById,
    getEquipments
}

export default equipmentController

