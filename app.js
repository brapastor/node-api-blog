"use strict";

//Cargar modulos de node para crear el servidor
let express = require('express');
let bodyParser = require('body-parser');

//Ejecutar Express (http)
let app = express();

//Cargar Ficheros rutas
let article_routes = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({extented: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas / Cargar rutas
app.use('/api',article_routes);


//Exportar modulo(fichero actual)
module.exports = app;