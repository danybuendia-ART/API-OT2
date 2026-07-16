const db = require('../db/connection');
const { encryptData } = require('../utils/encrypt');

exports.getEmployees = (req, res) => {
    db.query('SELECT * FROM employee ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message || err });
        res.json(encryptData(results));
    });
};

exports.changeEmployee = (req, res) => {
    const {
        id,
        employeeNumber,
        position,
        department,
        email,
        phone,
        address,
        startDate,
        emergencyContact,
        emergencyPhone,
        status,
        name,
        //array certifications,
        //array overtimeRecords 'tiempo extra'
    } = req.body;

    db.query(
        `UPDATE employee SET employeeNumber = ?, position= ?, department = ?, email = ?, 
        phone = ?, address = ?, startDate = ?, emergencyContact = ?, emergencyPhone = ?, status = ?, name= ?  WHERE id = ?`,
        [
            employeeNumber || null,
            position || null,
            department || null,
            email || null,
            phone || null,
            address || null,
            startDate || null,
            emergencyContact || null,
            emergencyPhone || null,
            status || null,
            name || null,
            id
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: error.message || err });

            console.log("modificacion exitosa")
            console.log(encryptData({ message: "Datos Actualizados" }))
            res.json(
                encryptData({
                    message: "Datos Actualizados"
                })
            );
        }
    );
};

exports.addEmployee = (req, res) => {
    const {
        employeeNumber,
        name,
        position,
        department,
        email,
        phone,
        address,
        startDate,
        birthDate,
        emergencyContact,
        emergencyPhone,
        status
    } = req.body;

    db.query(
        'INSERT INTO employee (employeeNumber, position, department, email, phone, address, startDate, birthDate, emergencyContact, emergencyPhone, status, name) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)',
        [
            employeeNumber || null,
            position || null,
            department || null,
            email || null,
            phone || null,
            address || null,
            birthDate ? formatDateToMySQL(birthDate) : null,
            emergencyContact || null,
            emergencyPhone || null,
            status || null,
            name || null
        ],
        (err, result) => {
            if (err) {
                console.log("Respuesta del error: ", err.message || err);
                return res.status(500).json({ error: err.message || err });
            }
            console.log ("Respuesta de la consulta: ",result)
            res.json(
                encryptData({
                    message: 'Empleado registrado correctamente',
                    employeeId: result.insertId
                })
            );
        }
    );
};

function formatDateToMySQL(dateString) {
  const date = new Date(dateString);
  const pad = n => n < 10 ? '0' + n : n;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
