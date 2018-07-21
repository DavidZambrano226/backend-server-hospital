// Requires (Librerias de terceros para que funcione algo)
var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables
var app = express();


//conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res)=>{
    //comprobamos si hubo un error en la conexion, de ser asi detengo todo el proceso con throw
    if (err) throw err;


    console.log('Base de datos:\x1b[36m%s\x1b[0m', 'online');


});



//rutas

app.get('/', (req,res,next)=>{
    
    res.status(200).json({
        ok:true,
        mensaje: 'Peticion realizada correctamente'
    })

});


//Escuchar peticiones
//listen recibe el puerto de escucha
app.listen(3000, ()=>{
    //con la instruccion \x1b[36m%s\x1b[0m le cambio el color a la palabra online
    console.log('Express server corriendo en el puerto 3000:\x1b[36m%s\x1b[0m', 'online');
    
})