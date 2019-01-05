const mongoose = require ('mongoose');
const Schema= mongoose.Schema;


const uniqueValidator =require('mongoose-unique-validator')


let categoriaSchema = new Schema({
    descripcion:{ 
        type:String , 
        unique :true,
        required:[true,'La descripcion es necesaria']
                
    },
    usuario:{

        //Schema.Types.Object permite que se pueda almacenar un object
        type: Schema.Types.ObjectId,
        ref:'Usuario'
    }
});


//categoriaSchema.plugin(uniqueValidator,{message: '{PATH}  debe ser unico'});

module.exports = mongoose.model('Categoria',categoriaSchema);