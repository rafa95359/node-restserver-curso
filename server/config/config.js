//>>>>>>>>>>>>>>>
//Puerto
//>>>>>>>>>>>>>>>

process.env.PORT=process.env.PORT||8080;



//>>>>>>>>>>>>>>>
//Entorno
//>>>>>>>>>>>>>>>

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//>>>>>>>>>>>>>>>
//Base de datos
//>>>>>>>>>>>>>>>

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';

}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//>>>>>>>>>>>>>>>
//Verificacion del token
//>>>>>>>>>>>>>>>
//60 seg
//60 m
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN='48h';

//>>>>>>>>>>>>>>>
//SEED de autenticacion
//>>>>>>>>>>>>>>>

process.env.SEED=process.env.SEED||'este-es-el-seed-desarrollo'


//>>>>>>>>>>>>>>>
//GoogleCLient ID
//>>>>>>>>>>>>>>>
process.env.CLIENT_ID = process.env.CLIENT_ID || '407974213524-f2a0amv30u9m2a80r3gsnnh2uh7h7jqq.apps.googleusercontent.com'

