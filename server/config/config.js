//>>>>>>>>>>>>>>>
//Puerto
//>>>>>>>>>>>>>>>

process.env.PORT=process.env.PORT||8081;



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
    urlDB = 'mongodb://cafe-user:rafafk321@ds125469.mlab.com:25469/cafe_node'
}

process.env.URLDB = urlDB;


