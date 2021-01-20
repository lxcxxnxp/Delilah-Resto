// TabladeProductos
const Productos = require('../models/Productos');
const shortid = require('shortid');

// multer
const multer = require('../modules/Multer');

// upload file
exports.uploadFile = (req,res,next) => {
    multer(req,res,function(error){
        if(error) {
            res.json({
                message: error
            });
        }
        return next();
    })
}

// lista de productos
exports.getProductos = async(req,res) => {
    try{
        const productos = await Productos.findAll();
        res.json(productos);
    }catch(error){        
        res.status(500).json({
            message: "Error"
        });
    }    
}

// obtener un producto con el id 
exports.getProducto = async (req,res) => {
    try{
        const producto = await Productos.findOne({
            where: {
                id: req.params.id
            }
        });

        if(!producto){
            res.status(404).json({
                message: "Producto no encontrado"
            });
            next();
        }

        res.json(producto);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error"
        });
    } 
}

// agregar producto
exports.agregarProducto = async (req,res) => {
    
    try{
        const {nombre,precio} = req.body;    
        const productos = await Productos.create({
            id: shortid.generate(),
            nombre,
            precio,
            imagen: req.file.filename
        });
    
        res.json({
            message: "added product"
        });
    }catch(error){
        
        if(error.name === "SequelizeUniqueConstraintError"){
            if(error.errors[0].type === "unique violation"){
                res.status(500).json({
                    message: "Producto Repetido"
                });
            }            
        }else{
            res.status(500).json({
                message: "Error"
            });
        }
                
    }    

}

// modificar productos
exports.modificarProducto = async (req,res) => {
    try{
        const {nombre,precio} = req.body;

        // obtengo el objeto de la bbdd
        await Productos.update(
            {
                nombre,
                precio,
                imagen: req.file.filename
            },
            {where:{
                id: req.params.id
            }}
        );
                
        res.json({
            message: "Producto editado"
        });
    }catch(error){
        if(error.name === "SequelizeUniqueConstraintError"){
            if(error.errors[0].type === "unique violation"){
                res.status(500).json({
                    message: "Producto Repetido"
                });
            }            
        }else{
            res.status(500).json({
                message: "Error"
            });
        }
    }    
    
}

// Eliminar Productos
exports.eliminarProductos = async (req,res,next) => {
    try{
        const producto = await Productos.destroy({
            where: {
                id: req.params.id
            }
        });

        if(!producto){
            res.status(404).json({
                message: "Producto no encontrado"
            });  
            next();
        }

        res.json({            
            message: "Producto eliminado"
        });
    }catch(error){
        res.status(500).json({
            message: "Error"
        });          
    }
} 