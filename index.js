const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const { decryptData } = require("./utils/encrypt")

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
            console.log("datos cifrados: ", req.body.payload);
            req.body = decryptData(req.body.payload);
            
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

const proyectoRouter = require('./routes/routesProyectos');
app.use("/proyectos",proyectoRouter);

app.get('/', (req, res) => {
    res.send("servidor habilitado");
    console.log("peticion recibida");
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor funcionando en ${process.env.PORT}`);
});
