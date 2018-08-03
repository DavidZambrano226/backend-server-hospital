var express = require('express');


var app = express();

//libreria para usar path facilmente

const path = require('path');

//libreria para verificar si la imagen existe en el path
const fs = require('fs');


app.get('/:tabla/:img', (req,res,next)=>{

    var tabla = req.params.tabla;
    var img = req.params.img;

    var pathImagen = path.resolve( __dirname, `../uploads/${tabla}/${img}` );

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);

    }else{
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');

        res.sendFile(pathNoImage);
    }
    
    // res.status(200).json({
    //     ok:true,
    //     mensaje: 'Peticion realizada correctamente'
    // })

});

module.exports = app;