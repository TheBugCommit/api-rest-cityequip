import fs from "fs"
import dotenv from "dotenv"
import csv from "csv-parser"
import { v4 as uuidv4 } from "uuid"
import { connectDB, disconnectDB } from "../config/db.config.js"
import equipmentService from "../services/equipment.service.js"
import { cleanString, toBoolean, parseFloatSafe } from "../utils/parse.utils.js"
import { parseLocalitzacio, buildLocalitzacio } from "../utils/address.utils.js"

dotenv.config()

const raw = fs.readFileSync("data/OpenDataTGN_equipamientos.csv", "utf8")
let lines = raw.split("\n").filter((l) => l.trim() !== "")

let header = lines.shift().trim()

header = header
  .replace(/^"nom,/, '"nom",')
  .replace(/""$/, '"')
  .split(",")
  .map((h) => h.replace(/""([^"]+)""/g, '"$1"'))
  .join(",")

const fixedLines = lines.map((line) => {
  let clean = line.trim()

  clean = clean.replace(/""$/, '"')
  clean = clean.replace(/""/g, '"')

  const match = clean.match(/^"([^"]+,[^"]+),,/)

  if (match) {
    const fixedName = `"${match[1]}"`
    clean = clean.replace(/^"[^"]+,[^"]+,,/, fixedName + ",,")
  } else {
    let matchStart = clean.match(/^"([^"]*?)"?(,|$)/)
    if (matchStart) {
      const firstField = `"${matchStart[1]}"`
      clean = firstField + clean.slice(matchStart[0].length - 1)
    }
  }

  return clean
})

fs.writeFileSync("data/equipments_fixed.csv", [header, ...fixedLines].join("\n"), "utf8")
console.log("✅ CSV fixed: equipments_fixed.csv")

const results = []
let parsedAddressCount = 0
let addressWithoutPostalCode = 0
let addressParseFailures = 0
let emptyLocalitzacio = 0

fs.createReadStream("data/equipments_fixed.csv")
  .pipe(
    csv({
      separator: ",",
      skipLines: 0,
      quote: '"'
    })
  )
  .on("data", (row) => {
    const cleanedLocalitzacio = cleanString(row.localitzacio)
    const parsedAddress = parseLocalitzacio(cleanedLocalitzacio)

    if (!cleanedLocalitzacio) {
      emptyLocalitzacio += 1
    }

    const data = {
      uuid: uuidv4(),
      nom: cleanString(row.nom),
      horari: cleanString(row.horari),
      tipus: cleanString(row.tipus),
      municipal: toBoolean(row.municipal),
      latitud: parseFloatSafe(row.latitud),
      longitud: parseFloatSafe(row.longitud),
      localitzacio: cleanedLocalitzacio,
      telefon: cleanString(row.telefon),
      districte: cleanString(row.districte),
      codi_ens: cleanString(row.CODI_ENS),
      nom_ens: cleanString(row.NOM_ENS)
    }

    if (parsedAddress) {
      parsedAddressCount += 1
      if (!parsedAddress.postalCode) {
        addressWithoutPostalCode += 1
      }
      data.address = parsedAddress
      const normalizedLocalitzacio = buildLocalitzacio(parsedAddress)
      if (normalizedLocalitzacio) {
        data.localitzacio = normalizedLocalitzacio
      }
    } else if (cleanedLocalitzacio) {
      addressParseFailures += 1
    }

    results.push(data)
  })
  .on("end", async () => {
    console.log(`✅ ${results.length} rows processed`)
    if (results.length === 0) {
      console.error("❌ Error no data to insert in CSV file")
      return
    }

    connectDB()
      .then(async () => {
        try {
          await equipmentService.deleteManyEquipments({})
          await equipmentService.insertManyEquipments(results)
          console.log("Equipments inserted to DB susessfully")
          console.log(`Parsed addresses: ${parsedAddressCount}`)
          if (addressWithoutPostalCode > 0) {
            console.log(`Addresses without postal code: ${addressWithoutPostalCode}`)
          }
          if (addressParseFailures > 0) {
            console.log(`Addresses that could not be parsed: ${addressParseFailures}`)
          }
          if (emptyLocalitzacio > 0) {
            console.log(`Rows with empty localitzacio: ${emptyLocalitzacio}`)
          }
        } catch (err) {
          console.log(`Error inserting equipments to DB: ${err}`)
        } finally {
          disconnectDB()
            .then(() => console.log("DB connection closed"))
            .catch((err) => console.log(`Error closing connection to DB: ${err}`))
        }
      })
      .catch((error) => {
        console.log(`Error conecting to DB: ${error}`)
        process.exit(1)
      })
  })

