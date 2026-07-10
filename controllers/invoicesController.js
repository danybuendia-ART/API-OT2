const db = require("../db/connection");

exports.saveInvoiceFile = (metadata, fileInfo) => {
  return new Promise((resolve) => {
    const referenceId = metadata.referenceId || metadata.taskId || metadata.idTask || null;
    const uploadedBy = metadata.uploadedBy || metadata.userId || null;

    db.query(
      "INSERT INTO invoices(referenceId, fileName, filePath, uploadedBy, createdAt) VALUES (?, ?, ?, ?, NOW());",
      [referenceId, fileInfo.fileName, fileInfo.filePath, uploadedBy],
      (err) => {
        if (err) {
          console.error("Error al guardar factura en BD:", err.message);
          return resolve({ saved: false, error: err.message });
        }

        console.log("Archivo de factura almacenado en BD");
        resolve({ saved: true });
      }
    );
  });
};
