const db = require("../db/connection");
const { encryptData } = require("../utils/encrypt");

exports.saveEvidenceFile = (metadata, fileInfo, res) => {
    return new Promise((resolve, reject) => {
        const taskId = metadata.taskId || metadata.idTask || null;
        const uploadedBy = metadata.uploadedBy || metadata.userId || null;
        const fileName = fileInfo.fileName || "sin-nombre";

        db.query(
            "INSERT INTO evidences(idTask, fileName, startDate, uploadedBy) VALUES (?, ?, NOW(), ?);",
            [taskId, fileName, uploadedBy],
            (err) => {
                if (err) {
                    console.error("Error al guardar evidencia en BD:", err.message);
                    if (res) {
                        console.log("Archivo almacenado en la bd")
                        return res.status(500).json(encryptData({ error: "No se pudo guardar la evidencia" }));
                    }
                    return reject(err);
                }

                console.log("Archivo de evidencia almacenado en BD");
                if (res) {
                    return res.json(encryptData({ message: "Archivo recibido", saved: true }));
                }

                resolve({ saved: true });
            }
        );
    });
};

exports.addEvidences = (req, res) => {
    const metadata = req.body || {};
    const fileInfo = {
        fileName: metadata.fileName || "sin-nombre",
        filePath: metadata.filePath || "uploads/sin-nombre"
    };

    this.saveEvidenceFile(metadata, fileInfo).then((result) => {
        res.json(encryptData({ message: "registro actualizado", ...result }));
    }).catch((err) => {
        console.error(err);
        res.status(500).json(encryptData({ error: "No se pudo guardar la evidencia" }));
    });
};