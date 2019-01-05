
const express= require('express');

let {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion');


let app = express();;

let Categoria = require('../models/categoria')

//////////////////////////////
//Mostrar todas las categorias
//////////////////////////////

app.get('/categoria',(req,res)=>{

    let desde =req.query.desde || 0;
    desde=Number(desde);

    let limite= req.query.limite || 5;
    limite=Number(limite);

    Categoria.find()
        .sort('descripcion')//ordenar
        .populate('usuario','nombre email')//revisa que ObjectId hay en la Categoria que estoy solicitando y carga informacion
        .skip(desde)
        .limit(limite)
        .exec((err,categorias)=>{
          if(err){
            return res.status(400).json({
                ok:false,
                err
              });
          }

          Categoria.count((err,conteo)=>{
            res.json({
              ok:true,
              categorias,
              cuantos:conteo
            });

          })

      
    })

});






//////////////////////////////
//Mostrar una categoria por ID
//////////////////////////////

app.get('/categoria/:id',(req,res)=>{
    let id=req.params.id;
    //Categotia.findByID()
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
          return res.status(500).json({
              ok:false,
              err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El id no existe'
                }
            })
        }
        res.json({
          ok:true,
          categoria:categoriaDB
          
        }) 
  
      });



});


app.post('/categoria',verificaToken,(req,res)=>{


    let body =req.body;

    let categoria= new Categoria();
    categoria.descripcion=body.descripcion;
    

    ///se puede devolver todo el object usuario pero depende del modelo
    categoria.usuario=req.usuario._id;


    categoria.save((err,categoriaDB)=>{

        
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB,
        })
    
        
    })


//REGRESA LA NUEVA CATEGORIA
//REQ.USUARIO._ID
});


app.put('/categoria/:id',verificaToken,(req,res)=>{

    let id=req.params.id;

    let body= req.body;
    let desCategoria ={
        descripcion:body.descripcion
    }

    Categoria.findByIdAndUpdate(id,desCategoria,{new:true,runValidators:true},(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
              });
        }
        if(!categoriaDB){
            return res.status(400).json({
              ok:false,
              err
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB         
            

        }) 




    })

    
 });

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
    let id=req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                err
              });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El id no existe'
                }
            })
        }    
        res.json({
          ok:true,
          categoria:categoriaDB
          
        }) ;

    });
    //solo admon
    
});    


module.exports = app;