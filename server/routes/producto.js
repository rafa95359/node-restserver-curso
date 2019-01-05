const express =require('express');
const{verificaToken}= require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
 module.exports =  app;


 ///////////////////////////////////
 //Obtener productos
 ///////////////////////////////////

 app.get('/productos',verificaToken,(req,res)=>{
     //trae todos los productos
     //populate: uusuario categoria
     //paginado
    let limite=req.query.limite;
    limite = Number(limite);
    let desde=req.query.desde;
    desde = Number(desde);


    Producto.find({disponible:true})
        .populate('categoria','nombre')
        .populate('usuario','nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err,productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                productos:productoDB
            })


    })
        

 });

 ///////////////////////////////////
 //Obtener productos por ID
 ///////////////////////////////////

 app.get('/productos/:id',verificaToken,(req,res)=>{
    //populate: uusuario categoria

    let id= req.params.id;


    Producto.findById(id,{disponible:true})
        .populate('categoria','nombre')
        .populate('usuario','nombre email')
        .exec((err,productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'No existe el IDproducto'
                    }
                })
            }

            res.json({
                ok:true,
                productos:productoDB
            })


    })
});


///////////////////////////////////
 //Buscar productos 
 ///////////////////////////////////


app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
   
   
    let termino=req.params.termino;

    //para que la busqueda no sea por un valor identico 
    //sino que tenga una parte
    //la i hace que sea indiferemte a may min y punto
    //Ejemplo:
    //Quieres buscar Ensalada Min
    //Formas:Ensala,Min,min,ensal

    let regex =new RegExp(termino,'i');



    Producto.find({nombre:regex})
        .populate('categoria','nombre ')
        .exec((err,productos)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
           

            res.json({
                ok:true,
                productos
            })


        })
})






 ///////////////////////////////////
 //crear productos 
 ///////////////////////////////////

 app.post('/productos',verificaToken,(req,res)=>{
    //grbar el usuario
    //grabar una categoria del listado

    let body=req.body;

    let producto=new Producto({
        nombre : body.nombre ,
        precioUni :body.precioUni,
        descripcion : body.descripcion,
        disponible : true,
        categoria : body.categoria,
        usuario : req.usuario._id
    });

    //console.log(producto);

    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        

        res.status(201).json({
            ok:true,
            productos:productoDB
        })
    });


    
});


 ///////////////////////////////////
 //Actualizar productos 
 ///////////////////////////////////

 app.put('/productos/:id',verificaToken,(req,res)=>{
    let id=req.params.id;

    let body= req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Id no existe'
                }
            })
        }

        productoDB.nombre =body.nombre;
        productoDB.precioUni =body.precioUni;
        productoDB.categoria =body.categoria;
        productoDB.disponible =body.disponible;
        productoDB.descripcion =body.descripcion;


        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                productos:productoGuardado
            })

        });
       
    })


    
});


///////////////////////////////////
 //Borrar productos 
 ///////////////////////////////////

 app.delete('/productos/:id',verificaToken,(req,res)=>{
    //diponible false
    let id=req.params.id;

    let CambioDisponible={
        disponible:false
    }

    Producto.findByIdAndUpdate(id,CambioDisponible,{new:true,runValidators:true},(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Id incorrecto'
                }
            })
        }

        res.json({
            ok:true,
            productos:productoDB
        })

    })



    
});


