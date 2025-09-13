const db = require("../db");

// Obtener usuarios
exports.obtenerCPP = async (req, res) => {
  const { cpp } = req.query;

  if (!cpp) {
    return res.status(400).json({ error: "El parámetro cpp es requerido" });
  }

  const cppArray = cpp.split(",");

  const query = `
    SELECT 
      SUM(HOMBRES) AS cantidadVarones, 
      SUM(MUJERES) AS cantidadMujeres,
      SUM(TOTAL) AS totalPobladores, 
      (SUM(MENOS_1_ANIO) + SUM(DE_1_A_5_ANIOS) + SUM(DE_6_A_14_ANIOS)) as de0a14,
      SUM(DE_15_A_29) as de14a29,
      SUM(DE_30_A_44) as de30a44,
      SUM(DE_45_A_64) as de44a64,
      SUM(DE_65_A_MAS) as de65amas
    FROM datos_poblacion 
    WHERE CPP IN (?)
  `;

  try {
    const [results] = await db.query(query, [cppArray]);

    const cantidadVarones = results[0]?.cantidadVarones || 0;
    const cantidadMujeres = results[0]?.cantidadMujeres || 0;
    const totalPobladores = results[0]?.totalPobladores || 0;
    const de0a14 = results[0]?.de0a14 || 0;
    const de14a29 = results[0]?.de14a29 || 0;
    const de30a44 = results[0]?.de30a44 || 0;
    const de44a64 = results[0]?.de44a64 || 0;
    const de65amas = results[0]?.de65amas || 0;

    res.json({
      poblacion: {
        cantidadVarones: cantidadVarones.toString(),
        cantidadMujeres: cantidadMujeres.toString(),
        totalPobladores: totalPobladores.toString(),
        porcentajeVarones:
          totalPobladores > 0
            ? ((cantidadVarones / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        porcentajeMujeres:
          totalPobladores > 0
            ? ((cantidadMujeres / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        de0a14: de0a14.toString(),
        de0a14Porcentaje:
          totalPobladores > 0
            ? ((de0a14 / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        de14a29: de14a29.toString(),
        de14a29Porcentaje:
          totalPobladores > 0
            ? ((de14a29 / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        de30a44: de30a44.toString(),
        de30a44Porcentaje:
          totalPobladores > 0
            ? ((de30a44 / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        de44a64: de44a64.toString(),
        de44a64Porcentaje:
          totalPobladores > 0
            ? ((de44a64 / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
        de65amas: de65amas.toString(),
        de65amasPorcentaje:
          totalPobladores > 0
            ? ((de65amas / totalPobladores) * 100).toFixed(2) + "%"
            : "0%",
      },
    });
  } catch (err) {
    console.error("Error en consulta obtenerCPP:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener usuarios
exports.obtenerCPP_PET = async (req, res) => {
  const { cpp } = req.query;

  if (!cpp) {
    return res.status(400).json({ error: "El parámetro cpp es requerido" });
  }

  const cppArray = cpp.split(",");

  const query = `
    SELECT 
      (SUM(DE_15_A_29) + SUM(DE_30_A_44) + SUM(DE_45_A_64) + SUM(DE_65_A_MAS)) as totalPet,
      SUM(DE_15_A_29) as de15a29,
      SUM(DE_30_A_44) as de30a44,
      SUM(DE_45_A_64) as de45a64,
      SUM(DE_65_A_MAS) as de65amas
    FROM datos_poblacion 
    WHERE CPP IN (?)
  `;

  try {
    const [results] = await db.query(query, [cppArray]);

    const de15a29 = results[0]?.de15a29 || 0;
    const de30a44 = results[0]?.de30a44 || 0;
    const de45a64 = results[0]?.de45a64 || 0;
    const de65amas = results[0]?.de65amas || 0;
    const totalPet = results[0]?.totalPet || 0;

    res.json({
      pet: {
        totalPet: totalPet.toString(),
        de15a29: de15a29.toString(),
        de15a29Porcentaje:
          totalPet > 0 ? ((de15a29 / totalPet) * 100).toFixed(2) + "%" : "0%",
        de30a44: de30a44.toString(),
        de30a44Porcentaje:
          totalPet > 0 ? ((de30a44 / totalPet) * 100).toFixed(2) + "%" : "0%",
        de45a64: de45a64.toString(),
        de45a64Porcentaje:
          totalPet > 0 ? ((de45a64 / totalPet) * 100).toFixed(2) + "%" : "0%",
        de65amas: de65amas.toString(),
        de65amasPorcentaje:
          totalPet > 0 ? ((de65amas / totalPet) * 100).toFixed(2) + "%" : "0%",
      },
    });
  } catch (err) {
    console.error("Error en consulta obtenerCPP_PET:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

exports.obtenerPEA_NOPEA = async (req, res) => {
  const { distrito } = req.query;

  if (!distrito) {
    return res.status(400).json({ error: "El parámetro distrito es requerido" });
  }

  const queryPEA = `
    SELECT * 
    FROM bd_censo 
    WHERE distrito = CONCAT('DISTRITO ', ?) 
      AND contexto = 'PEA' 
    LIMIT 3
  `;

  const queryNoPEA = `
    SELECT *
    FROM bd_censo 
    WHERE distrito = CONCAT('DISTRITO ', ?) 
      AND contexto = 'NO PEA'
    LIMIT 3
  `;

  const queryPEAOcupada = `
    SELECT *
    FROM bd_censo 
    WHERE distrito = CONCAT('DISTRITO ', ?) 
      AND contexto = 'Ocupada'
    LIMIT 3
  `;

  const queryPEADesocupada = `
    SELECT *
    FROM bd_censo 
    WHERE distrito = CONCAT('DISTRITO ', ?) 
      AND contexto = 'Desocupada'
    LIMIT 3
  `;

  try {
    // Ejecutamos todas las consultas en paralelo
    const [[resultsPEA], [resultsNoPEA], [resultsOcupada], [resultsDesocupada]] =
      await Promise.all([
        db.query(queryPEA, [distrito]),
        db.query(queryNoPEA, [distrito]),
        db.query(queryPEAOcupada, [distrito]),
        db.query(queryPEADesocupada, [distrito]),
      ]);

    const totalPEA = parseInt(resultsPEA[0]?.Total || 0, 10);
    const totalNoPEA = parseInt(resultsNoPEA[0]?.Total || 0, 10);
    const totalGeneral = totalPEA + totalNoPEA;

    const totalOcupada = parseInt(resultsOcupada[0]?.Total || 0, 10);
    const totalDesocupada = parseInt(resultsDesocupada[0]?.Total || 0, 10);
    const totalGeneral2 = totalOcupada + totalDesocupada;

    const porcentajePEA =
      totalGeneral > 0 ? ((totalPEA / totalGeneral) * 100).toFixed(2) : "0.00";
    const porcentajeNoPEA =
      totalGeneral > 0 ? ((totalNoPEA / totalGeneral) * 100).toFixed(2) : "0.00";

    const porcentajeOcupada =
      totalGeneral2 > 0
        ? ((totalOcupada / totalGeneral2) * 100).toFixed(2)
        : "0.00";
    const porcentajeDesocupada =
      totalGeneral2 > 0
        ? ((totalDesocupada / totalGeneral2) * 100).toFixed(2)
        : "0.00";

    return res.status(200).json({
      pea: totalPEA,
      no_pea: totalNoPEA,
      porcentaje_pea: porcentajePEA + "%",
      porcentaje_no_pea: porcentajeNoPEA + "%",
      ocupada: totalOcupada,
      desocupada: totalDesocupada,
      porcentaje_Ocupada: porcentajeOcupada + "%",
      porcentaje_Desocupada: porcentajeDesocupada + "%",
    });
  } catch (err) {
    console.error("Error en obtenerPEA_NOPEA:", err);
    return res.status(500).json({ error: "Error en la base de datos" });
  }
};

// // Crear usuario
// exports.crearUsuario = (req, res) => {
//   const { nombre, email } = req.body;
//   db.query(
//     "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
//     [nombre, email],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ id: result.insertId, nombre, email });
//     }
//   );
// };
