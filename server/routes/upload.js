const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs= require('fs');
const path = require('path');

//lo que hace es que todo lo que se este subiendo lo coloca en files
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {



    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400)
            .json({
                ok:false,
                err:{
                    message:'No files were uploaded.'
                }
            });
    }




    //Validar tipos
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidas son ' + tiposValidos.join(', '),
            }
        })
    }



    //en archivo guardammos el archivo que nos mandan
    let archivo = req.files.archivo;


    //restringir el tipo de archivo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];

   

    //extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext:extension
            }
        })
    }




    //Cambiar nombre del archivo
    let nombreArchivo =`${id}-${new Date().getMilliseconds()}.${extension}`


    //este se guarda de esta manera
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, function(err) {
        if (err){        
            return res.status(500).json({
                ok:false,  
                err
            });
        }    
            
    //Aqui ya se que la imagen a sido cargada
    //queremos actualizar la imagen de los usuarios


    if((tipo === 'usuarios')){
        imagenUsuario(id,res,nombreArchivo);
    }else{
        imagenProducto(id,res,nombreArchivo);
    }

    });
});




function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){
            //si hay error entonces borrar la imagen que se subio
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }


        if(!usuarioDB){
            //Si usuario no existe borrar imagen subida
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'usuario no existe',
                }
            })
        }

        //estoy en routes y busca ir a upload
       //let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${usuarioDB.img}`);
       //if(fs.existsSync(pathImagen)){
       //    //se borra la imagen anterior del usuario
       //    fs.unlinkSync(pathImagen);
       //}
       borraArchivo(usuarioDB.img,'usuarios');


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });  

}



function imagenProducto(id,res,nombreArchivo){

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            //si hay error entonces borrar la imagen que se subio
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }


        if(!productoDB){
            //Si usuario no existe borrar imagen subida
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'producto no existe',
                }
            })
        }

        //estoy en routes y busca ir a upload
       //let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${usuarioDB.img}`);
       //if(fs.existsSync(pathImagen)){
       //    //se borra la imagen anterior del usuario
       //    fs.unlinkSync(pathImagen);
       //}
       borraArchivo(productoDB.img,'usuarios');


       productoDB.img = nombreArchivo;

       productoDB.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    });  

}



function borraArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathImagen)){
        //se borra la imagen anterior del usuario
        fs.unlinkSync(pathImagen);
    }

}

module.exports=app;