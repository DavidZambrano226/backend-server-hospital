// Requires (Librerias de terceros para que funcione algo)
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')



//Inicializar variables
var app = express();


//Body Parse

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importar Rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res)=>{
    //comprobamos si hubo un error en la conexion, de ser asi detengo todo el proceso con throw
    if (err) throw err;


    console.log('Base de datos:\x1b[36m%s\x1b[0m', 'online');


});



//rutas
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/medico',medicoRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);


//Escuchar peticiones
//listen recibe el puerto de escucha
app.listen(3000, ()=>{
    //con la instruccion \x1b[36m%s\x1b[0m le cambio el color a la palabra online
    console.log('Express server corriendo en el puerto 3000:\x1b[36m%s\x1b[0m', 'online');
    
})