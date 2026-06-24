const express = require('express');
require('dotenv').config();

const cors = require('cors');
const app = express();

app.use(cors({
    origin:process.env.URL_FRONT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Si también envías formularios con x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    res.send("servidor habilitado");
    console.log("peticion recibida");
})
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor funcionando en ${process.env.PORT}`)
})