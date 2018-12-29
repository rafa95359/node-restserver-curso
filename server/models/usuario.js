
const mongoose = require('mongoose');
const uniqueValidator =require('mongoose-unique-validator')


/*definimos los roles validos*/
let rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;


let usuarioSchema =new Schema({
    nombre:{
        type:String,
        required: [true,'El nombre es necesario']
    },
    email:  {

        type:String,
        unique:true,
        required: [true,'El email es necesario']
        
    },
    password:{
        type:String,
        required: [true,'La contraseña es necesaria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        //para poner los validos
        
        enum:rolesValidos
    },
    estado:{

        default:true,
        type:Boolean
    },
    google:{
        type:Boolean,
        default:false       
    }

})


//para evitar que se muestre el password
usuarioSchema.methods.toJSON =function(){
    let user=this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchema.plugin(uniqueValidator,{message: '{PATH} email debe ser unico'});

module.exports=mongoose.model('Usuario',usuarioSchema);