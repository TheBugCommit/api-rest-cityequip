import { v4 as uuidv4 } from "uuid"
import equipmentService from "../../services/equipment.service.js";

const getEquipmentById = async (req, res, next) => {
    const id = req.params.id

    try {
        const equipment = await equipmentService.getEquipmentById(id)
        res.sendSuccess(equipment, `Equipment { ${id} }`)
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
    req.body.uuid = uuidv4()
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
    getEquipmentById
}

export default equipmentController