const db = require('../db/connection');
const { encryptData } = require("../utils/encrypt");

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
  db.query('SELECT id, nombre, correo, permiso FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results.length);
  });
};

// Crear un usuario
exports.createUsuario = (req, res) => {
  const { nombre, correo, pass } = req.body;

  // 1. Verificar si ya existe un usuario con ese nombre o correo
  db.query(
    'SELECT * FROM usuarios WHERE nombre = ? OR correo = ?',
    [nombre, correo],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        //console.log("Intento de registro con nombre o correo ya existente:", { nombre, correo });
        // Ya existe un usuario con ese nombre o correo
        //console.log(`registro dublicado del usuario ${correo}`)
        return res.json(encryptData({
          warn: "El usuario o correo ya está registrados"
        }));
      }

      // 2. Si no existe, insertar el nuevo usuario
      db.query(
        'INSERT INTO usuarios (nombre, correo, pass) VALUES (?, ?, ?)',
        [nombre, correo, pass],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.json(encryptData({ message: "Usuario creado exitosamente" }));
          //console.log("Usuario creado:", { id: result.insertId, nombre, correo, pass });
        }
      );
    }
  );
};
exports.login = (req, res) => {
  const { correo, pass } = req.body;

  db.query(
    'SELECT id, nombre, correo, permiso FROM usuarios WHERE correo = ? AND pass = ?',
    [correo, pass],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        //console.log("Intento de inicio de sesión fallido con correo:", correo);
        return res.json({ warn: 'Credenciales inválidas' });
      }

      //variable que devuelve la encryptacion de la funcion importada
      const encryptedResponse = encryptData(results)

      //console.log("Inicio de sesión exitoso:", { id: results[0].id, nombre: results[0].nombre, correo: results[0].correo });
      res.json({ encryptedResponse }, { message: `inicio de sesión exitoso bienvenid@ ${results[0].nombre}` });
    }
  );
}

exports.updateUsuario = (req, res) => {
  const { id, nombre, correo, pass } = req.body;
  db.query(
    'UPDATE usuarios SET nombre = ?, correo = ?, pass = ? WHERE id = ?',
    [nombre, correo, pass, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, nombre, correo, pass });
    }
  );
};