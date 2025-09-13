// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: 'centerbeam.proxy.rlwy.net',
//   user: "root",
//   port: 40313,
//   password: "rOiGqhPtRFabuJmnBFHdhoDlHQcgtUug",
//   database: "railway",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error conectando a MySQL:", err);
//     return;
//   }
//   console.log("Conectado a MySQL");
// });

// module.exports = connection;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "centerbeam.proxy.rlwy.net",
  user: "root",
  port: 40313,
  password: "rOiGqhPtRFabuJmnBFHdhoDlHQcgtUug",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;