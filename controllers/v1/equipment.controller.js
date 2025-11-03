import { v4 as uuidv4 } from "uuid"
import equipmentService from "../../services/equipment.service.js";
import { buildLocalitzacio, normalizeAddress, parseLocalitzacio } from "../../utils/address.utils.js"

const toPlainEquipment = (equipment) => {
    if (!equipment) return equipment
    if (typeof equipment.toObject === 'function') {
        return equipment.toObject({ depopulate: true, versionKey: false })
    }
    return { ...equipment }
}

const ensureAddressForResponse = (equipment) => {
    if (!equipment) return equipment

    const plain = toPlainEquipment(equipment)
    const normalizedAddress = normalizeAddress(plain.address)

    if (normalizedAddress) {
        plain.address = normalizedAddress
        const composed = buildLocalitzacio(normalizedAddress)
        if (composed) plain.localitzacio = composed
    } else if (plain.localitzacio) {
        const parsed = parseLocalitzacio(plain.localitzacio)
        if (parsed) {
            plain.address = parsed
        } else {
            delete plain.address
        }
    } else {
        delete plain.address
    }

    return plain
}

const ensureAddressForResponseCollection = (equipments) => {
    if (!equipments) return equipments
    return equipments.map(ensureAddressForResponse)
}

const prepareEquipmentPayload = (body) => {
    const payload = { ...body }

    if (body.address) {
        const normalized = normalizeAddress(body.address)
        if (normalized) {
            payload.address = normalized
            const composed = buildLocalitzacio(normalized)
            if (composed) {
                payload.localitzacio = composed
            }
        } else {
            delete payload.address
        }
    } else if (payload.localitzacio) {
        const parsed = parseLocalitzacio(payload.localitzacio)
        if (parsed) {
            payload.address = parsed
        }
    }

    return payload
}

const getEquipments = async (req, res, next) => {
    const { type } = req.query;

    try {
        const equipments = await equipmentService.getEquipments(type ? { "tipus": type } : {})
        res.sendSuccess(ensureAddressForResponseCollection(equipments))
    } catch (err) {
        next(err)
    }
}

const getEquipmentById = async (req, res, next) => {
    const id = req.params.id

    try {
        const equipment = await equipmentService.getEquipmentById(id)
        res.sendSuccess(ensureAddressForResponse(equipment))
    } catch (err) {
        next(err)
    }
}

const updateEquipment = async (req, res, next) => {
    const id = req.params.id

    try {
        const equipment = await equipmentService.updateEquipment(id, prepareEquipmentPayload(req.body))
        res.sendSuccess(ensureAddressForResponse(equipment), `Equipment { ${id} } updated`)
    } catch (err) {
        next(err)
    }
}

const createEquipment = async (req, res, next) => {
    const payload = prepareEquipmentPayload(req.body)
    payload.uuid = uuidv4()
    try {
        const equipment = await equipmentService.createEquipment(payload)
        res.sendSuccess(ensureAddressForResponse(equipment), `Equipment { ${equipment.uuid} } created`, 201)
    } catch (err) {
        next(err)
    }
}

const deleteEquipment = async (req, res, next) => {
    const id = req.params.id
    try {
        const equipment = await equipmentService.deleteEquipmentById(id)
        res.sendSuccess(ensureAddressForResponse(equipment), `Equipment { ${id} } deleted`)
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

