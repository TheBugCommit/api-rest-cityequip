import fs from "fs"
import dotenv from 'dotenv'
import csv from "csv-parser"
import { connectDB, disconnectDB } from "../config/db.config.js";
import equipmentService from "../services/equipment.service.js";
import {  toBoolean } from "../utils/parse.utils.js"

dotenv.config()

const raw = fs.readFileSync("data/OpenDataTGN_equipamientos.csv", "utf8")
let lines = raw.split("\n").filter((l) => l.trim() !== "")

let header = lines.shift().trim()

header = header
  .replace(/^"nom,/, '"nom",')
  .replace(/""$/, '"')
  .split(",")
  .map(h => h.replace(/""([^"]+)""/g, '"$1"')) 
  .join(',')


const fixedLines = lines.map(line => {
  let clean = line.trim()

  clean = clean.replace(/""$/, '"')
  clean = clean.replace(/""/g, '"')

  const match = clean.match(/^"([^"]+,[^"]+),,/)

  if (match) {
    const fixedName = `"${match[1]}"` 
    clean = clean.replace(/^"[^"]+,[^"]+,,/, fixedName + ",,")
  } else {
    let match = clean.match(/^"([^"]*?)"?(,|$)/)
    if (match) {
      const firstField = `"${match[1]}"`
      clean = firstField + clean.slice(match[0].length - 1)
    }
  } 

  return clean
})

fs.writeFileSync("data/equipments_fixed.csv", [header, ...fixedLines].join("\n"), "utf8")
console.log("CSV fixed: equipments_fixed.csv")

const results = []
fs.createReadStream("data/equipments_fixed.csv")
  .pipe(csv({
    separator: ',',
    skipLines: 0,
    quote: '"',
  }))
  .on("data", (row) => {
    const data = {
      nom: row.nom,
      horari: row.horari,
      tipus: row.tipus,
      municipal: toBoolean(row.municipal),
      latitud: row.latitud,
      longitud: row.longitud,
      localitzacio: row.localitzacio,
      telefon: row.telefon,
      districte: row.districte,
      codi_ens: row.CODI_ENS,
      nom_ens: row.NOM_ENS,
    }
    results.push(data)
  })
  .on("end", async () => {
    console.log(`${results.length} rows processed`)
    if (results.length === 0) {
      console.error("Error no data to insert in CSV file")
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
          .then(() => console.log("DB connection closed"))
          .catch(err => console.log(`Error closing connection to DB: ${err}`))
      }
    }).catch(error => {
      console.log(`Error conecting to DB: ${error}`)
      process.exit(1)
    })
  })