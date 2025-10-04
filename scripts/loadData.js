import fs from "fs"
import dotenv from 'dotenv'
import csv from "csv-parser"
import { v4 as uuidv4 } from "uuid"
import { parse } from 'csv-parse/sync'
import { connectDB, disconnectDB } from "../config/db.config.js";
import equipmentService from "../services/equipment.service.js";
import { cleanString, toBoolean, parseFloatSafe } from "../utils/parse.utils.js"

dotenv.config()

const fixedLines = []
const raw = fs.readFileSync("data/OpenDataTGN_equipamientos.csv", "utf8")
const lines = raw.split("\n").filter((l) => l.trim() !== "")

lines.forEach(line => {
    let i = 0
    while(i < line.length && line[i] != ',')
      i++;
    
    line = '""' + line.slice(0, i) + '""' + line.slice(i)
    const records = parse(line, {
      relax_quotes: true,
      trim: true,
      skip_empty_lines: true
    })

    fixedLines.push(...records[0])
})

fs.writeFileSync("data/equipments_fixed.csv", fixedLines.join("\n"), "utf8")
console.log("✅ CSV fixed: equipments_fixed.csv")

const results = []
fs.createReadStream("data/equipments_fixed.csv")
  .pipe(csv({
    separator: ",",
    skipLines: 0,
  }))
  .on("data", (row) => {
    const data = {
      uuid: uuidv4(),
      nom: cleanString(row.nom),
      horari: cleanString(row.horari),
      tipus: cleanString(row.tipus),
      municipal: toBoolean(row.municipal),
      latitud: parseFloatSafe(row.latitud),
      longitud: parseFloatSafe(row.longitud),
      localitzacio: cleanString(row.localitzacio),
      telefon: cleanString(row.telefon),
      districte: cleanString(row.districte),
      codi_ens: cleanString(row.CODI_ENS),
      nom_ens: cleanString(row.NOM_ENS),
    }
    results.push(data)
  })
  .on("end", async () => {
    console.log(`✅ ${results.length} rows processed`)
    if (results.length === 0) {
      console.error("❌ Error no data to insert in CSV file")
      return
    }

    connectDB().then(async () => {
      try {
        await equipmentService.deleteManyEquipments({})
        const inserted = await equipmentService.insertManyEquipments(results)
        console.log("Equipments inserted to DB susessfully")
      } catch(err) {
        console.log(`Error inserting equipments to DB: ${err}`)
      } finally {
        disconnectDB()
          .then(() => console.log("🔌 DB connection closed"))
          .catch(err => console.log(`🔌 Error closing connection to DB: ${err}`))
      }
    }).catch(error => {
      console.log(`Error conecting to DB: ${error}`)
      process.exit(1)
    })
  })

    

