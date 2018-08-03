var express = require('express');
var middlewareAuth = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ==========================================
// Obtener todos los medicos
// ==========================================

app.get('/',(req,res)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .skip(desde)
            .limit(5)
            .exec((err,medicos)=>{
                if (err ) {
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error cargando los medicos',
                        errors: err
                    })
                }
                
                Medico.count({}, (err,conteo)=>{
                    res.status(200).json({
                        ok:true,
                        medico: medicos,
                        total: conteo
                    })
                })
    })
})

// ==========================================
// Actualizar un medico
// ==========================================
app.put('/:id',middlewareAuth.verificaToken,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err,medico)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            })
        }
        if (!medico) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El medico con el id: '+id+' No existe',
                errors: {message:'No existe un medico con ese ID'}
            })
        }

        //declaramos los datos a actualizar

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err,medicoGuardado)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al acutalizar el medico',
                    errors:err
                })
            }
            res.status(200).json({
                ok:true,
                medico:medicoGuardado
            })
        })


    })
})


// ==========================================
// Crear un medico
// ==========================================

app.post('/',middlewareAuth.verificaToken,(req,res)=>{
    //obtenemos los datos 
    var body = req.body;

    //definimos el array para crear el hospital
    var medico = new Medico({
        nombre:body.nombre,
        usuario:req.usuario._id,
        hospital:body.hospital
    })

    medico.save((err, medicoGuardado)=>{
        if (err) {
            return res.status(400).json({
                of:false,
                mensaje:'Error al crear el Medico',
                errors:err
            })
        }
        res.status(201).json({
            ok:true,
            medico:medicoGuardado
        })
    })

})


// ==========================================
// Eliminar un medico
// ==========================================

app.delete('/:id',middlewareAuth.verificaToken,(req,res)=>{
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err,medicoBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar el medico',
                errors:err
            })
        }
        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje: 'El medico con el id: '+id+' No existe',
                errors:{message:'No existe un medico con este ID'} 
            })
        }
        res.status(200).json({
            ok:true,
            medico:medicoBorrado
        })
    })

})


module.exports = app;