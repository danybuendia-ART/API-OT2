
const db = require('../db/connection');
const { encryptData } = require("../utils/encrypt");

exports.createTask = (req, res) => {
    const { assignedTo, completed, description, projectId, quantity, title, unit, dueDate } = req.body;
    db.query(
        `INSERT INTO tareas (fk_proyecto, completado, fecha_inicio, titulo, descripcion, responsable, cantidad, unidad, fechaEntrega)values
        (?, ?, NOW(), ?, ? ,?,?,?,?);`, [projectId, completed, title, description, assignedTo, quantity, unit, formatDateToMySQL(dueDate)],
        (err, result) => {
            if (err) {
                console.log("error de bd:", err);
                return res.status(500).json({ error: err });
            }

            db.query(`UPDATE proyectos SET modificationDate = NOW() WHERE id = ?`, [projectId],
                (err) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: "Error al actualizar la fecha de modificacion"
                        });
                    }

                    res.json(
                        encryptData({
                            message: "Tarea creada exitosamente"
                        }))
                }
            )
        }
    )
}
exports.changeStatus = (req, res) => {
    const { taskId, updates, projectId } = req.body;
    console.log(taskId, updates, projectId)
    let completed = updates.completed ? 1 : 0;

    db.query(
        `UPDATE tareas 
         SET completado = ? 
         WHERE id = ?`,
        [completed, taskId],
        (err) => {

            if (err) {
                console.log(err)
                return res.status(500).json({ error: err });
            }

            db.query(
                `UPDATE proyectos
                 SET modificationDate = NOW()
                 WHERE id = ?`,
                [projectId],
                (err) => {

                    if (err) {
                        console.log(err)

                        return res.status(500).json({
                            error: "Error al actualizar la fecha del proyecto"
                        });
                    }

                    res.json(
                        encryptData({
                            message: "Estatus actualizado"
                        })
                    );
                }
            );
        }
    );
};

exports.deleteTask = (req, res) => {
    const { taskId } = req.body;
    db.query(
        `UPDATE tareas SET vista = 0 WHERE id = ?`, [taskId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json(encryptData({ message: "tarea eliminada" }));
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

function formatDateToMySQL(dateString) {
    const date = new Date(dateString);
    const pad = n => n < 10 ? '0' + n : n;

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
