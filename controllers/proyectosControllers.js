const db = require('../db/connection');
// me permite encriptar los datos que entran en su parametro
const { encryptData } = require("../utils/encrypt");


//obtiene los proyectos activos
exports.getProyects = (req, res) => {
    db.query('SELECT * FROM proyectos WHERE activo = 1;', (err, result) => {
        if (err) return res.status(500).json({ error: err });

        //aqui tengo que consultar las tareas que hay en cada proyecto obtenido
        // y agregarlas con una nueva clave task con el valor de un objeto, 
        //cada tarea seria un objeto
        let proyectos = []
        if (result.length > 0) {
            /*proyectos = result.map(proyecto => {
                const { fecha_inicio, fecha_finalizado } = proyecto;

            })*/
            /*console.log(
                result.map(x => {
                    const { id, fecha_inicio, fecha_finalizado, estatus, nombre, descripcion, fk_usuario } = x;

                    let resultado = [{
                        fecha_inicio,
                        fecha_finalizado,
                        estatus,
                        nombre,
                        descripcion,
                        fk_usuario,
                        task: []
                    }]

                    return resultado
                })
            )*/

            res.json(result);
        } else {
            res.json({ "warn": "no hay proyectos por el momento" });
        }


    });
}

exports.insertProyect = (req, res) => {
    const { estatus, nombre, descripcion, fk_usuario } = req.body;

    db.query(
        'INSERT INTO proyectos (fecha_inicio, estatus, nombre, descripcion, fk_usuario)VALUES(NOW(), ?, ?, ?, ?)',
        [ estatus, nombre, descripcion, fk_usuario],
        (err, result) => {
            if (err) return detectError(err);
            if (result) {
                const encrypt = encryptData({message:"Proyecto registrado"});
                res.json(encrypt)
            }
        })
}


// la uso para refactorizar al validar si hay errores en la consulta sql
function detectError(err) {
    return res.estatus(500).json({ error: err });
}
// filtrado de todos los proyectos creados para los graficos
exports.getAllProyects = (req, res) => {

}
