const Sequelize = require('sequelize');


const db = require('../config/db');

const Estados = db.define('estados',{
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,   
        autoIncrement: true,                
    },
    nombre: {
        allowNull: false,
        type:Sequelize.STRING,
    }    
});



module.exports = Estados;