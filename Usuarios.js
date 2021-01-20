const Sequelize = require('sequelize');

const Pedidos = require('./Pedidos');

const db = require('../config/db');


const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull:false, 
        unique:true       
    },
    nombre: {
        type: Sequelize.STRING
    },
    telefono: {
        type: Sequelize.STRING
    },
    direccion: {
        type: Sequelize.STRING
    },
    admin: {
        type: Sequelize.BOOLEAN
    },
    activo: Sequelize.BOOLEAN
});

Usuarios.hasMany(Pedidos);

module.exports = Usuarios;