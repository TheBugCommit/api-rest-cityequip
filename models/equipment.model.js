import mongoose from 'mongoose'

const equipmentSchema = new mongoose.Schema({
  uuid: { 
    type: String, 
    required: true, 
    unique: true 
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
    trim: true
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
  address: {
    prefix: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ['RB', 'CR', 'AV', 'PG', 'PL', 'CM', 'AC', 'CT', 'PE', 'ML', 'CL', 'BL', 'PR', 'PJ', 'DM', 'C', 'PZ', 'PS'],
      required: false
    },
    street: {
      type: String,
      trim: true,
      required: false
    },
    number: {
      type: String,
      trim: true,
      required: false
    },
    block: {
      type: String,
      trim: true,
      required: false
    },
    staircase: {
      type: String,
      trim: true,
      required: false
    },
    floor: {
      type: String,
      trim: true,
      required: false
    },
    door: {
      type: String,
      trim: true,
      required: false
    },
    postalCode: {
      type: String,
      trim: true,
      required: false
    }
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

const Equipment = mongoose.model('Equipment', equipmentSchema)
export default Equipment
