const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosControllers');

// Definir rutas
router.get('/', usuariosController.getUsuarios);
//router.post('/', usuariosController.createUsuario);
router.post('/', (req, res) => {
  if (req.body.action) {
    //casos de uso para cada peticion del endpoint usuarios
    switch (req.body.action) {
      case "login":
        usuariosController.login(req, res);
        break;
      case 'create':
        usuariosController.createUsuario(req, res);
        break;
      case 'update': //en desarrollo
        usuariosController.updateUsuario(req, res);
        break;
      case 'changePermiso':
        usuariosController.changePermission(req, res);
        break;
      case 'activeUser': 
      console.log("ejecutado ...")
        usuariosController.activeUser(req, res);
        break;
      default:
        res.status(400).json({ error: 'Acción no reconocida' });
    }
  } else {
    res.status(400).json({ error: 'Solicitud no válida' });
  }
});

router.put('/', usuariosController.updateUsuario);

module.exports = router;
