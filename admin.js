const Usuarios = require('../models/Usuarios');
const jwt = require("jsonwebtoken");

module.exports = async (req,res,next) => {
    
    // Trae el token desde el header del request
    const header = req.get("Authorization");

    // filtra el token del header
    const token = header.split(' ')[1];
    let revisarToken;
    // Si el token verifica entonces pasa al middlaware siguiente sino error
    try{
        revisarToken = jwt.verify(token,process.env.SECRETKEY);               
        
        const usuario = await Usuarios.findOne({
            where: {
                id: revisarToken.id
            }
        });

        if(usuario.admin){
            next();
        }else{
            res.status(401).json({
                message: "No eres admin , no puedes avanzar"
            });
        }
        
    }catch(error){
        error.statusCode = 500;
        res.json(error);
    }
    
}
