const db = require("../db");

// Obtener usuarios
exports.obtenerCPP = (req, res) => {
  const { cpp } = req.query;

  if (!cpp) {
    return res.status(400).json({ error: "El parámetro cpp es requerido" });
  }

  const cppArray = cpp.split(",");

  // Construimos la consulta usando IN (?)
  const query = `SELECT SUM(HOMBRES) AS cantidadVarones, SUM(MUJERES) AS cantidadMujeres,
                  SUM(TOTAL) AS totalPobladores, 
                  (SUM(MENOS_1_ANIO) + SUM(DE_1_A_5_ANIOS) + SUM(DE_6_A_14_ANIOS)) as de0a14,
                  SUM(DE_15_A_29) as de14a29,
                  SUM(DE_30_A_44) as de30a44,
                  SUM(DE_45_A_64) as de44a64,
                  SUM(DE_65_A_MAS) as de65amas
                  FROM datos_poblacion WHERE CPP IN (?)`;

  db.query(query, [cppArray], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

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
        porcentajeVarones: ((cantidadVarones / totalPobladores) * 100).toFixed(2) + "%",
        porcentajeMujeres: ((cantidadMujeres / totalPobladores) * 100).toFixed(2) + "%",
        de0a14: de0a14.toString(),
        de0a14Porcentaje: ((de0a14 / totalPobladores) * 100).toFixed(2) + "%",
        de14a29: de14a29.toString(),
        de14a29Porcentaje: ((de14a29 / totalPobladores) * 100).toFixed(2) + "%",
        de30a44: de30a44.toString(),
        de30a44Porcentaje: ((de30a44 / totalPobladores) * 100).toFixed(2) + "%",
        de44a64: de44a64.toString(),
        de44a64Porcentaje: ((de44a64 / totalPobladores) * 100).toFixed(2) + "%",
        de65amas: de65amas.toString(),
        de65amasPorcentaje: ((de65amas / totalPobladores) * 100).toFixed(2) + "%",
      }
    });

  });
};

// Obtener usuarios
exports.obtenerCPP_PET = (req, res) => {
  const { cpp } = req.query;

  if (!cpp) {
    return res.status(400).json({ error: "El parámetro cpp es requerido" });
  }

  const cppArray = cpp.split(",");

  // Construimos la consulta usando IN (?)
  const query = `SELECT 
                  (SUM(DE_15_A_29) + SUM(DE_30_A_44) + SUM(DE_45_A_64) + SUM(DE_65_A_MAS)) as totalPet,
                  SUM(DE_15_A_29) as de15a29,
                  SUM(DE_30_A_44) as de30a44,
                  SUM(DE_45_A_64) as de45a64,
                  SUM(DE_65_A_MAS) as de65amas
                  FROM datos_poblacion WHERE CPP IN (?)`;

  db.query(query, [cppArray], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const de15a29 = results[0]?.de15a29 || 0;
    const de30a44 = results[0]?.de30a44 || 0;
    const de45a64 = results[0]?.de45a64 || 0;
    const de65amas = results[0]?.de65amas || 0;
    const totalPet = results[0]?.totalPet || 0;

    res.json({
      pet: {
        totalPet: totalPet.toString(),
        de15a29: de15a29.toString(),
        de15a29Porcentaje: ((de15a29 / totalPet) * 100).toFixed(2) + "%",
        de30a44: de30a44.toString(),
        de30a44Porcentaje: ((de30a44 / totalPet) * 100).toFixed(2) + "%",
        de45a64: de45a64.toString(),
        de44a64Porcentaje: ((de45a64 / totalPet) * 100).toFixed(2) + "%",
        de65amas: de65amas.toString(),
        de65amasPorcentaje: ((de65amas / totalPet) * 100).toFixed(2) + "%",
      }
    });

  });
};

exports.obtenerPEA_NOPEA = (req, res) => {
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

  // Ejecutar ambas consultas en paralelo
  db.query(queryPEA, [distrito], (err, resultsPEA) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.query(queryNoPEA, [distrito], (err2, resultsNoPEA) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      db.query(queryPEAOcupada, [distrito], (err2, resultsOcupada) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }

        db.query(queryPEADesocupada, [distrito], (err2, resultsDesocupada) => {
          if (err2) {
            return res.status(500).json({ error: err2.message });
          }

          const totalPEA = parseInt(resultsPEA[0]?.Total || 0, 10);
          const totalNoPEA = parseInt(resultsNoPEA[0]?.Total || 0, 10);
          const totalGeneral = totalPEA + totalNoPEA;
          const totalOcupada = parseInt(resultsOcupada[0]?.Total || 0, 10);
          const totalDesocupada = parseInt(resultsDesocupada[0]?.Total || 0, 10);
          const totalGeneral2 = totalOcupada + totalDesocupada;

          const porcentajePEA = totalGeneral > 0 ? ((totalPEA / totalGeneral) * 100).toFixed(2) : "0.00";
          const porcentajeNoPEA = totalGeneral > 0 ? ((totalNoPEA / totalGeneral) * 100).toFixed(2) : "0.00";

          const porcentajeOcupada = totalGeneral2 > 0 ? ((totalOcupada / totalGeneral2) * 100).toFixed(2) : "0.00";
          const porcentajeDesocupada = totalGeneral2 > 0 ? ((totalDesocupada / totalGeneral2) * 100).toFixed(2) : "0.00";

          console.log("Total PEA:", totalPEA);
          console.log("Total NO PEA:", totalNoPEA);
          console.log("Porcentaje PEA:", porcentajePEA + "%");
          console.log("Porcentaje NO PEA:", porcentajeNoPEA + "%");

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
        });
      });
    });
  });
};

// Crear usuario
exports.crearUsuario = (req, res) => {
  const { nombre, email } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
    [nombre, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, nombre, email });
    }
  );
};
