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