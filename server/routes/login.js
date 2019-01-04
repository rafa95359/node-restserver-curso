const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login',(req,res)=>{
    let body = req.body;
    
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }
    
        //comparar la contraseña que esta encriptada
        if(! bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });   
        }

        
        
            //creamos el token
        //primero va el objeto "data"
        //segundo el secret
        //por ultimo el tiempo de expiracion esta en s

        let token =jwt.sign({
            usuario : usuarioDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
       


        res.json({
            ok:true,        
            usuario:usuarioDB,
            token
        });
    


    })

    


});





module.exports=app;