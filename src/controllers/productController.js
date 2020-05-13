const fs = require ('fs');


//Pasando el JSON a JS
const listaProductosJSON = fs.readFileSync('/Users/marga/OneDrive/Escritorio/DH/mercadoLiebre/src/controllers/productsDataBase.json', 'utf-8');
const listaProductosJS = JSON.parse (listaProductosJSON);

// Función para redondeo 
const toThousand = n =>
n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
".");

const productController = {
    // Vista del inicio
    index: (req,res) => {

        res.render('index', {listaProductos: listaProductosJS, redondeo: toThousand, view: 'index'});
    },
    // Vista de productos (/products)
    listaProductos:(req,res) => {

        res.render('productos', {listaProductos: listaProductosJS, view: 'index'});
    },
    // Vista del detalle del producto (/product/detail/:id/:category)
    detalleProducto: (req,res) => {

        let productID = req.params.id;
        let productoElegido =  listaProductosJS.find((producto)=> producto.id == productID);

        // Calculando el precio 
        let precio = Math.round(productoElegido.price);
        let precioViejo = '$' + toThousand(precio)

        // Calculando el descuento
        let descuento = productoElegido.price * (productoElegido.discount/100);
        let descuentoRedondeado = Math.round(productoElegido.price - descuento);
        let precioDescuento = '$' + toThousand(descuentoRedondeado);

        res.render('detalle', {productoElegido: productoElegido, precioViejo: precioViejo, precioDescuento: precioDescuento, view: 'detail'});
    },
    // Vista modificar (/product/edit/:id)
    vistaEdit: (req,res)=> {

        let productID = req.params.id;
        let productoElegido = listaProductosJS.find((producto)=> producto.id == productID);

        res.render('edit', {productoElegido: productoElegido, view: 'other'})
    },
    // Método para modificar producto 
    edit: (req,res)=> {

        let productID = req.params.id;
        let productoCambiado = listaProductosJS.find((producto)=> producto.id == productID); 

        productoCambiado = {
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            image: req.body.image,
            category: req.body.category
        } 
        listaProductosJS.map((producto)=> {
            if (producto.id == productID) {
                let position = listaProductosJS.indexOf(producto);
                listaProductosJS.splice(position,1,productoCambiado);
            }
        });

        let listaProductosNuevaJSON = JSON.stringify(listaProductosJS)
        fs.writeFileSync('/Users/marga/OneDrive/Escritorio/DH/mercadoLiebre/src/controllers/productsDataBase.json', listaProductosNuevaJSON);
        
        res.redirect('/product/detail/' + productID + '/' + productoCambiado.category);
    },
    // Vista eliminar (/product/delete/:id)
    vistaDelete: (req,res)=> {

        let productID = req.params.id;
        let productoElegido = listaProductosJS.find((producto)=> producto.id == productID);

        // Calculando el precio 
        let precio = Math.round(productoElegido.price);
        let precioViejo = '$' + toThousand(precio)

        // Calculando el descuento
        let descuento = productoElegido.price * (productoElegido.discount/100);
        let descuentoRedondeado = Math.round(productoElegido.price - descuento);
        let precioDescuento = '$' + toThousand(descuentoRedondeado);
        
        res.render('delete', {productoElegido: productoElegido, precioViejo: precioViejo, precioDescuento: precioDescuento, view: 'other'});
    },
    // Método para eliminar producto
    delete: (req,res)=> {

        let productID = req.params.id;
        let productoElegido = listaProductosJS.find((producto)=> producto.id == productID);

        listaProductosJS.map((producto)=> {
            if (producto.id == productID) {
                let position = listaProductosJS.indexOf(producto);
                listaProductosJS.splice(position,1);
            }
        });
        let listaProductosNuevaJSON = JSON.stringify(listaProductosJS)
        fs.writeFileSync('/Users/marga/OneDrive/Escritorio/DH/mercadoLiebre/src/controllers/productsDataBase.json', listaProductosNuevaJSON);
        
        res.redirect('/')
    },
    // Vista crear (/product/create)
    vistaCreate: (req,res)=> {

        res.render('create', {view: 'other'});
    },
    // Método para crear producto
    create: (req,res,next)=> {

        let productoNuevo = {
            id: listaProductosJS[listaProductosJS.length - 1].id + 1,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            image: req.body.image,
            category: req.body.category
        }
        listaProductosJS.push(productoNuevo)
        let listaProductosNuevaJSON = JSON.stringify(listaProductosJS)
        fs.writeFileSync('/Users/marga/OneDrive/Escritorio/DH/mercadoLiebre/src/controllers/productsDataBase.json', listaProductosNuevaJSON);
       
        res.redirect('/product/detail/' + productoNuevo.id + '/' + productoNuevo.category);
    }
}

module.exports = productController;