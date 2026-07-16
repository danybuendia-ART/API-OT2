const db = require('../db/connection');
// me permite encriptar los datos que entran en su parametro
const { encryptData } = require("../utils/encrypt");


//obtiene los proyectos activos con sus tareas
exports.getProyects = (req, res) => {
    const sql = `
        SELECT
            p.id AS projectId,
            p.nombre AS projectName,
            p.descripcion AS projectDescription,
            p.estatus AS projectStatus,
            p.fecha_inicio AS projectCreatedAt,
            p.fecha_finalizado AS projectCompletedAt,
            t.id AS taskId,
            t.titulo AS taskTitle,
            t.descripcion AS taskDescription,
            t.responsable AS taskAssignedTo,
            t.completado AS taskCompleted,
            t.fecha_inicio AS taskCreatedAt,
            t.fechaEntrega AS taskDueDate,
            t.cantidad AS taskQuantity,
            t.unidad AS taskUnit,
            e.id AS evidenceId,
            e.fileName AS evidenceFileName,
            e.startDate AS evidenceStartDate,
            e.uploadedBy AS evidenceUploadedBy
        FROM proyectos p
        LEFT JOIN tareas t 
            ON p.id = t.fk_proyecto 
            AND t.vista = 1
        LEFT JOIN evidences e
            ON t.id = e.idTask AND e.vista = 1
        WHERE p.activo = 1
        ORDER BY p.id, t.id, e.id;`;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        if (!rows.length) {
            return res.json({ warn: 'no hay proyectos por el momento' });
        }

        const proyectosMap = new Map();
        rows.forEach(row => {
            const projectId = row.projectId;
            if (!proyectosMap.has(projectId)) {
                proyectosMap.set(projectId, {
                    id: projectId,
                    name: row.projectName,
                    description: row.projectDescription,
                    status: row.projectStatus,
                    createdAt: row.projectCreatedAt,
                    completedAt: row.projectCompletedAt,
                    tasks: []
                });
            }

            if (row.taskId) {
                // Buscar si ya existe la tarea en el arreglo
                let task = proyectosMap.get(projectId).tasks.find(t => t.id === row.taskId);
                if (!task) {
                    task = {
                        id: row.taskId,
                        title: row.taskTitle,
                        description: row.taskDescription,
                        assignedTo: row.taskAssignedTo,
                        completed: Boolean(row.taskCompleted),
                        createdAt: row.taskCreatedAt,
                        dueDate: row.taskDueDate,
                        quantity: row.taskQuantity,
                        unit: row.taskUnit,
                        evidences: []
                    };
                    proyectosMap.get(projectId).tasks.push(task);
                }

                if (row.evidenceId) {
                    task.evidences.push({
                        id: row.evidenceId,
                        fileName: row.evidenceFileName,
                        startDate: row.evidenceStartDate,
                        uploadedBy: row.evidenceUploadedBy,
                        url: `/evidences/${row.evidenceFileName}`
                    });
                }
            }
        });

        const proyectos = Array.from(proyectosMap.values());
        //console.log("resultado del objeto: ", proyectos);
        res.json(proyectos);
    });
}

exports.insertProyect = (req, res) => {
    const { estatus, nombre, descripcion, fk_usuario } = req.body;

    db.query(
        'INSERT INTO proyectos (fecha_inicio, estatus, nombre, descripcion, fk_usuario)VALUES(NOW(), ?, ?, ?, ?)',
        [estatus, nombre, descripcion, fk_usuario],
        (err, result) => {
            if (err) {
                console.log("error de base de datos: ", err)
                return detectError(err)
            };
            if (result) {
                const encrypt = encryptData({ message: "Proyecto registrado" });
                res.json(encrypt)
            }
        })
}

exports.modifyStatus = (req, res) => {
    const { id, updates } = req.body;
    db.query(
        `UPDATE proyectos SET estatus = ? WHERE id = ?;`, [updates.status, id],
        (err, result) => {
            if (err) return detectError(err);
            if (result) {
                const encrypt = encryptData({ message: "Estatus modificado" });
                res.json(encrypt)
            }
        }
    )
}

exports.disabledProyect = (req, res) => {
    const { id } = req.body;
    db.query(
        `UPDATE proyectos SET activo = 0 WHERE id = ?;`, [id],
        (err, result) => {
            if (err) return detectError(err);
            if (result) {
                const encrypt = encryptData({ message: "Proyecto eliminado" });
                res.json(encrypt)
            }
        }
    )
}
// la uso para refactorizar al validar si hay errores en la consulta sql
function detectError(err) {
    return res.estatus(500).json({ error: err });
}
// filtrado de todos los proyectos creados para los graficos
exports.getAllProyects = (req, res) => {

}
