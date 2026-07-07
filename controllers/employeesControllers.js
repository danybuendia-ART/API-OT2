const db = require('../db/connection');
const { encryptData } = require('../utils/encrypt');

exports.getEmployees = (req, res) => {
  db.query('SELECT * FROM employee ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.json(results);
  });
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
    'INSERT INTO employee (employeeNumber, position, department, email, phone, address, startDate, birthDate, emergencyContact, emergencyPhone, status, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      employeeNumber || null,
      position || null,
      department || null,
      email || null,
      phone || null,
      address || null,
      startDate || null,
      birthDate || null,
      emergencyContact || null,
      emergencyPhone || null,
      status || null,
      name || null
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message || err });

      res.json(
        encryptData({
          message: 'Empleado registrado correctamente',
          employeeId: result.insertId
        })
      );
    }
  );
};
