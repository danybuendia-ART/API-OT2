
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { decryptData } = require("../utils/encrypt");

const router = express.Router();

// Configuración de multer para guardar en carpeta local de forma compatible con Windows y Linux
const uploadDir = path.resolve(__dirname, "..", "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("archivo"), (req, res) => {
  try {
    // Desencriptar metadatos
    const { payload } = req.body;
    let metadata = {};
    if (payload) {
      metadata = decryptData(payload);
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    // Aquí puedes guardar referencia en DB
    const evidencia = {
      ...metadata,
      fileName: req.file.filename,
      filePath: path.posix.join("uploads", req.file.filename),
      absolutePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    console.log("Evidencia procesada:", evidencia);

    res.json({ message: "Archivo recibido", evidencia });
  } catch (err) {
    console.error("Error al procesar archivo:", err);
    res.status(500).json({ error: "Error al procesar archivo" });
  }
});

module.exports = router;
