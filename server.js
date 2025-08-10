require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const pool = require("./db");
// Probar conexión al iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado a MySQL");
    connection.release(); // devolver conexión al pool
  } catch (err) {
    console.error("Error conectando a MySQL:", err);
  }
})();

// Rutas
const poblacionRoutes = require("./routes/poblacion");
app.use("/api/datos_poblacion", poblacionRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
