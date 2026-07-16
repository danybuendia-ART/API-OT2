const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { decryptData } = require("../utils/encrypt");
const { saveEvidenceFile } = require("../controllers/evidencesController");

const router = express.Router();
const uploadDir = path.resolve(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

function getMetadata(body = {}) {
  if (body && body.payload) {
    console.log(body.payload);
    return decryptData(body.payload);
  }
  return body || {};
}

function getTargetFolder(action) {
  const normalizedAction = String(action || "evidences").toLowerCase();

  if (normalizedAction === "invoices" || normalizedAction === "invoice" || normalizedAction === "facturas") {
    return path.resolve(uploadDir, "facturas");
  }

  if (normalizedAction === "quotations" || normalizedAction === "quotation" || normalizedAction === "cotizaciones") {
    return path.resolve(uploadDir, "cotizaciones");
  }

  return path.resolve(uploadDir, "evidences");
}

function buildFileInfo(file) {
  return {
    fileName: file.filename,
    filePath: path.relative(path.resolve(__dirname, ".."), file.path).split(path.sep).join("/"),
    absolutePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const metadata = getMetadata(req.body);
      const targetFolder = getTargetFolder(metadata.action || metadata.type);
      fs.mkdirSync(targetFolder, { recursive: true });
      cb(null, targetFolder);
    } catch (err) {
      console.error("Error al determinar la carpeta de destino:", err);
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const metadata = getMetadata(req.body);
    console.log("Informacion obtenida de evidencias: ", metadata);

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const fileInfo = buildFileInfo(req.file);
    const action = String(metadata.action || metadata.type || "evidences").toLowerCase();

    console.log("Archivo procesado:", fileInfo);

    switch (action) {
      case "evidences":
        await saveEvidenceFile(metadata, fileInfo, res);
        break;
      default:
        return res.status(400).json({ error: "Action no soportada" });
    }
  } catch (err) {
    console.error("Error al procesar archivo:", err);
    res.status(500).json({ error: "Error al procesar archivo" });
  }
});

module.exports = router;
