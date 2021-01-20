const Sequelize = require('sequelize');


const db = require('../config/db');

const Productos = db.define('productos',{
    id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,               
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
},{
    indexes: [
        {
          unique: true,
          fields: ['nombre']
        }
      ]
});



module.exports = Productos;