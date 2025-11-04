import Equipment from "../models/equipment.model.js"
import createError from "../utils/error.utils.js"
import handleMongooseError from "../utils/handleMongooseError.utils.js"

const insertManyEquipments = async (data) => {    
    try {
        if (!Array.isArray(data) || data.length === 0)
            throw createError("No data to insert", 400)

        return await Equipment.insertMany(data, { validateBeforeSave: true })
    } catch (err) {
        throw handleMongooseError(err, 'Error inserting many equipments')
    }
}

const deleteManyEquipments = async (filter) => {    
    try {
        if (!(typeof filter === 'object' && filter !== null && !Array.isArray(filter)))
            throw createError("No filter passed", 400)

        await Equipment.deleteMany(filter)
    } catch (err) {
        throw handleMongooseError(err, 'Error deleting many equipments')
    }
}

const getEquipments = async (filter) => {
    try {
        return await Equipment.find(filter).collation({ locale: 'ca', strength: 2 });
    } catch (err) {
        throw handleMongooseError(err, `Error finding equipments with filter: ${filter}`)
    }
}


const getEquipmentById = async (id) => {
    try {
        if (id == null) throw createError("No ID passed", 400)

        return await Equipment.findOne({ uuid: id })
    } catch (err) {
        throw handleMongooseError(err, 'Error finding an equipment')
    }
}

const deleteEquipmentById = async (id) => {
    try {
        if (id == null) throw createError("No ID passed", 400)

        const deleted = await Equipment.findOneAndDelete({ uuid: id })
        if (!deleted) throw createError(`Equipment { ${id} } not found`, 404)
        return deleted
    } catch (err) {
        throw handleMongooseError(err, 'Error deleting equipment')
    }
}

const createEquipment = async (data) => {
    try {
        if (!(typeof data === 'object' && data !== null && !Array.isArray(data)))
            throw createError("No data passed", 400)

        const equipment = new Equipment(data)
        return await equipment.save()
    } catch (err) {
        throw handleMongooseError(err, 'Error creating equipment')
    }
}

const updateEquipment = async (id, data) => {
    let updated = null
    try {
        if (id == null)
            throw createError("No ID passed", 400)

        if (!(typeof data === 'object' && data !== null && !Array.isArray(data)))
            throw createError("No data passed", 400)

        updated = await Equipment.findOneAndUpdate(
            { uuid: id },
            { $set: data },
            { new: true, runValidators: true }
        )

        if (!updated) throw createError(`Equipment { ${id} } not found`, 404)
    } catch (err) {
        throw handleMongooseError(err, 'Error updating equipment')
    }

    return updated
}

const equipmentService = {
    insertManyEquipments,
    deleteEquipmentById,
    getEquipmentById,
    deleteManyEquipments,
    createEquipment,
    updateEquipment,
    getEquipments
}

export default equipmentService