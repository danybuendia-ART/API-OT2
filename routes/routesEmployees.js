const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesControllers');

router.get('/', employeesController.getEmployees);

router.post('/', (req, res) => {
  if (!req.body || !req.body.action) {
    return res.status(400).json({ error: 'Se requiere el campo action' });
  }

  switch (req.body.action) {
    case 'addEmployee':
      employeesController.addEmployee(req, res);
      break;
    default:
      res.status(400).json({ error: 'Acción no reconocida' });
  }
});

module.exports = router;
