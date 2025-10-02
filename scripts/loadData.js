import fs from "fs"
import csv from "csv-parser"
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv'
import { deleteManyEquipments, insertManyEquipments } from "../services/equipmentService.js";
import { connectDB, disconnectDB } from "../config/db.js";

dotenv.config()

function cleanString(str) {
  if (!str) return null
  return str
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s\.,:@()\/'-]/gu, "")
    .normalize("NFC")
}

function toBoolean(str) {
  if (!str) return null
  const val = cleanString(str).toLowerCase()
  if (["sí", "si", "true", "1"].includes(val)) return true
  if (["no", "false", "0"].includes(val)) return false
  return null
}

function parseFloatSafe(str) {
  if (!str) return null
  const num = parseFloat(str.toString().replace(",", "."))
  return isNaN(num) ? null : num
}

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

    connectDB().catch(error => {
      console.log(`Error conecting to DB: ${error}`)
      process.exit(1)
    })

    try {
      await deleteManyEquipments({})
      const inserted = await insertManyEquipments(results)
      console.log("Equipments inserted to DB susessfully")
    } catch(err) {
      console.log(`Error inserting equipments to DB: ${err}`)
    } finally {
      disconnectDB()
        .then(() => console.log("🔌 DB connection closed"))
        .catch(err => console.log(`🔌 Error closing connection to DB: ${err}`))
    }
  })

    

