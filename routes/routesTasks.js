const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasksControllers');

// Definir rutas
//router.get('/', usuariosController.getUsuarios);
//router.post('/', usuariosController.createUsuario);
router.post('/', (req, res) => {
  if (req.body.action) {
    //casos de uso para cada peticion del endpoint usuarios
    switch (req.body.action) {
      
      case 'create':
    
        taskController.createTask(req, res);
        break;
      /*case 'update': //en desarrollo
        taskController.updateUsuario(req, res);
        break;*/
      default:
        res.status(400).json({ error: 'Acción no reconocida' });
    }
  } else {
    res.status(400).json({ error: 'Solicitud no válida' });
  }
});

//router.put('/', taskController.updateUsuario);

module.exports = router;
