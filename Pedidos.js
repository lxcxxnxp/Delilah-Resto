const Sequelize = require('sequelize');

const db = require('../config/db');
const ProductoPedido = require('./ProductoPedido');


const Pedidos = db.define('pedidos',{
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,   
        autoIncrement: true,                    
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "NUEVO"
    },
    hora: {
        type: Sequelize.TIME,    
        defaultValue: Sequelize.NOW 
    },
    pago: {
        type: Sequelize.INTEGER
    }
    
}); 

Pedidos.hasMany(ProductoPedido);


module.exports = Pedidos;
