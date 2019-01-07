const express= require('express');
const fs= require('fs');

let app = express();
let path = require('path');
const {verificaTokenImg}= require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img',verificaTokenImg,(req,res)=>{


    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        //definimos un path absoluto para que no haya problemas
        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg')
        //con sendFile  mostramos de acuerdo al Content-Type que enviamos
        res.sendFile(noImagePath);

    }




    


});

module.exports = app;
