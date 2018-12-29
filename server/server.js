require('./config/config');


const express = require('express');

const mongoose = require('mongoose')

const app = express()



const bodyParser = require('body-parser') 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
// parse application/json
app.use(bodyParser.json())


//para llamar a usuario.js 
app.use(require('./routes/usuario'));


/*coneccion a la base de datos cafe en puerto 27017*/
mongoose.connect(process.env.URLDB ,(err,resp)=>{
  if (err) throw new err;
  console.log('Base de datos ONLINE');

});



app.listen(process.env.PORT,()=>console
.log(`Escuchando peticiones en el puerto ${process.env.PORT}`));