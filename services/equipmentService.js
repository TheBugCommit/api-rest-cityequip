import Equipment from "../models/Equipment.js"

export const insertManyEquipments = async (data) => {
    if (!Array.isArray(data) || data.length === 0)
        throw new Error("No data to insert")

    const inserted = await Equipment.insertMany(data, { ordered: false })
    return inserted
}

export const deleteManyEquipments = async (filter) => {
    if(!(typeof filter === 'object' && filter !== null && !Array.isArray(filter)))
        throw new Error("No filter passed")

    await Equipment.deleteMany(filter)
}