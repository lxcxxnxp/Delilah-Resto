const Usuarios = require("../models/Usuarios");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// registrar usuario
exports.registrarUsuario = async(req,res,next) =>  {     
    try{
        console.log(req.body)
        // objeto usuario traido del request
        let {user,nombre,telefono,direccion,password,email} = req.body; 

        password = await bcrypt.hash(password,12);   

        // Creo el usuario en la BBDD
        // es una promesa por eso el await             
        const usuarioNuevo = await Usuarios.create({
            user,
            nombre,
            telefono,
            direccion,
            password,
            email,
            admin: false,
            activo: true
        });
        
        res.json({
            message: "Usuario creado con exito"
        });
    }catch(error){
        console.log(error.name);
        if(error.name === "SequelizeUniqueConstraintError"){
            res.status(500).json({
                message: "Usuario ya existente"
            });
        }else{
            res.status(500).json({
                message: "Ha ocurrido un error"
            });
        }        
    }        
} 

//login
exports.loginUsuario = async(req,res,next) => {    

    // usuario , password
    let {user,password} = req.body;

    try{
        const validarUsuario = await Usuarios.findOne({
            where: {
                user
            }
        });

        if(!validarUsuario){
            res.status(401).json({
                message: "No existe el usuario"
            });
            next();
        }else{

            if(!bcrypt.compareSync(password,validarUsuario.password)){
                // si el password es incorrecto
                await res.status(401).json({
                    mensaje: "Password incorrecto"
                })
                next();
            }else{
                // genero un jwt
                const token = jwt.sign({
                    email: validarUsuario.email,
                    nombre: validarUsuario.nombre,
                    id: validarUsuario.id
                },process.env.SECRETKEY,
                {
                    expiresIn: '1h'
                }
                );

                // respuesta con el token
                res.json({token});
            }
        
        }
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error"
        });
    }    
}

// cambiar admin el usario
exports.adminUsuario = async (req,res,next) => {

    // cambia el estado del usuario a admin
    try{
        const usuario = await Usuarios.findOne({where:{
            user: req.params.user
        }});

        if(usuario.dataValues.admin === true){
            res.status(405).json({
                message: "Este usuario ya es admin"
            });
            next();
        }        

        // actualiza el estado de admin a true
        await Usuarios.update({
            admin: true
        },
        {where:{
            user: req.params.user
        }}
        );

        // respuesta al cliente
        res.json({
            message: "Este usuario ahora es admin"
        });
    }catch(error){
        res.status(500).json({
            message: "Hubo un error"
        });
    }
    
}