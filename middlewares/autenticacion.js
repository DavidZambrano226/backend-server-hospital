var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==========================================
// Verificar token ( Middelware)
// ==========================================

exports.verificaToken = function(req,res,next){
    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded)=>{

        if (err) {
            return res.status(401).json({
                ok:false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }
        //ponemos disponible la info del usuario en cualquier peticion asi
        req.usuario = decoded.usuario;
        
        //si el token es correcto usamos el next para decirle que continue con las siguientes 
        //funciones, de lo contrario se queda pegada la peticion
        next();
        
    })
}

