import app from './app.js'
import { connectDB } from './config/db.config.js'

connectDB()
    .then(() => console.log("✅ DB connected"))
    .catch(error => {
        console.error("❌ Error connecting to DB:", error)
        process.exit(1)
    })

app.set('port', process.env.PORT)
const server = app.listen(app.get('port'), () => {
    console.log(`Express running at PORT ${server.address().port} **`)
})