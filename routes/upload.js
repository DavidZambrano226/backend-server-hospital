var express = require('express');
const fileUpload = require('express-fileupload');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hostipal');
//importamos el filesystem
var fs = require('fs');

var app = express();


// default options
app.use(fileUpload());

app.put('/:tabla/:id', (req,res)=>{

    var tabla = req.params.tabla;
    var id = req.params.id;

    //tablas permitidas
    var tablasValidas = ['hospitales','medicos','usuarios'];

    if (tablasValidas.indexOf(tabla) < 0) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Tabla no valida',
            errors: {message: 'La tabla enviada para almacenar la imagen no es valida'}
        })
    }


    if (!req.files) {
        return res.status(400).json({
            ok:false,
            mensaje: 'No selecciono nada',
            errors: {message: 'No selecciono ninguna imagen'}
        })
    }

    //validamos si es una imagen lo que se cargo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //extensiones de archivo permitidas

    var extensionesValidas = ['png','jpg','gif', 'jpeg'];

    // evaluamos con indexof si se encuntra la coincidencia, si manda valor inferior a 0 es porque no lo encontro
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Extension no valida',
            errors: {message: 'Las extensiones validas son '+extensionesValidas.join(', ')}
        })
    }

    //Nombre de archivo personalizado
    
    //creamos un template literal
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    //mover el archivo del temporal a un path

    var path = `./uploads/${tabla}/${ nombreArchivo }`;

    archivo.mv(path, (err)=>{
        if (err) {
            
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }
        subirPorTipo(tabla, id, nombreArchivo, res);
    })


    
})

function subirPorTipo(tabla, id, nombreArchivo, res){
    if (tabla === 'usuarios') {
        
        
        Usuario.findById(id, (err, usuario)=>{

            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se encontro el usuario con el id '+id,
                    errors: err
                })
            };

            var pathViejo = './uploads/usuarios/'+usuario.img;

            if (fs.existsSync(pathViejo)) {
                
                //eliminamos la imagen antigua
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err,usuarioActualizado)=>{
                
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error al actualizar la imagen',
                        errors: {message:'No fue posible actualizar la imagen de usuario '+err}
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado
                })

            })

        });

    }
    if (tabla === 'medicos') {

        

        Medico.findById(id, (err,medico)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se encontro el medico con el id '+id,
                    errors: err
                })
            };
            //si todo sale bien empezamos definiendo el path antiguo de la imagen
            var pathViejo = './uploads/medicos/'+medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado)=>{
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error al actualizar la imagen',
                        errors: {message:'No fue posible actualizar la imagen del medico '+err}
                    })
                }

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen del medico Actualizada',
                    usuario: medicoActualizado
                })

            })

        })
        
    }
    if (tabla === 'hospitales') {
        
        Hospital.findById(id, (err, hospital)=>{
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se encontro el hospital con el id '+id,
                    errors: err
                })
            };

            var pathViejo = './uploads/hospitales/'+hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado)=>{
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error al actualizar la imagen',
                        errors: {message:'No fue posible actualizar la imagen del hospital '+err}
                    })
                };
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen del hospital Actualizada correctamente',
                    usuario: hospitalActualizado
                })


            })

        })

    }
}

module.exports = app;