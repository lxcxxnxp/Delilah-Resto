const express = require('express');
const router = express.Router();

// controladores
const productosController = require('../controllers/productosController');
const usuariosController = require('../controllers/usuariosController');
const pedidosController = require('../controllers/pedidosController');

// middlewares
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

module.exports = () => {

    /**
     * Productos
     */

    // lista de productos
    router.get('/api/v1/productos',
        auth,productosController.getProductos
    );

    // Obtener un producto
    router.get('/api/v1/productos/:id',auth,admin,productosController.getProducto);

    // Agregar producto
    router.post('/api/v1/productos',
        auth,
        admin,
        productosController.uploadFile,
        productosController.agregarProducto
    );

    // Modificar Producto
    router.put('/api/v1/productos/:id',
        auth,
        admin,
        productosController.uploadFile,
        productosController.modificarProducto
    );
    

    // Borrar Producto
    router.delete('/api/v1/productos/:id',auth,admin,productosController.eliminarProductos);

    /**
     * Usuarios
     */
    // registrar
    router.post('/api/v1/register',usuariosController.registrarUsuario);
    //login
    router.post('/api/v1/login',usuariosController.loginUsuario);
    // hacer admin
    router.put('/api/v1/admin/:user',auth,admin,usuariosController.adminUsuario);

    /**
     * Pedidos
     */
    // crea un nuevo pedido
    router.post('/api/v1/pedidos',auth,pedidosController.nuevoPedido);

    // Obtiene todos los pedidos si el usuario es admin , sino solamente los que le pertenecen
    router.get('/api/v1/pedidos',auth,pedidosController.getPedidos);

    // Obtener un pedido
    router.get('/api/v1/pedidos/:id',auth,admin,pedidosController.getPedido);    

    // Modificar pedido
    router.put('/api/v1/pedidos/:id',auth,admin,pedidosController.modificarPedido);

    // Borrar pedido
    router.delete('/api/v1/pedidos/:id',auth,admin,pedidosController.eliminarPedido);


    return router;
}