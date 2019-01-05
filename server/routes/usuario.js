
const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario')
const {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion')
const app = express()

//el parametro verificaToken esta para que se ejecute y necesita el next para seguir con el resto
//en verificaToken se modifica a req
app.get('/usuario', verificaToken,(req, res)=> {
  

  return res.json({
    //regresa la informacion del token
    usuario:req.usuario, 
    nombre:req.usuario.nombre,
    email:req.usuario.email
  })


//funcion de mongoose  para ver los registros 
  //como paginas skip salta a que,limit la cantidad
  //mandar parametros opcionales {{url}}/usuario?limite=10&desde=10

  let desde =req.query.desde || 0;
  desde=Number(desde);

  let limite= req.query.limite || 5;
  limite=Number(limite);

  //dentro de las llaves se pueden ponder las condiciones de find por ejm: google:true
  //y en los '' se ponen lo que quieres mostrar

  Usuario.find({estado:true},'nombre email  google img')
          .skip(desde)
          .limit(limite)
          .exec((err,usuarios)=>{
            if(err){
              return res.status(400).json({
                  ok:false,
                  err
                });
            }
            Usuario.count({estado:true},(err,conteo)=>{
              res.json({
                ok:true,
                usuarios,
                cuantos:conteo
              });
            })

            
          })
  
  });
  
app.post('/usuario',[verificaToken,verificaAdmin_Role],function (req, res) {  

    //EN REQ.BODY ESTA LO QUE ME MANDAN 
    let body = req.body;
    //CREAMOS UN USUARIO CON EL SCHEMA DE LA DB
    let usuario= new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role



    });

    //GUARDAMOS EN LA BASE DE DATOS  
    usuario.save((err,usuarioDB)=>{
      if(err){
        return res.status(400).json({
            ok:false,
            err
          });
      }



      //pero no es necesario mandar de vuelta la contraseña encriptada
      //usuarioDB.password=null;
      res.json({
          ok:true,
          usuarioes:usuarioDB

      })
    }) 
 });

  


app.put('/usuario/:id',[verificaToken,verificaAdmin_Role], function (req, res) {
  
    let id = req.params.id;
    let body= _.pick(req.body,['nombre',
    'email','img','role','estado']);   


    /* una manera de hacerlo.Pedimos ID nos 
    devuelven en el callback usuarioDB y lo guardamos
    
    
    Usuario.findById(id,(err,usuarioDB)=>{
      usuarioDB.save();
    })

    */    
    //nota : es necesario validar todos los parametros;en este caso se actualizan google y password
    //se soluciona con underscore

    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{

      if(err){
        return res.status(400).json({
            ok:false,
            err
          });
      }
      res.json({
        ok:true,
        usuarioe:usuarioDB
        
      }) 

    });


    
  
    
  });
  

app.delete('/usuario/:id',[verificaToken,verificaAdmin_Role], function (req, res) {
  let id = req.params.id;

  //eliminar fisicamente
  /*Usuario.findByIdAndRemove(id,(err,usuarioDelete)=>{
    if(err){
      return res.status(400).json({
          ok:false,
          err
        });
    };
    if(usuarioDelete === null){
      return res.status(400).json({
        ok:false,
        err:{
          message:'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok:true,
      usuario:usuarioDelete

    })
  });  */
  let cambiaEstado={
    estado: false
  }
  Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioDelete)=>{
    if(err){
      return res.status(400).json({
          ok:false,
          err
        });
    };
    res.json({
      ok:true,
      usuario:usuarioDelete

    })

  })
  




});


  module.exports=app;









  





  

  