import mongoose from 'mongoose'
import { normalizeEquipment } from '../utils/parse.utils.js'
import { v4 as uuidv4 } from "uuid"

const equipmentSchema = new mongoose.Schema({
  uuid: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4()
  },
  nom: { 
    type: String,
    trim: true,
    required: true 
  },
  horari: { 
    type: String,
    trim: true
  },
  tipus: { 
    type: String, 
    trim: true,
    required: true 
  },
  municipal: { 
    type: Boolean,
    required: false,
  },
  latitud: { 
    type: Number,
  },
  longitud: { 
    type: Number, 
  },
  localitzacio: { 
    type: String,
    trim: true, 
  },
  telefon: { 
    type: String, 
    trim: true 
  },
  districte: { 
    type: String, 
    trim: true,
  },
  codi_ens: { 
    type: String, 
    trim: true
  },
  nom_ens: { 
    type: String, 
    trim: true,
    required: true 
  }
}, {
  strict: true,
  collection: 'Equipments',
  timestamps: true
})

equipmentSchema.index({ tipus: 1 }, { collation: { locale: 'ca', strength: 2 } })

equipmentSchema.pre('validate', function (next) {
  normalizeEquipment(this)
  next()
})

equipmentSchema.pre('insertMany', function (next, docs) {
  const documents = docs || this.docs;
  for (const doc of documents){
    if (!doc) continue;
    doc.uuid = uuidv4()
    normalizeEquipment(doc)
  }

  next()
})

equipmentSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  const update = this.getUpdate()
  if (!update) return next()

  const data = update.$set || update

  normalizeEquipment(data)

  next()
})

const Equipment = mongoose.model('Equipment', equipmentSchema)
export default Equipment
