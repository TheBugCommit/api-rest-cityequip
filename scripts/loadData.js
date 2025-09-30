// scripts/loadData.js
import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Equipment from '../models/Equipment.js';

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

const results = [];

fs.createReadStream('./data/equipments.csv') // tu CSV
  .pipe(csv())
  .on('data', (row) => {
    // 🔹 Limpiar y normalizar datos
    results.push({
      name: row.name?.trim(),
      type: row.type?.trim(),
      address: row.address?.trim(),
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng)
    });
  })
  .on('end', async () => {
    console.log(`Total registros procesados: ${results.length}`);

    // 🔹 Guardar en MongoDB
    try {
      // ⚠️ Solo ejecutar una vez para evitar duplicados
      await Equipment.insertMany(results);
      console.log('Datos cargados correctamente en MongoDB');
    } catch (error) {
      console.error('Error al guardar en MongoDB:', error);
    } finally {
      mongoose.connection.close();
    }
  });
