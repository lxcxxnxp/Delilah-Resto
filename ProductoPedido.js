const Sequelize = require('sequelize');


const db = require('../config/db');

const ProductoPedido = db.define('productoPedido',{
    idPedidoProducto: {        
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        allowNull: false,
        type: Sequelize.STRING,                     
    },
    nombre: {
        allowNull: false,
        type:Sequelize.STRING,

    },
    precio: {
        allowNull: false,
        type:Sequelize.INTEGER,

    }, 
    imagen: Sequelize.STRING      
});

module.exports = ProductoPedido;

