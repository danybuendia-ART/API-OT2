const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.URL_FRONT,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔒 Middleware para desencriptar payload
app.use((req, res, next) => {
  if (req.body && req.body.payload) {
    try {
      const secretKey = process.env.KEY_ENCRYPT;
      const bytes = CryptoJS.AES.decrypt(req.body.payload, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // Reemplazar body con el objeto original
      req.body = JSON.parse(decrypted);
      console.log("Payload desencriptado:", req.body);
    } catch (err) {
      console.error("Error al desencriptar payload:", err);
      return res.status(400).json({ error: "Payload inválido" });
    }
  }
  next();
});

// Rutas
const usuariosRouter = require('./routes/routesUsuarios');
app.use("/usuarios", usuariosRouter);

app.get('/', (req, res) => {
  res.send("servidor habilitado");
  console.log("peticion recibida");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor funcionando en ${process.env.PORT}`);
});
