const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: 'centerbeam.proxy.rlwy.net',
  user: "root",
  port: 40313,
  password: "rOiGqhPtRFabuJmnBFHdhoDlHQcgtUug",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// connection.connect((err) => {
//   if (err) {
//     console.error("Error conectando a MySQL:", err);
//     return;
//   }
//   console.log("Conectado a MySQL");
// });

module.exports = connection;
