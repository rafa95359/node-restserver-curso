require('./config/config');


const express = require('express');

const mongoose = require('mongoose');

const app = express();

//paquete por defecto para mandar segmentos de path y los arma 

const path = require('path');

const bodyParser = require('body-parser') 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));



//para llamar a usuario.js 
//app.use(require('./routes/usuario'));
//configuracion global de rutas

app.use(require('./routes/index'));



/*coneccion a la base de datos cafe en puerto 27017*/
mongoose.connect(process.env.URLDB ,(err,resp)=>{
  if (err) throw new err;
  console.log('Base de datos ONLINE');

});



app.listen(process.env.PORT,()=>console
.log(`Escuchando peticiones en el puerto ${process.env.PORT}`));