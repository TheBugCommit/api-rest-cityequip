import Equipment from "../models/equipment.model.js"

const insertManyEquipments = async (data) => {
    if (!Array.isArray(data) || data.length === 0)
        throw new Error("No data to insert")

    return await Equipment.insertMany(data, { ordered: false })
}

const deleteManyEquipments = async (filter) => {
    if(!(typeof filter === 'object' && filter !== null && !Array.isArray(filter)))
        throw new Error("No filter passed")

    await Equipment.deleteMany(filter)
}

const getEquipmentById = async (id) => {
    if(id == null)
        throw new Error("No Id passed")

    return await Equipment.findById(id)
}

const deleteEquipmentById = async (id) => {
    if(id == null)
        throw new Error("No Id passed")

    return await Equipment.findByIdAndDelete(id)
}

const updateEquipment = async (id) => {

}

const equipmentService = {
    insertManyEquipments, 
    deleteEquipmentById,
    getEquipmentById,
    deleteManyEquipments,
    updateEquipment
}

export default equipmentService