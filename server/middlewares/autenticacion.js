const jwt = require('jsonwebtoken');

//>>>>>>>>>>>>>
//Verificar Token
//>>>>>>>>>>>>>


//////////////////////////
//Nota el token es el creado al iniciar sesion y 
//a partir de este se dan permisos de crear ususario y actualizarlos
/////////////////////////
let verificaToken=(req,res,next)=>{

        
    //para obtener los header
    let token=req.get('token');

    //comprobar que el token es valido
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{

                    message:'token no valido'
                }

            });

        }
        //decoded es el payload.Informacion decodificada
        req.usuario = decoded.usuario;
        //continua la ejecucion del programa
        next();


    });



};

let verificaAdmin_Role=(req,res,next)=>{
    //
    let usuario = req.usuario;

    if(usuario.role==='ADMIN_ROLE'){
        next();
    }
    else{
        res.json({
            ok:false,
            message:'El usuario no es admon'
        })
    }
}


let verificaTokenImg=(req,res,next)=>{
    let token = req.query.token;

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{

                    message:'token no valido'
                }

            });

        }
        //decoded es el payload.Informacion decodificada
        req.usuario = decoded.usuario;
        //continua la ejecucion del programa
        next();


    });


}



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}