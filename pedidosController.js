const Pedidos = require('../models/Pedidos');
const Usuarios = require('../models/Usuarios');
const Estados = require('../models/Estados');
const ProductoPedido = require('../models/ProductoPedido');
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");

exports.nuevoPedido =  async (req,res) => {    

    // Trae el token desde el header del request
    const header = req.get("Authorization");

    // filtra el token del header
    const token = header.split(' ')[1];
    let revisarToken;

    // transaction object
    const t = await sequelize.transaction();

    try{        

        revisarToken = jwt.verify(token,process.env.SECRETKEY);               
        
        let usuarioId = revisarToken.id;

        // pago del pedido
        let pago = 0;
        
        req.body.forEach(element => {
            console.log(element)
            if(element.hasOwnProperty("precio")){
                pago += element.precio
            }            
        });
                
        
        // Creo el pedido
        const nuevopedido = await Pedidos.create({
            pago,
            usuarioId
        },{transaction:t});

        // id del pedido
        let pedidoId = nuevopedido.id;

        req.body.forEach(element => {
            element.pedidoId = pedidoId
        });
        

        await ProductoPedido.bulkCreate(req.body,{transaction:t});

        // commit
        await t.commit();

        res.json({
            message: "Pedido creado con exito"
        });
    }catch(error){
        console.log(error);        
        await t.rollback();
        res.status(500).json({           
            message: error.message
        });        
    }
    
}


// Muestra todos los pedidos 
exports.getPedidos = async (req,res) => {    

    // Trae el token desde el header del request
    const header = req.get("Authorization");
        
    // filtra el token del header
    const token = header.split(' ')[1];
    let revisarToken;

    try{     
        
        revisarToken = jwt.verify(token,process.env.SECRETKEY);                

        // traigo el usario para verificar que sea admin
        const usuario = await Usuarios.findAll({
            where: {
                email: revisarToken.email
            }
        });
           
        
        let pedidos = [];
        if(usuario[0].dataValues.admin){
            // Trae todos los pedidos de la BBDD
            pedidos = await Pedidos.findAll();   
        }else{
            // Trae todos los pedidos del usuario de la BBDD
            pedidos = await Pedidos.findAll({
                where: {
                    id: revisarToken.id
                }
            });   
        }
             
        const productoPedidos = await ProductoPedido.findAll(); 
        // guardo los objetos en dos arrays        
        let pedidosArray = [];
        let productosArray = [];
        pedidos.forEach(pedido => {        
            pedidosArray = [...pedidosArray,pedido.dataValues];
        });
        productoPedidos.forEach(producto => {
            productosArray = [...productosArray,producto.dataValues];
        });
        // agrego un parametro productos a los epdidos
        pedidosArray.forEach(pedido => {
            pedido.productos = [];
        });
        // Agrega a los productos en el pedido correspondiente
        pedidosArray.forEach(pedido => {
            productosArray.forEach(producto => {
                if(producto.pedidoId === pedido.id){
                    pedido.productos.push(producto);
                }
            });
        });
        // Respuesta al servidor con ntodos los pedidos y sus respectivos productos
        res.json(
            pedidosArray            
        );
                    
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Ha ocurrido un error"
        });
    }
    
}

// Obtener un solo pedido por el id
exports.getPedido = async (req,res) => {
    try{                                           
        
        // Trae todos los pedidos de la BBDD
        const pedidos = await Pedidos.findAll({
            where:{
                id: req.params.id
            }
        }); 

        if(pedidos.length === 0){
            // si no encuentra ningun producto respuesta al servidor como no encontrado
            res.status(404).json({                
                message: "Pedido no encontrado"                
            });   
        }            
        
             
        const productoPedidos = await ProductoPedido.findAll(); 
        // guardo los objetos en dos arrays        
        let pedidosArray = [];
        let productosArray = [];
        pedidos.forEach(pedido => {        
            pedidosArray = [...pedidosArray,pedido.dataValues];
        });
        productoPedidos.forEach(producto => {
            productosArray = [...productosArray,producto.dataValues];
        });
        // agrego un parametro productos a los epdidos
        pedidosArray.forEach(pedido => {
            pedido.productos = [];
        });
        // Agrega a los productos en el pedido correspondiente
        pedidosArray.forEach(pedido => {
            productosArray.forEach(producto => {
                if(producto.pedidoId === pedido.id){
                    pedido.productos.push(producto);
                }
            });
        });
        
        // Respuesta al servidor con ntodos los pedidos y sus respectivos productos
        res.json(
            pedidosArray            
        );
                                    
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Ha ocurrido un error"
        });
    }
}

// Modificar pedido
exports.modificarPedido = async (req,res) => {
    console.log(req.body)
    // estado a modificar
    let {estado} = req.body;
    console.log(estado)
    // array de estados
    const nuevoEstado = await Estados.findByPk(estado);
    
    console.log(nuevoEstado);

    try{                                           
        
        // Trae todos los pedidos de la BBDD
        // cambia el estado del pedido
        const pedidos = await Pedidos.update(
            {
                estado: nuevoEstado.dataValues.nombre                
            },
            {where:{
                id: req.params.id
            }}
        );                

        if(pedidos[0] == 0){
            // si no encuentra ningun producto respuesta al servidor como no encontrado
            res.status(403).json({                
                message: `El pedido ya se encuentra '${estado}'`                
            });   
        }                                           

        // Respuesta al servidor con ntodos los pedidos y sus respectivos productos        
        res.json({            
            message: "Estado del pedido modificado"                        
        });                
                    
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Ha ocurrido un error"
        });
    }
}

 // Borrar pedido
exports.eliminarPedido = async (req,res) => {
    try{                                           
        
        // Trae todos los pedidos de la BBDD
        // borra el pedido pedido
        const pedido = await Pedidos.destroy({
            where: {
                id: req.params.id
            }
        });      


        if(!pedido){
            // si no encuentra ningun producto respuesta al servidor como no encontrado
            res.status(404).json({                
                message: "Pedido no encontrado"                
            });   
        }                                           

        // Respuesta al servidor con ntodos los pedidos y sus respectivos productos        
        res.json({            
            message: "Pedido eliminado"                        
        });                
                    
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Ha ocurrido un error"
        });
    }
}