var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
   
  var upload = multer({ storage: storage })

// Ruta para registrar usuario
router.get('/register', userController.vistaRegister);
router.post('/register', upload.any(), userController.register);

// Ruta para login 
router.get('/login', userController.vistaLogin);
router.post('/login', userController.login);

// Get para el perfil del usuario
router.get('/profile/:username', userController.vistaProfile);

module.exports = router;
