import app from './app.js'
import { connectDB } from './config/db.config.js'

connectDB()
    .then(() => console.log("✅ DB connected"))
    .catch(error => {
        console.error("❌ Error connecting to DB:", error)
        process.exit(1)
    })

app.set('port', process.env.PORT)
const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  const { port } = server.address() || { port: PORT };
  console.log(`Express running at PORT ${port} **`);
});