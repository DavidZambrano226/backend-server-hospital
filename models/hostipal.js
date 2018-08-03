var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;

var hospitalSchema = new Schema({
    
	nombre: { type: String,	required: [true,	'El	nombre	es	necesario']	},
    img: { type: String,	required: false },
    //asignados un tipo diferente al usuario para indicarleque es una relacion con la 
    //collection usuario
    usuario: { type: Schema.Types.ObjectId,	ref: 'usuario' }
    
},	{ collection: 'hospitales' });
module.exports = mongoose.model('Hospital',	hospitalSchema);