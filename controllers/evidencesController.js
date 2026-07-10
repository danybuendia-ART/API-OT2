const db = require("../db/connection");

const { encryptData } = require("../utils/encrypt");

exports.addEvidences = (req, res) => {
    const {} = req.body;
    db.query(
        "INSERT INTO evidences()values()", [],
        (err, result) => {
            if (err) {
                console.log("detalles del error: ", err)
            }
            console.log("archivos almacenados")
            res.json(encryptData({ message: "registro actualizado" }))
        }
    );
};