const express = require('express');
app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const cors = require("cors");

//Conexion a BBDD
const db = require('./config/db');
require('dotenv').config({path: 'variables.env'});
require('./models/Productos');
require('./models/Usuarios');
require('./models/Pedidos');
require('./models/ProductoPedido');
const Estados = require('./models/Estados');
const iniciales = require('./createEstados');
db.sync() 
  .then(() => console.log("Conectado a BBDD"))
  .then(async () => {    
    try{  
      await Estados.bulkCreate(iniciales.estados);
      console.log("Estados iniciales guardados")
    }catch(error){
      console.log("Ya existen los estados por defecto")
    }
  })  
  .catch(error => console.log(error));



// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files
app.use(express.static('public/uploads'));

// morgan
app.use(morgan('dev'));

// allow cors
app.use(cors());

// rutas //
app.use('/',routes());

const port = process.env.PORT || 3002;
const host = process.env.HOST || '0.0.0.0';


app.listen(port,host,() => {
    console.log(`Server on port ${port}`);
});