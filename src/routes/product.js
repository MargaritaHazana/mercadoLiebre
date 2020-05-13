var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController')

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

/* GET pag de detalle. */
router.get('/detail/:id/:category', productController.detalleProducto);

// Ruta para editar producto
router.get('/edit/:id', productController.vistaEdit);
router.put('/edit/:id', productController.edit);

// Ruta para eliminar producto
router.get('/delete/:id', productController.vistaDelete);
router.delete('/delete/:id', productController.delete);

// Ruta para crear producto
router.get('/create', productController.vistaCreate);
router.post('/create', upload.any(), productController.create);
  
module.exports = router;