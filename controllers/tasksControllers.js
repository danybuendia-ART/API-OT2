
const db = require('../db/connection');
const { encryptData } = require("../utils/encrypt");

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
    db.query('SELECT id, nombre, correo, permiso FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results.length);
        console.log("peticion para obtener usuarios de la bd")
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
                console.log(`registro dublicado del usuario ${correo}`)
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
                    console.log("Usuario creado:", { id: result.insertId, nombre, correo, pass });
                }
            );
        }
    );
};
exports.createTask = (req, res) => {
    const { assignedTo, completed, description, projectId, quantity, title, unit, dueDate } = req.body;
    db.query(
        `INSERT INTO tareas (fk_proyecto, completado, fecha_inicio, titulo, descripcion, responsable, cantidad, unidad, fechaEntrega)values
        (?, ?, NOW(), ?, ? ,?,?,?,?);`, [projectId, completed, title, description, assignedTo, quantity, unit, dueDate],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err });

            }
            console.log("Tarea creada correctamente:", title, description);
            res.json(encryptData({ message: "Usuario creado exitosamente" }));
        }
    )
}
