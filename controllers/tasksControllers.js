
const db = require('../db/connection');
const { encryptData } = require("../utils/encrypt");

exports.createTask = (req, res) => {
    const { assignedTo, completed, description, projectId, quantity, title, unit, dueDate } = req.body;
    db.query(
        `INSERT INTO tareas (fk_proyecto, completado, fecha_inicio, titulo, descripcion, responsable, cantidad, unidad, fechaEntrega)values
        (?, ?, NOW(), ?, ? ,?,?,?,?);`, [projectId, completed, title, description, assignedTo, quantity, unit, dueDate],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(encryptData({ message: "Tarea creada exitosamente" }));
        }
    )
}
exports.changeStatus = (req, res) => {
    const { taskId, updates } = req.body;
    let completed = updates.completed;
    
    completed == true ? completed = 1 : completed = 0;

    db.query(
        `UPDATE tareas SET completado = ? WHERE id = ?;`, [completed, taskId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });

            console.log("estatus de tarea atualizada id: ", taskId);
            res.json(encryptData({ message: "Estatus actualizado" }));
        }
    )
}
// ----------------------------------------------------------------------------
//accion en desarrollo </>
exports.modifyTask = (req, res) => {
    //datos obtenidos desde el front
    const { } = req.body
    db.query(
        `UPDATE tareas SET ... WHERE id = ?;`, [],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(encryptData({ message: "Tarea actualizada exitosamente" }));
        }
    )

}